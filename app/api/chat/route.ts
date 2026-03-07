import { AnthropicAgent, type ChatMessage } from "@/entities/agent";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };

    if (!body.messages || !Array.isArray(body.messages)) {
      return Response.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    const agent = new AnthropicAgent();
    const stream = agent.chat(body.messages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
