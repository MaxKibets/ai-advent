"use client";

import { Bot } from "lucide-react";
import { ScrollArea } from "@/shared/ui/scroll-area";

interface ChatMessagesProps {
  response: string;
  isLoading: boolean;
}

export function ChatMessages({ response, isLoading }: ChatMessagesProps) {
  if (!response && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Bot className="mx-auto mb-3 size-10 opacity-40" />
          <p className="text-lg font-medium">How can I help you?</p>
          <p className="mt-1 text-sm">
            Send a message to start the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Bot className="size-4" />
          </div>
          <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
            {response ||
              (isLoading && (
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current" />
                </span>
              ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
