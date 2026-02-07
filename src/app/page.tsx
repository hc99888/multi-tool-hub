import Link from "next/link";
import { Music, FileText, Image, Link2, ArrowRight } from "lucide-react";

export default function HomePage() {
  const categories = [
    {
      title: "音乐创作",
      description: "音乐制作相关工具",
      icon: <Music className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      tools: [
        {
          name: "BPM计算器",
          path: "/music/bpm-calculator",
          description: "计算音乐节拍速度"
        },
        {
          name: "和弦分析器",
          path: "/music/chord-analyzer",
          description: "识别和分析和弦"
        },
        {
          name: "旋律生成器",
          path: "/music/melody-generator",
          description: "AI生成旋律片段"
        }
      ]
    },
    {
      title: "歌词处理",
      description: "歌词编辑和分析工具",
      icon: <FileText className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      tools: [
        {
          name: "歌词智能分析",
          path: "/lyrics/lyrics-analyzer",
          description: "AI分析歌词内容和情感"
        }
      ]
    },
    {
      title: "图像工具",
      description: "图片处理和增强工具",
      icon: <Image className="w-8 h-8" />,
      color: "from-green-500 to-teal-500",
      tools: [
        {
          name: "图片放大",
          path: "/image/image-upscaler",
          description: "AI智能放大图片"
        },
        {
          name: "背景移除",
          path: "/image/background-remover",
          description: "智能移除图片背景"
        },
        {
          name: "专辑封面生成",
          path: "/image/album-cover-generator",
          description: "生成音乐专辑封面"
        },
        {
          name: "图片增强",
          path: "/image/image-enhancer",
          description: "提升图片质量"
        },
        {
          name: "水印添加",
          path: "/image/watermark-adder",
          description: "为图片添加水印"
        }
      ]
    },
    {
      title: "链接分析",
      description: "URL和链接处理工具",
      icon: <Link2 className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      tools: [
        {
          name: "URL有效性检查",
          path: "/link/url-validator",
          description: "验证URL是否可访问"
        },
        {
          name: "短链还原",
          path: "/link/link-expander",
          description: "展开短链接获取原始URL"
        },
        {
          name: "链接元数据提取",
          path: "/link/meta-analyzer",
          description: "提取网页的元数据"
        },
        {
          name: "批量链接验证",
          path: "/link/batch-validator",
          description: "同时验证多个链接"
        },
        {
          name: "重定向追踪",
          path: "/link/redirect-tracker",
          description: "追踪URL重定向路径"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            工具中心
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            多功能在线工具集合 - 音乐创作 · 图像处理 · 链接分析
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {categories.map((category, index) => (
            <section key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool, toolIndex) => (
                  <Link
                    key={toolIndex}
                    href={tool.path}
                    className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-600 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                        立即使用
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-600 dark:text-slate-400 pb-8">
          <p>© 2024 工具中心 - 让工作更高效</p>
        </footer>
      </main>
    </div>
  );
}
