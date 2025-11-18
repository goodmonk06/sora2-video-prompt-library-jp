import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// DELETE /api/favorites/[id] - お気に入り削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info("Removing favorite", { favoriteId: params.id });

    // 存在確認
    const existing = await prisma.favorite.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/favorites/[id]", method: "DELETE", status: "not_found" });
      return errorResponse("お気に入りが見つかりませんでした", undefined, 404);
    }

    await prisma.favorite.delete({
      where: { id: params.id },
    });

    // イベント発火
    await events.favoriteRemoved({ id: params.id, promptPresetId: existing.promptPresetId });

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/favorites/[id]", method: "DELETE" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/favorites/[id]", method: "DELETE", status: "success" });

    logger.info("Favorite removed", { favoriteId: params.id });

    return successResponse({ success: true }, "お気に入りから削除しました");
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/favorites/[id]", method: "DELETE" });
    logger.error("Error removing favorite", { favoriteId: params.id, error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
