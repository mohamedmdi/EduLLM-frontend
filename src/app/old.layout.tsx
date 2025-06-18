import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduLLM",
  description: "Your AI Learning Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
