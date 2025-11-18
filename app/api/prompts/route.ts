import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/prompts - 一覧取得（検索・フィルタ対応）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const prompts = await prisma.promptPreset.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                  { mainPrompt: { contains: search } },
                ],
              }
            : {},
          tag
            ? {
                tags: { contains: tag },
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // JSON文字列をパース
    const parsedPrompts = prompts.map((prompt) => ({
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    }));

    return NextResponse.json(parsedPrompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

// POST /api/prompts - 新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      mainPrompt,
      negativePrompt = "",
      tags = [],
      lengthSeconds = 5,
      styleKeywords = [],
    } = body;

    const prompt = await prisma.promptPreset.create({
      data: {
        title,
        description,
        mainPrompt,
        negativePrompt,
        tags: JSON.stringify(tags),
        lengthSeconds,
        styleKeywords: JSON.stringify(styleKeywords),
      },
    });

    return NextResponse.json({
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}
