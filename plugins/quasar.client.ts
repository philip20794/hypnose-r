import { Quasar } from 'quasar'
import { dsQuasarBrand } from '~/src/design-system/tokens'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quasar, {
    plugins: {},
    config: {
      brand: dsQuasarBrand,
    },
  })
})
