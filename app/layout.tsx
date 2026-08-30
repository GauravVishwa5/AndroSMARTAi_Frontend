import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'AndroSMARTAi PVS — Property Due Diligence & Legal Search Platform',
  description: 'Automated legal due diligence, title search reports (LSR/SCR), OCR extraction, and land registry verification for banks.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AndroPVS',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const clientInitScript = `
(function() {
  // Theme initialization
  try {
    var stored = localStorage.getItem('andropvs_theme') || 'light';
    var resolved = stored;
    if (stored === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}

  // PWA Service Worker Registration
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(err) {
        console.warn('SW registration skipped:', err);
      });
    });
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: clientInitScript }} />
      </head>
      <body className="theme-canvas min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
