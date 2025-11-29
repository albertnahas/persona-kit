import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-8">
          PersonaKit Chat
        </h1>
        <Chat />
      </div>
    </main>
  );
}
