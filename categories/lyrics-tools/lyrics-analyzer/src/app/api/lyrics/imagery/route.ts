import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { lyrics } = await request.json();

    if (!lyrics) {
      return new Response(JSON.stringify({ error: '请提供主题内容' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config);

    const messages = [
      {
        role: 'system' as const,
        content: `你是一位富有诗意的歌词创作顾问，擅长为各种主题生成富有感染力的意象词汇。

请根据用户提供的主题，生成丰富、生动、富有画面感的意象词。请按以下维度进行分类和生成：

1. **自然意象**
   - 天象：云、雨、雪、风、月、星、虹、雾等
   - 地象：山、河、湖、海、原野、城市、街道等
   - 植物：花、草、树、叶、果实等
   - 动物：鸟、鱼、昆虫等

2. **时间意象**
   - 季节：春、夏、秋、冬
   - 时段：清晨、午后、黄昏、深夜
   - 特定时刻：日出、日落、黎明、黄昏

3. **物品意象**
   - 生活用品：镜子、时钟、照片、书信等
   - 装饰品：项链、戒指、花朵等
   - 交通工具：火车、飞机、汽车等

4. **动作意象**
   - 动态：奔跑、飞行、坠落、旋转等
   - 静态：凝视、等待、沉睡、遗忘等
   - 互动：拥抱、分离、相遇、告别等

5. **颜色意象**
   - 暖色：红、橙、黄、金
   - 冷色：蓝、绿、紫、银
   - 中性色：白、灰、黑

6. **感官意象**
   - 视觉：光影、色彩、形状、距离
   - 听觉：声音、节奏、旋律、寂静
   - 触觉：温度、质感、重量、触感
   - 嗅觉：花香、雨味、气息
   - 味觉：甜、苦、酸、辣

7. **抽象意象**
   - 情感：爱、恨、希望、绝望、遗憾
   - 概念：梦想、记忆、时间、命运
   - 比喻：心、灵魂、翅膀、钥匙

对于每个意象词，请提供：
- 意象词本身
- 简短的意象解释或情感联想
- 一个使用示例句子

请用富有诗意的语言呈现这些意象，让创作者能够从中获得创作灵感。输出时注意分类清晰，每个意象词都有独特的感染力。`,
      },
      {
        role: 'user' as const,
        content: `请为以下主题生成意象词：\n\n${lyrics}`,
      },
    ];

    const stream = client.stream(messages, {
      temperature: 0.8,
    }, undefined, customHeaders);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error in lyrics imagery generation:', error);
    return new Response(
      JSON.stringify({ error: '生成失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
