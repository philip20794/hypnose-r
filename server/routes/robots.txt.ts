import { defineEventHandler, setHeader } from 'h3'
import { SITE_URL } from '~/src/constants/site'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /bestaetigen/',
    'Disallow: /api/',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
})
