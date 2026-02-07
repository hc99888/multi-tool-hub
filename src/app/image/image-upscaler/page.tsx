"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, Download, Loader2, Maximize } from "lucide-react";

export default function ImageUpscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState<2 | 4>(2);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setUpscaledImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setUpscaledImage(null);

    // 模拟放大处理
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 在实际应用中，这里应该调用图像放大API
    // 目前使用原图作为示例
    setUpscaledImage(preview);
    setLoading(false);
  };

  const handleDownload = () => {
    if (!upscaledImage) return;
    
    const link = document.createElement("a");
    link.href = upscaledImage;
    link.download = `upscaled-${scale}x-${selectedFile?.name || "image.png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <Maximize className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                图片放大
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                使用AI技术智能放大图片
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload and Settings */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 hover:border-cyan-500 transition-colors">
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

              {/* Scale Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  选择放大倍数
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setScale(2)}
                    className={`py-4 px-6 rounded-xl font-bold transition-all ${
                      scale === 2
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    2倍放大
                  </button>
                  <button
                    onClick={() => setScale(4)}
                    className={`py-4 px-6 rounded-xl font-bold transition-all ${
                      scale === 4
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    4倍放大
                  </button>
                </div>
              </div>

              {/* Upscale Button */}
              <button
                onClick={handleUpscale}
                disabled={!selectedFile || loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Maximize className="w-5 h-5" />
                    开始放大
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

                {/* Upscaled */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    放大后 ({scale}x)
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {loading ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">处理中...</p>
                      </div>
                    ) : upscaledImage ? (
                      <img
                        src={upscaledImage}
                        alt="放大后"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              {upscaledImage && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载放大后的图片
                </button>
              )}

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  使用提示
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• 4倍放大需要更长的处理时间</li>
                  <li>• 建议使用清晰度较高的原图</li>
                  <li>• AI会自动增强放大后的图像质量</li>
                  <li>• 支持常见的图片格式</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
