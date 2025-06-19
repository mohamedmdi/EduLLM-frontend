import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "../../components/Header";
import { ThemeProvider } from "../../components/ThemeProvider";
import PageTransition from "../../components/PageTransition";
import { NavigationLoader } from "../../components/NavigationLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduLLM",
  description: "Your AI Learning Companion",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }  // Providing all messages to the client  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <NavigationLoader />
          <NextIntlClientProvider messages={messages}>
            <Header />
            <PageTransition>
              {children}
            </PageTransition>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
