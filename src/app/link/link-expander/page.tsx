"use client";

import { useState } from "react";
import { ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function LinkExpander() {
  const [shortUrl, setShortUrl] = useState("");
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expandUrl = async () => {
    if (!shortUrl.trim()) return;

    setLoading(true);
    setExpandedUrl(null);
    setError(null);

    try {
      const response = await fetch(shortUrl, {
        redirect: "follow",
      });

      if (response.ok) {
        setExpandedUrl(response.url);
      } else {
        setError("无法访问该URL");
      }
    } catch (err) {
      setError("展开失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <ExternalLink className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                短链还原
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                展开短链接获取原始URL
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              输入短链接
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && expandUrl()}
                placeholder="https://bit.ly/..."
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <button
                onClick={expandUrl}
                disabled={loading || !shortUrl.trim()}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    展开
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    展开
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {expandedUrl && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-green-500 text-white">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
                    展开成功
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        短链接:
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
                        {shortUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        原始URL:
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
                        {expandedUrl}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-500 text-white">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">
                    展开失败
                  </h3>
                  <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              测试示例
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "https://bit.ly/example",
                "https://goo.gl/example",
                "https://t.co/example",
              ].map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  onClick={() => setShortUrl(exampleUrl)}
                  className="text-left p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all font-mono text-sm"
                >
                  {exampleUrl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
