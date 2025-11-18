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
  quality: z.number().int().min(1).max(5).optional(),
  collectionId: z.string().optional(),
});

export const updatePromptSchema = createPromptSchema.partial();

export const searchPromptsSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  collectionId: z.string().optional(),
  isArchived: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

// Collection バリデーションスキーマ
export const createCollectionSchema = z.object({
  name: z.string().min(1, "コレクション名は必須です").max(100, "コレクション名は100文字以内で入力してください"),
  description: z.string().max(500, "説明は500文字以内で入力してください").optional().default(""),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "カラーコードは#から始まる6桁の16進数である必要があります").optional(),
  icon: z.string().max(50).optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

// Favorite バリデーションスキーマ
export const createFavoriteSchema = z.object({
  promptPresetId: z.string().min(1, "プロンプトIDは必須です"),
  userId: z.string().optional().default("default"),
});

// Export バリデーションスキーマ
export const exportSchema = z.object({
  format: z.enum(["json", "csv", "markdown"], {
    errorMap: () => ({ message: "フォーマットはjson、csv、markdownのいずれかである必要があります" }),
  }),
  includeCollections: z.boolean().optional().default(false),
  collectionId: z.string().optional(),
});

// 型エクスポート
export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type SearchPromptsInput = z.infer<typeof searchPromptsSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
export type ExportInput = z.infer<typeof exportSchema>;
