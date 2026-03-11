"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<number | null>(null);
  const isReadyRef = useRef(false);

  // useLatest pattern: keep ref in sync so sendMessage can read current
  // isLoading without it appearing in useCallback deps (stable reference)
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Load history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) return;

        const data = (await res.json()) as {
          conversationId: number;
          messages: ChatMessage[];
        };

        conversationIdRef.current = data.conversationId;
        setMessages(data.messages);
      } catch {
        // History unavailable — start fresh
      } finally {
        isReadyRef.current = true;
      }
    }

    loadHistory();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoadingRef.current || !isReadyRef.current) return;

    const trimmed = content.trim();
    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    // Optimistic: append user message immediately
    const prevMessages = messagesRef.current;
    const allMessages = [...prevMessages, userMessage];
    setMessages(allMessages);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          conversationId: conversationIdRef.current,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error ?? "Request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      // Push empty assistant placeholder
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        startTransition(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      // Rollback optimistic update on error
      setMessages(prevMessages);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []); // stable — reads isLoading and messages via refs

  return { messages, isLoading, sendMessage };
}
