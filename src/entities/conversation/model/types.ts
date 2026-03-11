export interface Conversation {
  id: number;
  title: string | null;
  created_at: number;
  updated_at: number;
}

export interface StoredMessage {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: number;
}
