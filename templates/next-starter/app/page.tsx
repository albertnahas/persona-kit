import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center mb-8">
          PersonaKit Chat
        </h1>
        <Chat />
      </div>
      <footer className="text-center text-sm text-gray-500 mt-8">
        Built with{" "}
        <a
          href="https://github.com/albertnahas/persona-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          PersonaKit
        </a>
      </footer>
    </main>
  );
}
