import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPromptSchema, searchPromptsSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/prompts - 一覧取得（検索・フィルタ対応）
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const collectionId = searchParams.get("collectionId") || undefined;
    const isArchived = searchParams.get("isArchived") === "true" ? true : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    logger.info("Fetching prompts", { search, tag, collectionId, isArchived, limit, offset });

    // バリデーション
    const validatedParams = searchPromptsSchema.parse({
      search,
      tag,
      collectionId,
      isArchived,
      limit,
      offset,
    });

    const whereClause: any = {
      AND: [
        validatedParams.search
          ? {
              OR: [
                { title: { contains: validatedParams.search } },
                { description: { contains: validatedParams.search } },
                { mainPrompt: { contains: validatedParams.search } },
              ],
            }
          : {},
        validatedParams.tag
          ? {
              tags: { contains: validatedParams.tag },
            }
          : {},
        validatedParams.collectionId
          ? { collectionId: validatedParams.collectionId }
          : {},
        validatedParams.isArchived !== undefined
          ? { isArchived: validatedParams.isArchived }
          : {},
      ],
    };

    const prompts = await prisma.promptPreset.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: validatedParams.limit,
      skip: validatedParams.offset,
    });

    // JSON文字列をパース
    const parsedPrompts = prompts.map((prompt) => ({
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    }));

    // メトリクス記録
    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/prompts", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts", method: "GET", status: "success" });

    return successResponse(parsedPrompts);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/prompts", method: "GET" });
    logger.error("Error fetching prompts", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// POST /api/prompts - 新規作成
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info("Creating prompt", { body });

    // バリデーション
    const validatedData = createPromptSchema.parse(body);

    const prompt = await prisma.promptPreset.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        mainPrompt: validatedData.mainPrompt,
        negativePrompt: validatedData.negativePrompt,
        tags: JSON.stringify(validatedData.tags),
        lengthSeconds: validatedData.lengthSeconds,
        styleKeywords: JSON.stringify(validatedData.styleKeywords),
        quality: validatedData.quality,
        collectionId: validatedData.collectionId,
      },
    });

    // 履歴作成
    await prisma.promptHistory.create({
      data: {
        promptPresetId: prompt.id,
        snapshot: JSON.stringify(prompt),
        changeType: "created",
      },
    });

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    };

    // イベント発火
    await events.promptCreated(response);

    // メトリクス記録
    metrics.incrementCounter(METRICS.PROMPT_CREATED);
    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/prompts", method: "POST" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts", method: "POST", status: "success" });

    logger.info("Prompt created", { promptId: prompt.id });

    return successResponse(response, "プロンプトを作成しました", 201);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/prompts", method: "POST" });
    logger.error("Error creating prompt", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
