import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EveryPosting | Turn Audio & Video Transcripts into a Week of Social Content',
  description:
    'AI-powered content repurposing tool for Podcasters, YouTube Creators, and Coaches. Convert transcripts into Twitter threads, show notes, blog posts, and LinkedIn content instantly.',
  keywords: [
    'AI content repurposing',
    'podcast show notes generator',
    'youtube video to twitter thread',
    'coaching webinar to linkedin post',
    'content marketing AI',
    'EveryPosting',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'EveryPosting | AI Content Repurposing SaaS',
    description:
      'Turn 1 recording into 7 days of viral Twitter threads, LinkedIn posts, blog articles, and show notes.',
    url: 'https://everyposting.com',
    siteName: 'EveryPosting',
    type: 'website',
  },
};

import { UserProvider } from '@/components/providers/user-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden max-w-full`}>
      <body className="min-h-full flex flex-col bg-[#F5F5F7] text-[#52525B] selection:bg-purple-500/20 overflow-x-hidden max-w-full relative">
        <UserProvider>
          {/* Soft Light Mode Glowing Gradient Blobs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden max-w-full">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-float-1" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[140px] animate-float-2" />
            <div className="absolute bottom-[-10%] left-[30%] w-[550px] h-[550px] rounded-full bg-pink-500/10 blur-[130px] animate-float-1" />
          </div>

          <Navbar />

          <main className="flex-1 z-10 relative overflow-x-hidden max-w-full">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
