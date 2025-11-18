import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePromptSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

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
      return errorResponse("プロンプトが見つかりませんでした", undefined, 404);
    }

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags || "[]"),
      styleKeywords: JSON.parse(prompt.styleKeywords || "[]"),
    };

    return successResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/prompts/[id] - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = updatePromptSchema.parse(body);

    // 存在確認
    const existing = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
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

    const prompt = await prisma.promptPreset.update({
      where: { id: params.id },
      data: updateData,
    });

    const response = {
      ...prompt,
      tags: JSON.parse(prompt.tags),
      styleKeywords: JSON.parse(prompt.styleKeywords),
    };

    return successResponse(response, "プロンプトを更新しました");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/prompts/[id] - 削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 存在確認
    const existing = await prisma.promptPreset.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return errorResponse("プロンプトが見つかりませんでした", undefined, 404);
    }

    await prisma.promptPreset.delete({
      where: { id: params.id },
    });

    return successResponse({ success: true }, "プロンプトを削除しました");
  } catch (error) {
    return handleApiError(error);
  }
}
