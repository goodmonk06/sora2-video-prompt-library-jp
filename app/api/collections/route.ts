import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCollectionSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";
import { events } from "@/lib/events";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/collections - コレクション一覧取得
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    logger.info("Fetching collections");

    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { prompts: true },
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/collections", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections", method: "GET", status: "success" });

    return successResponse(collections);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/collections", method: "GET" });
    logger.error("Error fetching collections", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}

// POST /api/collections - 新規コレクション作成
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    logger.info("Creating collection", { body });

    // バリデーション
    const validatedData = createCollectionSchema.parse(body);

    const collection = await prisma.collection.create({
      data: validatedData,
    });

    // イベント発火
    await events.collectionCreated(collection);

    // メトリクス記録
    metrics.incrementCounter(METRICS.COLLECTION_CREATED);
    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/collections", method: "POST" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/collections", method: "POST", status: "success" });

    logger.info("Collection created", { collectionId: collection.id });

    return successResponse(collection, "コレクションを作成しました", 201);
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/collections", method: "POST" });
    logger.error("Error creating collection", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
