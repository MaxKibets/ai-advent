import { AnthropicAgent, type ChatMessage } from "@/entities/agent";
import { getConversationRepository } from "@/entities/conversation";

let agent: AnthropicAgent | null = null;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      messages?: ChatMessage[];
      conversationId?: number;
    };

    if (!body.messages || !Array.isArray(body.messages)) {
      return Response.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    const repo = getConversationRepository();
    const conversation = body.conversationId
      ? { id: body.conversationId }
      : repo.getOrCreateDefault();

    // Persist user message before streaming
    const userMessage = body.messages[body.messages.length - 1];
    if (userMessage?.role === "user") {
      repo.saveMessage(conversation.id, "user", userMessage.content);
    }

    agent ??= new AnthropicAgent();
    const agentStream = agent.chat(body.messages);

    // Tee: accumulate assistant text while streaming to client
    let accumulated = "";
    const decoder = new TextDecoder();
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        accumulated += decoder.decode(chunk, { stream: true });
        controller.enqueue(chunk);
      },
      flush() {
        accumulated += decoder.decode(); // drain remaining bytes
        if (accumulated) {
          repo.saveMessage(conversation.id, "assistant", accumulated);
        }
      },
    });

    agentStream.pipeTo(writable).catch(() => {
      // Stream error — partial assistant response is not persisted
    });

    return new Response(readable, {
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
