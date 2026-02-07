"use client";

import { useState } from "react";
import { Image as ImageIcon, Sparkles, Download, Upload, Loader2 } from "lucide-react";

export default function ImageEnhancer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancementType, setEnhancementType] = useState("quality");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setEnhancedImage(null);

    // 模拟增强处理
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 这里应该调用实际的图像增强API
    // 目前使用原图作为示例
    setEnhancedImage(preview);
    setLoading(false);
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    
    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = `enhanced-${selectedFile?.name || "image.png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const enhancements = [
    { id: "quality", name: "画质提升", desc: "提升整体图像质量" },
    { id: "sharpness", name: "锐化", desc: "增强图像清晰度" },
    { id: "color", name: "色彩增强", desc: "优化色彩饱和度" },
    { id: "denoise", name: "降噪", desc: "减少图像噪点" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                图片增强
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                使用AI技术提升图片质量
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload and Settings */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block text-center"
                >
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                    点击上传图片
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    支持 JPG、PNG、WebP 格式
                  </p>
                </label>
              </div>

              {/* Enhancement Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  选择增强类型
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {enhancements.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setEnhancementType(item.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        enhancementType === item.id
                          ? "bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      <div className="font-semibold mb-1">{item.name}</div>
                      <div className="text-xs opacity-80">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhance Button */}
              <button
                onClick={handleEnhance}
                disabled={!selectedFile || loading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始增强
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                预览效果
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Original */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    原图
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="原图"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Enhanced */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    增强后
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {loading ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">处理中...</p>
                      </div>
                    ) : enhancedImage ? (
                      <img
                        src={enhancedImage}
                        alt="增强后"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              {enhancedImage && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载增强后的图片
                </button>
              )}

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  使用提示
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• 支持常见的图片格式</li>
                  <li>• 建议上传分辨率较高的图片</li>
                  <li>• 可以多次尝试不同的增强类型</li>
                  <li>• 处理时间取决于图片大小</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
