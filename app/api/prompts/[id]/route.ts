import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePromptSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/prompts/[id] - 詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info("Fetching prompt", { promptId: params.id });

    const prompt = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "GET", status: "not_found" });
      return errorResponse("プロンプトが見つかりませんでした", undefined, 404);
    }

    // 閲覧数をインクリメント（非同期で実行）
    prisma.promptPreset.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    }).catch((err) => logger.warn("Failed to increment view count", { promptId: params.id, error: err }));

    // イベント発火
    events.promptViewed({ promptId: params.id }).catch((err) => logger.warn("Failed to emit viewed event", { error: err }));

    // メトリクス記録
    metrics.incrementCounter(METRICS.PROMPT_VIEWED);

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    };

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/prompts/[id]", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "GET", status: "success" });

    return successResponse(response);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/prompts/[id]", method: "GET" });
    logger.error("Error fetching prompt", { promptId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// PUT /api/prompts/[id] - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info("Updating prompt", { promptId: params.id, body });

    // バリデーション
    const validatedData = updatePromptSchema.parse(body);

    // 存在確認
    const existing = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "PUT", status: "not_found" });
      return errorResponse("プロンプトが見つかりませんでした", undefined, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.mainPrompt !== undefined) updateData.mainPrompt = validatedData.mainPrompt;
    if (validatedData.negativePrompt !== undefined) updateData.negativePrompt = validatedData.negativePrompt;
    if (validatedData.tags !== undefined) updateData.tags = JSON.stringify(validatedData.tags);
    if (validatedData.lengthSeconds !== undefined) updateData.lengthSeconds = validatedData.lengthSeconds;
    if (validatedData.styleKeywords !== undefined) updateData.styleKeywords = JSON.stringify(validatedData.styleKeywords);
    if (validatedData.quality !== undefined) updateData.quality = validatedData.quality;
    if (validatedData.collectionId !== undefined) updateData.collectionId = validatedData.collectionId;

    const prompt = await prisma.promptPreset.update({
      where: { id: params.id },
      data: updateData,
    });

    // 履歴作成
    await prisma.promptHistory.create({
      data: {
        promptPresetId: prompt.id,
        snapshot: JSON.stringify(prompt),
        changeType: "updated",
      },
    });

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    };

    // イベント発火
    await events.promptUpdated(response);

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/prompts/[id]", method: "PUT" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "PUT", status: "success" });

    logger.info("Prompt updated", { promptId: prompt.id });

    return successResponse(response, "プロンプトを更新しました");
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/prompts/[id]", method: "PUT" });
    logger.error("Error updating prompt", { promptId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// DELETE /api/prompts/[id] - 削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info("Deleting prompt", { promptId: params.id });

    // 存在確認
    const existing = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "DELETE", status: "not_found" });
      return errorResponse("プロンプトが見つかりませんでした", undefined, 404);
    }

    await prisma.promptPreset.delete({
      where: { id: params.id },
    });

    // イベント発火
    await events.promptDeleted({ id: params.id, title: existing.title });

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/prompts/[id]", method: "DELETE" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/prompts/[id]", method: "DELETE", status: "success" });

    logger.info("Prompt deleted", { promptId: params.id });

    return successResponse({ success: true }, "プロンプトを削除しました");
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/prompts/[id]", method: "DELETE" });
    logger.error("Error deleting prompt", { promptId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
