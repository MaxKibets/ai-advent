import { getConversationRepository } from "@/entities/conversation";

export async function GET() {
  try {
    const repo = getConversationRepository();
    const conversation = repo.getOrCreateDefault();
    const messages = repo.getMessagesAsChat(conversation.id);

    return Response.json({ conversationId: conversation.id, messages });
  } catch {
    return Response.json({ error: "Failed to load history" }, { status: 500 });
  }
}
