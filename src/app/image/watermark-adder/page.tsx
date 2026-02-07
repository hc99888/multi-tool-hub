"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Type, Download, Upload, X, Move } from "lucide-react";

export default function WatermarkAdder() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        renderWatermark(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderWatermark = (imageSrc: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);

      // 如果有水印文字，添加水印
      if (watermarkText.trim()) {
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = hexToRgba(fontColor, opacity / 100);
        ctx.textBaseline = "middle";

        const textWidth = ctx.measureText(watermarkText).width;
        const padding = 20;

        let x, y;
        switch (watermarkPosition) {
          case "top-left":
            x = padding;
            y = padding + fontSize / 2;
            break;
          case "top-right":
            x = canvas.width - textWidth - padding;
            y = padding + fontSize / 2;
            break;
          case "bottom-left":
            x = padding;
            y = canvas.height - padding - fontSize / 2;
            break;
          case "bottom-right":
          default:
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding - fontSize / 2;
            break;
        }

        ctx.fillText(watermarkText, x, y);
      }
    };
    img.src = imageSrc;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `watermarked-${selectedFile?.name || "image.png"}`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setWatermarkText("");
  };

  const positions = [
    { id: "top-left", name: "左上" },
    { id: "top-right", name: "右上" },
    { id: "bottom-left", name: "左下" },
    { id: "bottom-right", name: "右下" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Type className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                水印添加
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                为图片添加文字水印
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Controls */}
            <div className="space-y-6">
              {/* File Upload */}
              {!selectedFile ? (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 hover:border-orange-500 transition-colors">
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
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={handleClear}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  {/* Watermark Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      水印文字
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => {
                        setWatermarkText(e.target.value);
                        if (preview) renderWatermark(preview);
                      }}
                      placeholder="输入水印文字"
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      字体大小: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={fontSize}
                      onChange={(e) => {
                        setFontSize(parseInt(e.target.value));
                        if (preview) renderWatermark(preview);
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Font Color */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      字体颜色
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => {
                          setFontColor(e.target.value);
                          if (preview) renderWatermark(preview);
                        }}
                        className="w-12 h-12 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      透明度: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={opacity}
                      onChange={(e) => {
                        setOpacity(parseInt(e.target.value));
                        if (preview) renderWatermark(preview);
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      水印位置
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {positions.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => {
                            setWatermarkPosition(pos.id);
                            if (preview) renderWatermark(preview);
                          }}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            watermarkPosition === pos.id
                              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {pos.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    下载带水印的图片
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                预览效果
              </label>

              <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center min-h-[400px]">
                {preview ? (
                  <img
                    src={preview}
                    alt="预览"
                    className="max-w-full max-h-[600px] object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      上传图片后在此预览效果
                    </p>
                  </div>
                )}
              </div>

              {/* Canvas (hidden) */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
