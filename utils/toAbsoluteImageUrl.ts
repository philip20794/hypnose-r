import { SITE_URL } from '~/src/constants/site'

/** Resolve imported assets, public paths and absolute URLs against the site origin. */
export function toAbsoluteImageUrl(image: string): string {
  return new URL(image, `${SITE_URL}/`).href
}
