import { getDb } from "@/shared/lib/db";
import type { Conversation, StoredMessage } from "../model/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

let repo: ConversationRepository | null = null;

export function getConversationRepository(): ConversationRepository {
  repo ??= new ConversationRepository();
  return repo;
}

export class ConversationRepository {
  private db = getDb();

  getOrCreateDefault(): Conversation {
    const existing = this.db
      .prepare("SELECT * FROM conversations ORDER BY id ASC LIMIT 1")
      .get() as Conversation | undefined;

    if (existing) return existing;

    const result = this.db
      .prepare("INSERT INTO conversations (title) VALUES (NULL)")
      .run();

    return this.db
      .prepare("SELECT * FROM conversations WHERE id = ?")
      .get(result.lastInsertRowid) as Conversation;
  }

  getMessages(conversationId: number): StoredMessage[] {
    return this.db
      .prepare(
        "SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC",
      )
      .all(conversationId) as StoredMessage[];
  }

  getMessagesAsChat(conversationId: number): ChatMessage[] {
    const rows = this.db
      .prepare(
        "SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id ASC",
      )
      .all(conversationId) as ChatMessage[];

    return rows;
  }

  saveMessage(
    conversationId: number,
    role: "user" | "assistant",
    content: string,
  ): StoredMessage {
    const tx = this.db.transaction(() => {
      const result = this.db
        .prepare(
          "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",
        )
        .run(conversationId, role, content);

      this.db
        .prepare(
          "UPDATE conversations SET updated_at = unixepoch() WHERE id = ?",
        )
        .run(conversationId);

      return this.db
        .prepare("SELECT * FROM messages WHERE id = ?")
        .get(result.lastInsertRowid) as StoredMessage;
    });

    return tx();
  }
}
