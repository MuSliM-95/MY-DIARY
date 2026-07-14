import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-diary.ru',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ]
}