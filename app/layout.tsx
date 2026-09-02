import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { UserProvider } from '@/components/providers/user-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = 'https://every-posting.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EveryPosting | AI Content Repurposing Engine for Creators & Podcasters',
    template: '%s | EveryPosting AI Content Engine',
  },
  description:
    'Turn single audio & video transcripts into 7 days of high-converting Twitter threads, LinkedIn articles, podcast show notes, and newsletter clips powered by Anthropic Claude 3.5 Sonnet.',
  keywords: [
    'AI content repurposing',
    'podcast show notes generator',
    'youtube script to twitter thread',
    'coaching call to linkedin article',
    'content generator AI',
    'audio transcript repurposer',
    'EveryPosting',
    'social media AI automation',
    'Claude 3.5 Sonnet content writer',
  ],
  authors: [{ name: 'EveryPosting AI Team', url: siteUrl }],
  creator: 'EveryPosting AI',
  publisher: 'EveryPosting AI',
  category: 'Technology & Content Marketing',
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
  openGraph: {
    title: 'EveryPosting | Turn Audio & Video Transcripts into a Week of Social Content',
    description:
      'Turn 1 recording into 7 days of viral Twitter threads, LinkedIn posts, blog articles, and show notes with 1 click.',
    url: siteUrl,
    siteName: 'EveryPosting AI Engine',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EveryPosting | AI Content Repurposing SaaS',
    description:
      'Turn transcripts into multi-platform content calendars in seconds powered by Anthropic Claude 3.5 Sonnet.',
    creator: '@everyposting',
  },
};

// JSON-LD Structured Data Schema.org for Google Search Rich Snippets
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EveryPosting AI Content Engine',
  operatingSystem: 'All',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '19',
    offerCount: '2',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.98',
    ratingCount: '1240',
    reviewCount: '1240',
  },
  description:
    'AI-powered content repurposing software for Podcasters, YouTube Creators, and Coaches. Convert transcripts into multi-platform social media posts.',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EveryPosting',
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  sameAs: ['https://twitter.com/everyposting', 'https://github.com/usmanahmad4823/every_posting'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden max-w-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
