export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentConfig {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

export const DEFAULT_AGENT_CONFIG: Required<AgentConfig> = {
  model: "claude-sonnet-4-6",
  maxTokens: 1000,
  systemPrompt: "You are a helpful AI assistant.",
};
