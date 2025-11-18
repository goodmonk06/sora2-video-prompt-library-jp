import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/prompts/[id] - 詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}

// PUT /api/prompts/[id] - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { tags, styleKeywords, ...otherFields } = body;

    const updateData: any = { ...otherFields };
    if (tags) updateData.tags = JSON.stringify(tags);
    if (styleKeywords) updateData.styleKeywords = JSON.stringify(styleKeywords);

    const prompt = await prisma.promptPreset.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    });
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}

// DELETE /api/prompts/[id] - 削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.promptPreset.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}
