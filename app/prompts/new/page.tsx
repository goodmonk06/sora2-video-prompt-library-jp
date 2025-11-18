"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPromptPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainPrompt: "",
    negativePrompt: "",
    tags: "",
    lengthSeconds: 5,
    styleKeywords: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          mainPrompt: formData.mainPrompt,
          negativePrompt: formData.negativePrompt,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t),
          lengthSeconds: formData.lengthSeconds,
          styleKeywords: formData.styleKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/prompts/${data.id}`);
      } else {
        alert("プロンプトの作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create prompt:", error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">新規プロンプト作成</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 未来都市の夕暮れ"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明 *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="このプロンプトの概要を日本語で記述"
            />
          </div>

          {/* メインプロンプト */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メインプロンプト（英語） *
            </label>
            <textarea
              required
              value={formData.mainPrompt}
              onChange={(e) =>
                setFormData({ ...formData, mainPrompt: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="A futuristic cityscape at sunset, neon lights reflecting off glass buildings..."
            />
          </div>

          {/* ネガティブプロンプト */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ネガティブプロンプト（英語）
            </label>
            <textarea
              value={formData.negativePrompt}
              onChange={(e) =>
                setFormData({ ...formData, negativePrompt: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="blurry, low quality, distorted..."
            />
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ（日本語、カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SF, 都市, 夕暮れ"
            />
          </div>

          {/* スタイルキーワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              スタイルキーワード（カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.styleKeywords}
              onChange={(e) =>
                setFormData({ ...formData, styleKeywords: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cinematic, slow motion, aerial view"
            />
          </div>

          {/* 長さ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              動画の長さ（秒） *
            </label>
            <input
              type="number"
              required
              min={1}
              max={60}
              value={formData.lengthSeconds}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lengthSeconds: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "作成中..." : "作成"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
