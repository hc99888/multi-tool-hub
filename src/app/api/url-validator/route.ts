import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "请提供URL" }, { status: 400 });
    }

    // 验证URL格式
    try {
      new URL(url);
    } catch {
      return NextResponse.json({
        valid: false,
        error: "URL格式不正确"
      });
    }

    // 尝试发起HEAD请求验证URL是否可访问
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
      });
      
      clearTimeout(timeoutId);

      return NextResponse.json({
        valid: response.ok,
        statusCode: response.status,
        statusText: response.statusText,
        url: response.url
      });
    } catch (error) {
      clearTimeout(timeoutId);
      return NextResponse.json({
        valid: false,
        error: "无法访问该URL"
      });
    }
  } catch (error) {
    console.error("URL验证错误:", error);
    return NextResponse.json(
      { error: "验证失败" },
      { status: 500 }
    );
  }
}
