import { NextRequest, NextResponse } from "next/server";
import { SearchClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: "请提供搜索关键词" },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new SearchClient(config, customHeaders);

    // 使用advancedSearch限定在GitHub站点
    const response = await client.advancedSearch(query, {
      searchType: "web",
      count: 15,
      sites: "github.com",
      needUrl: true,
      needContent: true,
      needSummary: true,
    });

    return NextResponse.json({
      summary: response.summary,
      results: response.web_items?.map((item) => ({
        title: item.title,
        url: item.url,
        siteName: item.site_name,
        snippet: item.snippet,
        publishTime: item.publish_time,
      })) || [],
    });
  } catch (error) {
    console.error("搜索错误:", error);
    return NextResponse.json(
      { error: "搜索失败，请稍后重试" },
      { status: 500 }
    );
  }
}
