import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster'
import { ConvexClientProvider } from "@/ConvexClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: 'swap',
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://detailsync.com'),
  title: {
    default: 'DetailSync - AI-Powered Scheduling for Modern Detailers',
    template: '%s | DetailSync'
  },
  description: 'DetailSync offers AI-powered scheduling, customer management, and analytics tools to revolutionize your detailing business.',
  keywords: ['detailing', 'scheduling', 'AI', 'business management', 'customer management', 'analytics'],
  authors: [{ name: 'DetailSync Team' }],
  creator: 'DetailSync',
  publisher: 'DetailSync Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://detailsync.com',
    siteName: 'DetailSync',
    title: 'DetailSync - AI-Powered Scheduling for Modern Detailers',
    description: 'Revolutionize your detailing business with DetailSync\'s AI-powered scheduling, customer management, and analytics tools.',
    images: [
      {
        url: 'https://detailsync.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DetailSync - AI-Powered Scheduling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DetailSync - AI-Powered Scheduling for Modern Detailers',
    description: 'Revolutionize your detailing business with DetailSync\'s AI-powered scheduling, customer management, and analytics tools.',
    images: ['https://detailsync.com/twitter-image.jpg'],
    creator: '@DetailSync',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://detailsync.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <header>
            {/* Add your header component here */}
          </header>
          <main>
            {children}
          </main>
          <footer>
            {/* Add your footer component here */}
          </footer>
          <Toaster />
        </body>
      </html>
    </ConvexClientProvider>
  );
}