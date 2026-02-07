'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Music, Lightbulb } from 'lucide-react';

export default function LyricsAnalyzer() {
  const [activeTab, setActiveTab] = useState('structure');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (type: 'structure' | 'popular' | 'imagery') => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setOutput('');
    
    try {
      const response = await fetch(`/api/lyrics/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: input }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value);
          setOutput((prev) => prev + text);
        }
      }
    } catch (error) {
      setOutput(`发生错误：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              歌词智能分析
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            拆解歌词结构 · 分析爆款技巧 · 生成创意意象
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] lg:mx-auto">
            <TabsTrigger value="structure" className="gap-2">
              <Sparkles className="w-4 h-4" />
              歌词结构拆解
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Music className="w-4 h-4" />
              爆款歌词分析
            </TabsTrigger>
            <TabsTrigger value="imagery" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              意象词生成
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>歌词结构拆解</CardTitle>
                <CardDescription>
                  输入歌词，AI 将帮你拆解其结构、韵脚、段落和句式特点
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请输入需要拆解的歌词..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={() => handleAnalyze('structure')} 
                  disabled={isLoading || !input.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      开始拆解
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>分析结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {output}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>爆款歌词分析</CardTitle>
                <CardDescription>
                  分析爆款歌曲的歌词写作技巧、情感表达和传播要素
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请输入需要分析的爆款歌词..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={() => handleAnalyze('popular')} 
                  disabled={isLoading || !input.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      开始分析
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>分析结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {output}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="imagery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>意象词生成</CardTitle>
                <CardDescription>
                  根据主题生成相关的意象词汇，为歌词创作提供灵感
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请输入歌词主题（如：青春、爱情、梦想、离别等）..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={() => handleAnalyze('imagery')} 
                  disabled={isLoading || !input.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      生成意象词
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>生成结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {output}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
