"use client";

import { useState } from "react";
import { Link2, CheckCircle, XCircle, Loader2, Globe } from "lucide-react";

interface ValidationResult {
  valid: boolean;
  statusCode?: number;
  statusText?: string;
  url?: string;
  error?: string;
}

export default function URLValidator() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/url-validator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        error: "验证失败，请检查网络连接"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Link2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                URL有效性检查
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                快速验证URL是否可访问
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
                onKeyPress={(e) => e.key === "Enter" && handleValidate()}
                placeholder="https://example.com"
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleValidate}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    验证中
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    验证
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className={`rounded-xl p-6 ${
              result.valid
                ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  result.valid
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {result.valid ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    result.valid
                      ? "text-green-900 dark:text-green-300"
                      : "text-red-900 dark:text-red-300"
                  }`}>
                    {result.valid ? "URL有效" : "URL无效"}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">URL:</span>
                      <span className="font-mono text-slate-900 dark:text-white">{result.url || url}</span>
                    </div>
                    
                    {result.statusCode && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">状态码:</span>
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
            </div>
          )}

          {/* Examples */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              测试示例
            </h3>
            <div className="space-y-2">
              {[
                "https://www.google.com",
                "https://www.github.com",
                "https://www.example.com",
              ].map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  onClick={() => setUrl(exampleUrl)}
                  className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all font-mono text-sm"
                >
                  {exampleUrl}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              使用说明
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• 输入完整的URL（包含协议，如 https://）</li>
              <li>• 点击"验证"按钮或按回车键开始验证</li>
              <li>• 支持HTTP和HTTPS协议</li>
              <li>• 验证会检查URL是否可以正常访问</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
