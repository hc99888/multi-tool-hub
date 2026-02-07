"use client";

import { useState } from "react";
import { ArrowRight, Route, Loader2 } from "lucide-react";

interface RedirectStep {
  url: string;
  statusCode: number;
  type: string;
}

export default function RedirectTracker() {
  const [url, setUrl] = useState("");
  const [redirects, setRedirects] = useState<RedirectStep[]>([]);
  const [loading, setLoading] = useState(false);

  const trackRedirects = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setRedirects([]);

    try {
      const response = await fetch(url, {
        redirect: "manual",
      });

      const steps: RedirectStep[] = [];
      let currentUrl = url;
      let currentResponse = response;

      steps.push({
        url: currentUrl,
        statusCode: currentResponse.status,
        type: "初始请求",
      });

      let redirectCount = 0;
      const maxRedirects = 10;

      while (
        (currentResponse.status === 301 ||
          currentResponse.status === 302 ||
          currentResponse.status === 303 ||
          currentResponse.status === 307 ||
          currentResponse.status === 308) &&
        redirectCount < maxRedirects
      ) {
        const location = currentResponse.headers.get("location");
        if (!location) break;

        // 解析相对URL
        const nextUrl = new URL(location, currentUrl).toString();
        currentUrl = nextUrl;

        const nextResponse = await fetch(currentUrl, {
          redirect: "manual",
        });

        steps.push({
          url: currentUrl,
          statusCode: nextResponse.status,
          type: `重定向 #${redirectCount + 1}`,
        });

        currentResponse = nextResponse;
        redirectCount++;
      }

      if (redirectCount < maxRedirects && currentResponse.ok) {
        steps.push({
          url: currentResponse.url,
          statusCode: currentResponse.status,
          type: "最终目标",
        });
      }

      setRedirects(steps);
    } catch (err) {
      console.error("追踪失败:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950 dark:to-fuchsia-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Route className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                重定向追踪
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                追踪URL的重定向路径
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
                onKeyPress={(e) => e.key === "Enter" && trackRedirects()}
                placeholder="https://example.com"
                className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <button
                onClick={trackRedirects}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    追踪中
                  </>
                ) : (
                  <>
                    <Route className="w-5 h-5" />
                    追踪
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {redirects.length > 0 && (
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-violet-900 dark:text-violet-300 mb-6">
                重定向路径 ({redirects.length} 步)
              </h3>
              
              <div className="space-y-4">
                {redirects.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        index === redirects.length - 1
                          ? "bg-green-500 text-white"
                          : "bg-violet-500 text-white"
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {step.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            step.statusCode >= 200 && step.statusCode < 300
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : step.statusCode >= 300 && step.statusCode < 400
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}>
                            {step.statusCode}
                          </span>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
                          {step.url}
                        </div>
                      </div>
                    </div>

                    {index < redirects.length - 1 && (
                      <div className="ml-6 mt-2 flex items-center gap-2">
                        <div className="flex-1 h-0 border-l-2 border-dashed border-violet-300 dark:border-violet-700"></div>
                        <ArrowRight className="w-5 h-5 text-violet-500" />
                        <div className="flex-1 h-0 border-r-2 border-dashed border-violet-300 dark:border-violet-700"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
