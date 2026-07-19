import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Tracker",
  description: "애니 · 게임 · J-POP 기록과 평점 공유",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
