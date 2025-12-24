import { auth } from "@/auth";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { redirect } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrianGPT",
  description: "Brian's customized, self-hosted AI assistant",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    // No session → redirect to sign-in
    redirect("/api/auth/signin");
  }

  if (session.user?.email !== process.env.ALLOWED_EMAIL) {
    // Unauthorized → show 403 page
    return <h1>Forbidden</h1>;
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
