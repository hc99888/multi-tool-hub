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
        content: `你是一位资深的音乐制作人兼歌词创作专家，深谙爆款歌曲的创作规律。

请从专业角度分析用户提供的爆款歌词，重点关注以下方面：

1. **主题定位**
   - 歌词的核心主题是什么
   - 这个主题的普遍性和共鸣点
   - 为什么这个主题能引发广泛传播

2. **情感策略**
   - 情感的触发点在哪里
   - 情感的高潮如何设计
   - 情感的递进和转折技巧
   - 如何让听众产生强烈代入感

3. **语言特点**
   - 用词的通俗性和记忆点
   - 金句和洗脑句的设计
   - 口语化表达与诗意表达的平衡
   - 词汇选择的独特性

4. **结构技巧**
   - 副歌的抓耳程度和记忆点
   - 主歌和副歌的衔接技巧
   - 段落重复和变化的艺术
   - 开头和结尾的设计

5. **传播要素**
   - 容易被引用和分享的句子
   - 适合短视频和社交平台的片段
   - 容易被改编或二次创作的元素
   - 话题性和讨论度

6. **创作启示**
   - 从这首爆款歌词中学到的创作技巧
   - 可以借鉴的创作思路
   - 如何在自己的创作中应用这些技巧

请用专业且易懂的语言进行分析，提供具体的歌词示例，并给出可操作的创作建议。`,
      },
      {
        role: 'user' as const,
        content: `请分析以下爆款歌词的成功要素：\n\n${lyrics}`,
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
    console.error('Error in lyrics popular analysis:', error);
    return new Response(
      JSON.stringify({ error: '分析失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
