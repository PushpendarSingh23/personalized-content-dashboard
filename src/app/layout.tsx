import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'PulseFeed • Personalized Omni-Content Dashboard',
  description:
    'A high-performance personalized dashboard for tracking real-time news, movie & music recommendations, and viral discussions across the web.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
