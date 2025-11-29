"use client";

import { useChat, type UseChatOptions } from "ai/react";
import type { ChangeEvent, FormEvent } from "react";
import type { Message } from "../types.js";

/**
 * Options for useChatAgent hook
 */
export interface UseChatAgentOptions {
  /** API endpoint (default: /api/chat) */
  endpoint?: string;
  /** Session ID for conversation persistence */
  sessionId?: string;
  /** Initial messages */
  initialMessages?: Message[];
  /** Callback when response completes */
  onFinish?: (message: Message) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useChatAgent hook
 */
export interface UseChatAgentReturn {
  /** Current messages in the conversation */
  messages: Message[];
  /** Current input value */
  input: string;
  /** Handle input change (for controlled input) */
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  /** Handle form submit */
  handleSubmit: (
    e?: FormEvent<HTMLFormElement>,
    options?: { data?: Record<string, string> }
  ) => void;
  /** Send a message programmatically */
  sendMessage: (content: string) => Promise<void>;
  /** Clear all messages */
  clearMessages: () => void;
  /** Whether a response is being generated */
  isLoading: boolean;
  /** Current error if any */
  error: Error | undefined;
  /** Reload the last message */
  reload: () => void;
  /** Stop the current generation */
  stop: () => void;
}

/**
 * React hook for chat agent integration
 * Wraps Vercel AI SDK's useChat with PersonaKit defaults
 */
export function useChatAgent(
  options: UseChatAgentOptions = {}
): UseChatAgentReturn {
  const {
    endpoint = "/api/chat",
    sessionId,
    initialMessages,
    onFinish,
    onError,
  } = options;

  const chatOptions: UseChatOptions = {
    api: endpoint,
    initialMessages: initialMessages?.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    })),
    headers: sessionId ? { "x-session-id": sessionId } : undefined,
    onFinish: onFinish
      ? (message) => {
          onFinish({
            id: message.id,
            role: message.role as Message["role"],
            content: message.content,
            createdAt: new Date(),
          });
        }
      : undefined,
    onError,
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setMessages,
    append,
  } = useChat(chatOptions);

  // Convert messages to PersonaKit format
  const typedMessages: Message[] = messages.map((m) => ({
    id: m.id,
    role: m.role as Message["role"],
    content: m.content,
    createdAt: m.createdAt,
  }));

  /**
   * Send a message programmatically
   */
  const sendMessage = async (content: string) => {
    await append({
      role: "user",
      content,
    });
  };

  /**
   * Clear conversation
   */
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    /** Current messages in the conversation */
    messages: typedMessages,
    /** Current input value */
    input,
    /** Handle input change (for controlled input) */
    handleInputChange,
    /** Handle form submit */
    handleSubmit,
    /** Send a message programmatically */
    sendMessage,
    /** Clear all messages */
    clearMessages,
    /** Whether a response is being generated */
    isLoading,
    /** Current error if any */
    error,
    /** Reload the last message */
    reload,
    /** Stop the current generation */
    stop,
  };
}
