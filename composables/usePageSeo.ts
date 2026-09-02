import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from '~/src/constants/site'

type PageSeoInput = {
  title: string
  description: string
  path: string
  type?: 'article' | 'website'
  image?: string
  schema?: Record<string, unknown> | Record<string, unknown>[]
}

export function usePageSeo(input: PageSeoInput) {
  const canonical = input.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${input.path}`
  const image = `${SITE_URL}${input.image || SOCIAL_IMAGE}`
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`

  useSeoMeta({
    title,
    description: input.description,
    ogTitle: title,
    ogDescription: input.description,
    ogType: input.type || 'website',
    ogUrl: canonical,
    ogImage: image,
    twitterCard: 'summary_large_image',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: input.schema
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(input.schema),
          },
        ]
      : [],
  })
}
