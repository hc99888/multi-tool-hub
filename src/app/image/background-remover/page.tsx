"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, Download, Loader2, Eraser } from "lucide-react";

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setProcessedImage(null);

    // 模拟处理
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 在实际应用中，这里应该调用背景移除API
    // 目前使用原图作为示例
    setProcessedImage(preview);
    setLoading(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `no-background-${selectedFile?.name || "image.png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
              <Eraser className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                背景移除
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                使用AI智能移除图片背景
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 hover:border-rose-500 transition-colors">
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

              {/* Info */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  使用说明
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li>• 上传包含主体的图片</li>
                  <li>• AI会自动识别并移除背景</li>
                  <li>• 支持人物、产品、动物等主体</li>
                  <li>• 输出为PNG格式，支持透明背景</li>
                </ul>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemoveBackground}
                disabled={!selectedFile || loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Eraser className="w-5 h-5" />
                    移除背景
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
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDB2MjBtMC0yMEgyMG0tMjAgMGgwbTAgMHYwbTAgMGgyMG0wIDBIMCIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')]">
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

                {/* Processed */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    移除背景后
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDB2MjBtMC0yMEgyMG0tMjAgMGgwbTAgMHYwbTAgMGgyMG0wIDBIMCIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')]">
                    {loading ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-rose-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">处理中...</p>
                      </div>
                    ) : processedImage ? (
                      <img
                        src={processedImage}
                        alt="处理后"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              {processedImage && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载无背景图片
                </button>
              )}

              {/* Tips */}
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2">
                  最佳实践
                </h4>
                <ul className="text-sm text-rose-700 dark:text-rose-400 space-y-1">
                  <li>• 选择主体清晰的图片效果更好</li>
                  <li>• 避免背景与主体颜色过于相似</li>
                  <li>• 较高分辨率的图片处理效果更佳</li>
                  <li>• 复杂背景可能需要多次调整</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
