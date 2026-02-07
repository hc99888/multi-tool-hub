import { NextRequest, NextResponse } from "next/server";
import { ImageGenerationClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = "2K", style = "standard" } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "请提供提示词" },
        { status: 400 }
      );
    }

    // 提取请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 创建配置和客户端
    const config = new Config();
    const client = new ImageGenerationClient(config, customHeaders);

    // 生成图像
    const response = await client.generate({
      prompt,
      size,
      watermark: false,
      optimizePromptMode: style,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success) {
      return NextResponse.json({
        success: true,
        imageUrls: helper.imageUrls,
        images: helper.imageUrls
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: helper.errorMessages.join(", ") 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("图像生成错误:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "图像生成失败，请稍后重试" 
      },
      { status: 500 }
    );
  }
}
