"use client";

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
    </div>
  );
}
