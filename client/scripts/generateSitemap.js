import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

const clientDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const configuredUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')

if (!configuredUrl) {
  console.info('SITE_URL is not set; skipping sitemap generation for this local build.')
} else {
  const siteUrl = new URL(configuredUrl)
  if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password) throw new Error('SITE_URL must be a valid HTTPS origin.')
  const origin = siteUrl.origin
  const lastModified = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><lastmod>${lastModified}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`
  await writeFile(path.join(clientDirectory, 'public', 'sitemap.xml'), sitemap, 'utf8')
  await writeFile(path.join(clientDirectory, 'public', 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`, 'utf8')
  console.info(`Generated sitemap for ${origin}`)
}