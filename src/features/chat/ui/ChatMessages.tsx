"use client";

import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/shared/ui/scroll-area";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const emptyState = (
  <div className="flex flex-1 items-center justify-center text-muted-foreground">
    <div className="text-center">
      <Bot className="mx-auto mb-3 size-10 opacity-40" />
      <p className="text-lg font-medium">How can I help you?</p>
      <p className="mt-1 text-sm">Send a message to start the conversation.</p>
    </div>
  </div>
);

const loadingIndicator = (
  <span className="inline-flex items-center gap-1">
    <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="size-1.5 animate-bounce rounded-full bg-current" />
  </span>
);

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end gap-3">
      <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
        {content}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User className="size-4" />
      </div>
    </div>
  );
}

function AssistantBubble({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="size-4" />
      </div>
      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
        {content || (isStreaming ? loadingIndicator : null)}
      </div>
    </div>
  );
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages only
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return emptyState;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        {messages.map((msg, i) => {
          const key = `${msg.role}-${i}`;
          return msg.role === "user" ? (
            <UserBubble key={key} content={msg.content} />
          ) : (
            <AssistantBubble
              key={key}
              content={msg.content}
              isStreaming={isLoading && i === messages.length - 1}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
