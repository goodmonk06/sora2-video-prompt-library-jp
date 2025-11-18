export interface PromptPreset {
  id: string;
  title: string;
  description: string;
  mainPrompt: string;
  negativePrompt: string;
  tags: string[];
  lengthSeconds: number;
  styleKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptInput {
  title: string;
  description: string;
  mainPrompt: string;
  negativePrompt?: string;
  tags?: string[];
  lengthSeconds?: number;
  styleKeywords?: string[];
}

export interface UpdatePromptInput extends Partial<CreatePromptInput> {}
