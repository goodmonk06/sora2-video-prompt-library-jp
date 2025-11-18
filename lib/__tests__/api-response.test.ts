import { describe, it, expect } from "vitest";
import { formatZodError } from "../api-response";
import { z } from "zod";

describe("API Response Utilities", () => {
  describe("formatZodError", () => {
    it("should format zod errors correctly", () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      });

      try {
        schema.parse({ name: "", age: -1 });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toHaveLength(2);
          expect(formatted[0]).toHaveProperty("path");
          expect(formatted[0]).toHaveProperty("message");
        }
      }
    });

    it("should handle nested path errors", () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1),
          }),
        }),
      });

      try {
        schema.parse({ user: { profile: { name: "" } } });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodError(error);
          expect(formatted[0].path).toBe("user.profile.name");
        }
      }
    });
  });
});
