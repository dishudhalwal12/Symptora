import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', preload: false });

export const metadata: Metadata = {
  title: 'Medify | Federated Healthcare Screening',
  description: 'Symptom-first healthcare screening, records, and explainable disease likelihood workflows.',
  icons: {
    icon: '/medify-icon.svg',
    shortcut: '/medify-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
          <ThemeToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
