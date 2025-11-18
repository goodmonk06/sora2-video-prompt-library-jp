"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface PromptPreset {
  id: string;
  title: string;
  description: string;
  mainPrompt: string;
  negativePrompt: string;
  tags: string[];
  lengthSeconds: number;
  styleKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PromptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<PromptPreset | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPrompt();
    }
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${id}`);
      if (response.ok) {
        const result = await response.json();
        // 新しいAPIレスポンス形式に対応
        const data = result.data || result;
        setPrompt(data);
      } else {
        const error = await response.json();
        alert(error.error || "プロンプトが見つかりませんでした");
        router.push("/prompts");
      }
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("コピーに失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/prompts");
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      alert("エラーが発生しました");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!prompt) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6">
        <Link
          href="/prompts"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← 一覧に戻る
        </Link>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{prompt.title}</h1>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 px-4 py-2 rounded-md border border-red-600 hover:bg-red-50"
          >
            削除
          </button>
        </div>
        <p className="text-gray-600 mt-2">{prompt.description}</p>
      </div>

      {/* メタ情報 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">動画の長さ</p>
            <p className="text-lg font-semibold">{prompt.lengthSeconds}秒</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">作成日</p>
            <p className="text-lg font-semibold">
              {new Date(prompt.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最終更新</p>
            <p className="text-lg font-semibold">
              {new Date(prompt.updatedAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>
      </div>

      {/* メインプロンプト */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">メインプロンプト</h2>
          <button
            onClick={() => handleCopy(prompt.mainPrompt)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {copied ? "コピーしました!" : "コピー"}
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
            {prompt.mainPrompt}
          </pre>
        </div>
      </div>

      {/* ネガティブプロンプト */}
      {prompt.negativePrompt && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">ネガティブプロンプト</h2>
            <button
              onClick={() => handleCopy(prompt.negativePrompt)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              コピー
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {prompt.negativePrompt}
            </pre>
          </div>
        </div>
      )}

      {/* タグとキーワード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* タグ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">タグ</h2>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.length > 0 ? (
              prompt.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">タグなし</p>
            )}
          </div>
        </div>

        {/* スタイルキーワード */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">スタイルキーワード</h2>
          <div className="flex flex-wrap gap-2">
            {prompt.styleKeywords.length > 0 ? (
              prompt.styleKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">キーワードなし</p>
            )}
          </div>
        </div>
      </div>

      {/* フルプロンプトコピー */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-3">フルプロンプト（統合版）</h2>
        <p className="text-sm text-gray-600 mb-3">
          メインプロンプトとスタイルキーワードを統合したテキストです
        </p>
        <button
          onClick={() => {
            const fullPrompt = [
              prompt.mainPrompt,
              prompt.styleKeywords.length > 0
                ? prompt.styleKeywords.join(", ")
                : "",
            ]
              .filter(Boolean)
              .join(". ");
            handleCopy(fullPrompt);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-md hover:from-blue-700 hover:to-purple-700"
        >
          フルプロンプトをコピー
        </button>
      </div>
    </div>
  );
}
