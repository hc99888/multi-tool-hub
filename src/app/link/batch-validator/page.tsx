"use client";

import { useState } from "react";
import { Link2, CheckCircle, XCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface URLResult {
  url: string;
  valid: boolean;
  statusCode?: number;
  statusText?: string;
  error?: string;
}

export default function BatchValidator() {
  const [urls, setUrls] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [results, setResults] = useState<URLResult[]>([]);
  const [validating, setValidating] = useState(false);

  const addUrl = () => {
    if (inputUrl.trim() && !urls.includes(inputUrl.trim())) {
      setUrls([...urls, inputUrl.trim()]);
      setInputUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const validateAll = async () => {
    if (urls.length === 0) return;

    setValidating(true);
    setResults([]);

    const resultsPromises = urls.map(async (url) => {
      try {
        const response = await fetch("/api/url-validator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();
        return {
          url,
          ...data
        };
      } catch (error) {
        return {
          url,
          valid: false,
          error: "验证失败"
        };
      }
    });

    const allResults = await Promise.all(resultsPromises);
    setResults(allResults);
    setValidating(false);
  };

  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Link2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                批量链接验证
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                同时验证多个URL的有效性
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              添加URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addUrl()}
                placeholder="https://example.com"
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                onClick={addUrl}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加
              </button>
            </div>
          </div>

          {/* URL List */}
          {urls.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  待验证URL ({urls.length})
                </h3>
                <button
                  onClick={() => setUrls([])}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  清空列表
                </button>
              </div>
              
              <div className="space-y-2">
                {urls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <Link2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="flex-1 font-mono text-sm text-slate-700 dark:text-slate-300 truncate">
                      {url}
                    </span>
                    <button
                      onClick={() => removeUrl(index)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={validateAll}
                disabled={validating || urls.length === 0}
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    验证中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    开始批量验证
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    有效: {validCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    无效: {invalidCount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      result.valid
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        result.valid
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}>
                        {result.valid ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-mono text-sm text-slate-900 dark:text-white mb-1">
                          {result.url}
                        </div>
                        
                        {result.statusCode && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-600 dark:text-slate-400">状态:</span>
                            <span className={`font-bold ${
                              result.statusCode >= 200 && result.statusCode < 300
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {result.statusCode}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {result.statusText}
                            </span>
                          </div>
                        )}
                        
                        {result.error && (
                          <div className="text-sm text-red-700 dark:text-red-400">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {urls.length === 0 && results.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                使用说明
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• 在输入框中输入URL，点击"添加"按钮</li>
                <li>• 可以添加多个URL到验证列表</li>
                <li>• 点击"开始批量验证"验证所有URL</li>
                <li>• 验证结果会显示每个URL的状态</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
