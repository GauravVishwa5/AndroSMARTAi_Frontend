import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'AndroSMARTAi PVS — Property Due Diligence & Legal Search Platform',
  description: 'Automated legal due diligence, title search reports (LSR/SCR), OCR extraction, and land registry verification for banks.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('andropvs_theme') || 'dark';
    var resolved = stored;
    if (stored === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="theme-canvas min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
