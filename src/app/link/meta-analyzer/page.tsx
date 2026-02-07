"use client";

import { useState } from "react";
import { Info, Loader2, FileText } from "lucide-react";

interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  favicon?: string;
}

export default function MetaAnalyzer() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMeta = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setMetadata(null);

    try {
      const response = await fetch(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const meta: MetaData = {
        title: doc.querySelector("title")?.textContent || undefined,
        description:
          doc
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") || undefined,
        keywords:
          doc.querySelector('meta[name="keywords"]')?.getAttribute("content") ||
          undefined,
        ogTitle:
          doc
            .querySelector('meta[property="og:title"]')
            ?.getAttribute("content") || undefined,
        ogDescription:
          doc
            .querySelector('meta[property="og:description"]')
            ?.getAttribute("content") || undefined,
        ogImage:
          doc
            .querySelector('meta[property="og:image"]')
            ?.getAttribute("content") || undefined,
        favicon:
          doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
          doc.querySelector('link[rel="shortcut icon"]')?.getAttribute("href") ||
          undefined,
      };

      setMetadata(meta);
    } catch (err) {
      console.error("分析失败:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Info className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                链接元数据提取
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                提取网页的元数据信息
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              输入URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && analyzeMeta()}
                placeholder="https://example.com"
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <button
                onClick={analyzeMeta}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    分析中
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    提取元数据
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {metadata && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-6">
                元数据信息
              </h3>
              
              <div className="space-y-4">
                {metadata.title && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      标题:
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                      {metadata.title}
                    </div>
                  </div>
                )}

                {metadata.description && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      描述:
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                      {metadata.description}
                    </div>
                  </div>
                )}

                {metadata.keywords && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      关键词:
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                      {metadata.keywords}
                    </div>
                  </div>
                )}

                {metadata.ogTitle && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Open Graph 标题:
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                      {metadata.ogTitle}
                    </div>
                  </div>
                )}

                {metadata.ogImage && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Open Graph 图片:
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <img
                        src={metadata.ogImage}
                        alt="OG Image"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
