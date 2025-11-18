import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFavoriteSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/favorites - お気に入り一覧取得
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || "default";

    logger.info("Fetching favorites", { userId });

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        promptPreset: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // プロンプトのJSON解析
    const parsedFavorites = favorites.map((fav) => ({
      ...fav,
      promptPreset: {
        ...fav.promptPreset,
        tags: JSON.parse(fav.promptPreset.tags || "[]"),
        styleKeywords: JSON.parse(fav.promptPreset.styleKeywords || "[]"),
      },
    }));

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/favorites", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/favorites", method: "GET", status: "success" });

    return successResponse(parsedFavorites);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/favorites", method: "GET" });
    logger.error("Error fetching favorites", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// POST /api/favorites - お気に入り追加
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info("Adding favorite", { body });

    // バリデーション
    const validatedData = createFavoriteSchema.parse(body);

    const favorite = await prisma.favorite.create({
      data: validatedData,
      include: {
        promptPreset: true,
      },
    });

    // イベント発火
    await events.favoriteAdded(favorite);

    // メトリクス記録
    metrics.incrementCounter(METRICS.FAVORITE_ADDED);
    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/favorites", method: "POST" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/favorites", method: "POST", status: "success" });

    logger.info("Favorite added", { favoriteId: favorite.id });

    return successResponse(favorite, "お気に入りに追加しました", 201);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/favorites", method: "POST" });
    logger.error("Error adding favorite", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
