import { describe, it, expect } from "vitest";
import { createPromptSchema, updatePromptSchema, searchPromptsSchema } from "../validations";

describe("Validation Schemas", () => {
  describe("createPromptSchema", () => {
    it("should validate correct prompt data", () => {
      const validData = {
        title: "Test Prompt",
        description: "This is a test prompt",
        mainPrompt: "A beautiful sunset over the ocean",
        negativePrompt: "blurry, low quality",
        tags: ["nature", "ocean"],
        lengthSeconds: 10,
        styleKeywords: ["cinematic", "slow motion"],
      };

      const result = createPromptSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should apply default values", () => {
      const minimalData = {
        title: "Test",
        description: "Test description",
        mainPrompt: "Test prompt",
      };

      const result = createPromptSchema.parse(minimalData);
      expect(result.negativePrompt).toBe("");
      expect(result.tags).toEqual([]);
      expect(result.lengthSeconds).toBe(5);
      expect(result.styleKeywords).toEqual([]);
    });

    it("should reject empty title", () => {
      const invalidData = {
        title: "",
        description: "Description",
        mainPrompt: "Prompt",
      };

      const result = createPromptSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject title longer than 200 characters", () => {
      const invalidData = {
        title: "a".repeat(201),
        description: "Description",
        mainPrompt: "Prompt",
      };

      const result = createPromptSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject lengthSeconds out of range", () => {
      const invalidData = {
        title: "Test",
        description: "Description",
        mainPrompt: "Prompt",
        lengthSeconds: 0,
      };

      const result = createPromptSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      const invalidData2 = {
        title: "Test",
        description: "Description",
        mainPrompt: "Prompt",
        lengthSeconds: 61,
      };

      const result2 = createPromptSchema.safeParse(invalidData2);
      expect(result2.success).toBe(false);
    });
  });

  describe("updatePromptSchema", () => {
    it("should allow partial updates", () => {
      const partialData = {
        title: "Updated Title",
      };

      const result = updatePromptSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("should allow empty object", () => {
      const result = updatePromptSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("searchPromptsSchema", () => {
    it("should validate search parameters", () => {
      const validParams = {
        search: "sunset",
        tag: "nature",
        limit: 20,
        offset: 10,
      };

      const result = searchPromptsSchema.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it("should apply default values", () => {
      const result = searchPromptsSchema.parse({});
      expect(result.limit).toBe(50);
      expect(result.offset).toBe(0);
    });

    it("should reject invalid limit", () => {
      const invalidParams = {
        limit: 101,
      };

      const result = searchPromptsSchema.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it("should reject negative offset", () => {
      const invalidParams = {
        offset: -1,
      };

      const result = searchPromptsSchema.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });
  });
});
