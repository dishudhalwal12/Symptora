import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  preload: false,
});

export const metadata: Metadata = {
  title: "Symptora | Symptom Intelligence Workspace",
  description:
    "Signal-first healthcare screening, records, and explainable risk review inside one bold symptom intelligence workspace.",
  icons: {
    icon: "/symptora-icon.svg",
    shortcut: "/symptora-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${bricolageGrotesque.variable} flex min-h-screen flex-col`}>
        <AuthProvider>
          {children}
          <ThemeToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
