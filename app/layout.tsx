import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sora2 動画プロンプトライブラリ",
  description: "Sora2用の動画プロンプトを構造化して管理するツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <a href="/prompts" className="flex items-center text-xl font-bold text-blue-600">
                  Sora2 プロンプトライブラリ
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/prompts"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  一覧
                </a>
                <a
                  href="/prompts/new"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  新規作成
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
