import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exportSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-response";
import { exportAdapters } from "@/lib/adapters/export.adapter";
import { metrics, METRICS } from "@/lib/metrics";
import { logger } from "@/lib/logger";

// GET /api/export - データエクスポート
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "json";
    const includeCollections = searchParams.get("includeCollections") === "true";
    const collectionId = searchParams.get("collectionId") || undefined;

    logger.info("Exporting data", { format, includeCollections, collectionId });

    // バリデーション
    const validatedParams = exportSchema.parse({
      format,
      includeCollections,
      collectionId,
    });

    // データ取得
    const promptsQuery: any = {
      orderBy: { createdAt: "desc" },
    };

    if (collectionId) {
      promptsQuery.where = { collectionId };
    }

    const prompts = await prisma.promptPreset.findMany(promptsQuery);

    // プロンプトのJSON解析
    const parsedPrompts = prompts.map((prompt) => ({
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    }));

    // コレクション取得（オプション）
    let collections = undefined;
    if (includeCollections) {
      collections = await prisma.collection.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    // エクスポートデータ準備
    const exportData = {
      prompts: parsedPrompts,
      collections,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalPrompts: parsedPrompts.length,
        format: validatedParams.format,
      },
    };

    // アダプターを使ってエクスポート
    const adapter = exportAdapters[validatedParams.format];
    const content = await adapter.export(exportData);

    // メトリクス記録
    const responseTime = Date.now() - startTime;
    metrics.recordHistogram(METRICS.API_RESPONSE_TIME, responseTime, { endpoint: "/api/export", method: "GET" });
    metrics.incrementCounter(METRICS.API_REQUEST, { endpoint: "/api/export", method: "GET", status: "success" });
    metrics.incrementCounter("export_total", { format: validatedParams.format });

    logger.info("Data exported successfully", { format: validatedParams.format, promptCount: parsedPrompts.length });

    // ファイルとしてダウンロード
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `sora2-prompts-${timestamp}${adapter.getFileExtension()}`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": adapter.getContentType(),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    metrics.incrementCounter(METRICS.API_ERROR, { endpoint: "/api/export", method: "GET" });
    logger.error("Error exporting data", { error: error instanceof Error ? error.message : String(error) });
    return handleApiError(error);
  }
}
