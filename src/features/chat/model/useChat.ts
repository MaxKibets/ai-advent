"use client";

import { useRef, useState } from "react";

export function useChat() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    setResponse("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: content.trim() }],
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error ?? "Request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setResponse(accumulated);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return;

      setResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  return { response, isLoading, sendMessage };
}
