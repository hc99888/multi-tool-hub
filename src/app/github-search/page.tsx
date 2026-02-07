"use client";

import { useState } from "react";
import { Github, Search, Loader2, ExternalLink, Star, Globe } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  siteName: string;
  snippet: string;
  publishTime?: string;
}

const suggestedQueries = [
  "bpm calculator github",
  "music production tools react",
  "image processing tools web",
  "url analyzer javascript",
  "multi-tool dashboard nextjs",
  "web tools collection",
  "ai image generator",
  "developer tools",
  "react music player",
  "canvas drawing tools",
];

export default function GitHubSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isGitHubResult = (url: string) => {
    return url.includes('github.com');
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch("/api/github-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data.results || []);
      setSummary(data.summary || null);
    } catch (error) {
      console.error("搜索错误:", error);
    } finally {
      setLoading(false);
    }
  };

  const githubResults = results.filter(r => isGitHubResult(r.url));
  const otherResults = results.filter(r => !isGitHubResult(r.url));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              <Github className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                GitHub项目搜索
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                搜索GitHub上的开源项目和相关资源
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="输入搜索关键词，如: bpm calculator github"
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    搜索中
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    搜索
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suggested Queries */}
          {!loading && results.length === 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                推荐搜索:
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((suggestedQuery) => (
                  <button
                    key={suggestedQuery}
                    onClick={() => setQuery(suggestedQuery)}
                    className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                  >
                    {suggestedQuery}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {summary && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" />
                AI摘要
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {summary}
              </p>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                搜索结果 ({results.length})
              </h3>
              
              {/* GitHub Results */}
              {githubResults.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-green-600 dark:text-green-400">
                    <Github className="w-4 h-4" />
                    GitHub 项目 ({githubResults.length})
                  </div>
                  <div className="space-y-3">
                    {githubResults.map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                              {result.title}
                              <Github className="w-4 h-4 text-green-600" />
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {result.snippet}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {result.siteName}
                              </span>
                              {result.publishTime && (
                                <span>{new Date(result.publishTime).toLocaleDateString('zh-CN')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Results */}
              {otherResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Globe className="w-4 h-4" />
                    相关资源 ({otherResults.length})
                  </div>
                  <div className="space-y-3">
                    {otherResults.map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                              {result.title}
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              {result.snippet.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span>{result.siteName}</span>
                              {result.publishTime && (
                                <span>{new Date(result.publishTime).toLocaleDateString('zh-CN')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && query && (
            <div className="text-center py-12">
              <Github className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                没有找到相关结果
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                尝试添加 "github" 关键词来搜索GitHub项目
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              搜索提示
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• 在搜索词中添加 "github" 来查找GitHub项目</li>
              <li>• 使用具体的关键词，如 "bpm calculator" 而不是 "calculator"</li>
              <li>• 添加技术栈关键词，如 "next.js" 或 "react"</li>
              <li>• 查看AI摘要了解搜索结果概览</li>
              <li>• 结果会自动分类显示GitHub项目和相关资源</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
