import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://every-posting.vercel.app';
  const now = new Date();

  const routes = [
    '',
    '/features',
    '/pricing',
    '/integrations',
    '/changelog',
    '/docs',
    '/tutorials',
    '/blog',
    '/support',
    '/about',
    '/careers',
    '/contact',
    '/partners',
    '/privacy',
    '/terms',
    '/dashboard',
    '/sign-in',
    '/sign-up',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/dashboard' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/features' ? 0.9 : 0.7,
  }));
}
