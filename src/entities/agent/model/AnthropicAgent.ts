import Anthropic from "@anthropic-ai/sdk";
import {
  type AgentConfig,
  type ChatMessage,
  DEFAULT_AGENT_CONFIG,
} from "./types";

export class AnthropicAgent {
  private client: Anthropic;
  private config: Required<AgentConfig>;

  constructor(config: AgentConfig = {}) {
    this.client = new Anthropic();
    this.config = { ...DEFAULT_AGENT_CONFIG, ...config };
  }

  chat(messages: ChatMessage[]): ReadableStream<Uint8Array> {
    const { model, maxTokens, systemPrompt } = this.config;

    const stream = this.client.messages.stream({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}
