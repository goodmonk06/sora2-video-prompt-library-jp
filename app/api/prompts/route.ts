import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPromptSchema, searchPromptsSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

// GET /api/prompts - 一覧取得（検索・フィルタ対応）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    // バリデーション
    const validatedParams = searchPromptsSchema.parse({
      search,
      tag,
      limit,
      offset,
    });

    const prompts = await prisma.promptPreset.findMany({
      where: {
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
        ],
      },
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

    return successResponse(parsedPrompts);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/prompts - 新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
      },
    });

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    };

    return successResponse(response, "プロンプトを作成しました", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
