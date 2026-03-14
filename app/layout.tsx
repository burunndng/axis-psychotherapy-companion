import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'AXIS - Psychotherapy Companion',
  description: 'A sharp, perceptive thinking partner chatbot.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans bg-void-0 text-slate-200 antialiased min-h-screen selection:bg-emerald-900/50" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
