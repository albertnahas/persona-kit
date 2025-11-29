"use client";

import { useChatAgent } from "personakit/react";
import { MessageList } from "./MessageList";
import { InputBox } from "./InputBox";

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChatAgent({
    endpoint: "/api/chat",
  });

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          Error: {error.message}
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-800">
        <InputBox
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
