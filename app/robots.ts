import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://every-posting.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/stripe/*', '/api/feedback', '/api/generate'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
