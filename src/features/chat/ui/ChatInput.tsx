"use client";

import { ArrowUp } from "lucide-react";
import { type KeyboardEvent, memo, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/shared/ui/input-group";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = memo(function ChatInput({
  onSend,
  isLoading,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputGroup className="w-full">
      <InputGroupTextarea
        ref={textareaRef}
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={1}
        className="max-h-32 min-h-10"
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          size="icon-sm"
          variant="default"
          aria-label="Send message"
          className="ml-auto"
        >
          <ArrowUp className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
});
