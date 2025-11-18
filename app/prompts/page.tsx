"use client";

import { useEffect, useState } from "react";
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
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptPreset[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, [search, selectedTag]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedTag) params.append("tag", selectedTag);

      const response = await fetch(`/api/prompts?${params}`);
      const data = await response.json();
      setPrompts(data);

      // 全タグを抽出
      const tags = new Set<string>();
      data.forEach((prompt: PromptPreset) => {
        prompt.tags.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">プロンプト一覧</h1>
        <Link
          href="/prompts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      {/* 検索・フィルタ */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="タイトル、説明、プロンプトで検索..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグフィルタ
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">すべて</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* プロンプト一覧 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">プロンプトが見つかりませんでした。</p>
          <Link
            href="/prompts/new"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
          >
            最初のプロンプトを作成する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {prompt.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {prompt.description}
              </p>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">メインプロンプト:</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {prompt.mainPrompt}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{prompt.lengthSeconds}秒</span>
                <span>{new Date(prompt.createdAt).toLocaleDateString("ja-JP")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
