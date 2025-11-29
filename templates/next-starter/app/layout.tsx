import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaKit Chat",
  description: "AI chat powered by PersonaKit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
