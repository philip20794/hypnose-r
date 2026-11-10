import { Quasar } from 'quasar'
import de from 'quasar/lang/de.js'
import { dsQuasarBrand } from '~/src/design-system/tokens'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quasar, {
    lang: de,
    plugins: {},
    config: {
      // Nuxt owns the document language, including the prerendered HTML.
      lang: { noHtmlAttrs: true },
      brand: dsQuasarBrand,
    },
  })
})
