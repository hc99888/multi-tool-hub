"use client";

import { useState } from "react";
import { Image as ImageIcon, Download, Loader2, Sparkles } from "lucide-react";

export default function AlbumCoverGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<"2K" | "4K">("2K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetPrompts = [
    "一张充满未来感的电子音乐专辑封面，霓虹灯光，赛博朋克风格",
    "温暖的民谣专辑封面，木吉他，自然风光，黄昏时分",
    "摇滚乐专辑封面，黑色背景，火焰元素，强烈的视觉冲击",
    "爵士乐专辑封面，复古风格，萨克斯，咖啡厅氛围",
    "古典音乐专辑封面，优雅的钢琴，月光，宁静的夜晚",
    "嘻哈音乐专辑封面，街头涂鸦，城市夜景，潮流元素",
    "电子舞曲专辑封面，彩色几何图形，动态感强",
    "流行音乐专辑封面，青春活力，明亮色彩，简约时尚"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `音乐专辑封面设计：${prompt}，高质量，专业风格，适合音乐平台使用`,
          size,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrls && data.imageUrls.length > 0) {
        setGeneratedImage(data.imageUrls[0]);
      } else {
        setError(data.error || "生成失败，请重试");
      }
    } catch (err) {
      console.error("生成错误:", err);
      setError("网络错误，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `album-cover-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("下载错误:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-950 dark:via-pink-950 dark:to-red-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                专辑封面生成器
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                使用AI生成专业的音乐专辑封面
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Input */}
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  描述你想要的专辑封面
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一张充满未来感的电子音乐专辑封面，霓虹灯光，赛博朋克风格..."
                  className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white min-h-[150px] resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  rows={5}
                />
              </div>

              {/* Preset Prompts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  选择预设风格
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetPrompts.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(preset)}
                      className="text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  图像尺寸
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSize("2K")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                      size === "2K"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    2K (高清)
                  </button>
                  <button
                    onClick={() => setSize("4K")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                      size === "4K"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    4K (超清)
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    生成专辑封面
                  </>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Right Side - Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                预览效果
              </label>
              
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                {loading ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">正在生成专辑封面...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="生成的专辑封面"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      生成的专辑封面将显示在这里
                    </p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {generatedImage && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载专辑封面
                </button>
              )}

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  使用提示
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• 描述要具体，包括风格、颜色、主题等</li>
                  <li>• 可以参考知名专辑的封面设计</li>
                  <li>• 4K分辨率生成时间较长，请耐心等待</li>
                  <li>• 生成完成后可直接下载使用</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
