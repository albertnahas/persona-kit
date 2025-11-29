"use client";

import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChangeEvent, FormEvent } from "react";

interface InputBoxProps {
  input: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function InputBox({
  input,
  onChange,
  onSubmit,
  isLoading,
}: InputBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 p-4">
      <textarea
        value={input}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className={cn(
          "flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-900 px-4 py-2",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "disabled:opacity-50"
        )}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={cn(
          "rounded-lg bg-blue-600 p-2 text-white",
          "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors"
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
