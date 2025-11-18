import { z } from "zod";

// PromptPreset バリデーションスキーマ
export const createPromptSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200, "タイトルは200文字以内で入力してください"),
  description: z.string().min(1, "説明は必須です").max(1000, "説明は1000文字以内で入力してください"),
  mainPrompt: z.string().min(1, "メインプロンプトは必須です").max(5000, "メインプロンプトは5000文字以内で入力してください"),
  negativePrompt: z.string().max(2000, "ネガティブプロンプトは2000文字以内で入力してください").optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  lengthSeconds: z.number().int().min(1, "動画の長さは1秒以上である必要があります").max(60, "動画の長さは60秒以内である必要があります").optional().default(5),
  styleKeywords: z.array(z.string()).optional().default([]),
});

export const updatePromptSchema = createPromptSchema.partial();

export const searchPromptsSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

// 型エクスポート
export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type SearchPromptsInput = z.infer<typeof searchPromptsSchema>;
