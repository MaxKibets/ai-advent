"use client";

import { ChatInput, ChatMessages, useChat } from "@/features/chat";

export function HomeView() {
  const { response, isLoading, sendMessage } = useChat();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex shrink-0 items-center border-b px-6 py-3">
        <h1 className="text-lg font-semibold tracking-tight">AI Agent</h1>
      </header>
      <ChatMessages response={response} isLoading={isLoading} />
      <div className="shrink-0 border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
