import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
}

/**
 * 成功レスポンスを返す
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ data, message }, { status });
}

/**
 * エラーレスポンスを返す
 */
export function errorResponse(error: string, details?: any, status = 500) {
  return NextResponse.json({ error, details }, { status });
}

/**
 * Zodバリデーションエラーをフォーマットする
 */
export function formatZodError(error: ZodError) {
  const formatted = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return formatted;
}

/**
 * エラーハンドリングのヘルパー
 */
export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return errorResponse(
      "バリデーションエラー",
      formatZodError(error),
      400
    );
  }

  if (error instanceof Error) {
    return errorResponse(error.message, undefined, 500);
  }

  return errorResponse("予期しないエラーが発生しました", undefined, 500);
}
