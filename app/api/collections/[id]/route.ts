import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCollectionSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/collections/[id] - コレクション詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info("Fetching collection", { collectionId: params.id });

    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        prompts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!collection) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "GET", status: "not_found" });
      return errorResponse("コレクションが見つかりませんでした", undefined, 404);
    }

    // プロンプトのJSON解析
    const parsedPrompts = collection.prompts.map((prompt) => ({
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    }));

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/collections/[id]", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "GET", status: "success" });

    return successResponse({ ...collection, prompts: parsedPrompts });
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/collections/[id]", method: "GET" });
    logger.error("Error fetching collection", { collectionId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// PUT /api/collections/[id] - コレクション更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info("Updating collection", { collectionId: params.id, body });

    // バリデーション
    const validatedData = updateCollectionSchema.parse(body);

    // 存在確認
    const existing = await prisma.collection.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "PUT", status: "not_found" });
      return errorResponse("コレクションが見つかりませんでした", undefined, 404);
    }

    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: validatedData,
    });

    // イベント発火
    await events.collectionUpdated(collection);

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/collections/[id]", method: "PUT" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "PUT", status: "success" });

    logger.info("Collection updated", { collectionId: collection.id });

    return successResponse(collection, "コレクションを更新しました");
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/collections/[id]", method: "PUT" });
    logger.error("Error updating collection", { collectionId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// DELETE /api/collections/[id] - コレクション削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info("Deleting collection", { collectionId: params.id });

    // 存在確認
    const existing = await prisma.collection.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "DELETE", status: "not_found" });
      return errorResponse("コレクションが見つかりませんでした", undefined, 404);
    }

    // デフォルトコレクションは削除不可
    if (existing.isDefault) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "DELETE", status: "forbidden" });
      return errorResponse("デフォルトコレクションは削除できません", undefined, 403);
    }

    await prisma.collection.delete({
      where: { id: params.id },
    });

    // イベント発火
    await events.collectionDeleted({ id: params.id, name: existing.name });

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/collections/[id]", method: "DELETE" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections/[id]", method: "DELETE", status: "success" });

    logger.info("Collection deleted", { collectionId: params.id });

    return successResponse({ success: true }, "コレクションを削除しました");
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/collections/[id]", method: "DELETE" });
    logger.error("Error deleting collection", { collectionId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
