import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { lyrics } = await request.json();

    if (!lyrics) {
      return new Response(JSON.stringify({ error: '请提供歌词内容' }), {
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
        content: `你是一位专业的歌词分析师，擅长拆解和解析歌词结构。

请对用户提供的歌词进行详细的结构拆解，包括以下几个方面：

1. **整体结构分析**
   - 歌词的段落划分（主歌、副歌、桥段等）
   - 各部分的行数和字数
   - 重复和变化的模式

2. **韵脚分析**
   - 押韵方案（如 AABB、ABAB 等）
   - 韵脚的字词
   - 韵脚的变化规律

3. **句式特点**
   - 每句的字数
   - 长短句的搭配
   - 节奏感和韵律感

4. **修辞手法**
   - 使用的修辞技巧（比喻、拟人、排比、重复等）
   - 具体的例子和位置

5. **情感脉络**
   - 情感的变化轨迹
   - 情感的高潮点
   - 情感的表达方式

请用清晰、结构化的方式呈现分析结果，使用适当的标题、列表和格式，让用户能够轻松理解歌词的结构特点。`,
      },
      {
        role: 'user' as const,
        content: `请分析以下歌词的结构：\n\n${lyrics}`,
      },
    ];

    const stream = client.stream(messages, {
      temperature: 0.7,
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
    console.error('Error in lyrics structure analysis:', error);
    return new Response(
      JSON.stringify({ error: '分析失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
