<template>
  <div class="site-shell">
    <header class="site-header" :class="{ 'site-header--hidden': mobileHeaderHidden }">
      <div class="site-header__bar">
        <NuxtLink class="brand" to="/" aria-label="Hypnose R Startseite" @click="closeMobileMenu">
          <img class="brand__logo" src="/images/logo.png" alt="Hypnose R Logo" />
          <span class="brand__name">Hypnose R</span>
        </NuxtLink>

        <button
          class="mobile-menu-toggle"
          type="button"
          aria-controls="mobile-navigation"
          :aria-expanded="mobileMenuOpen"
          :aria-label="mobileMenuOpen ? 'Menu schliessen' : 'Menu oeffnen'"
          @click="toggleMobileMenu"
        >
          <span class="material-icons" aria-hidden="true">
            {{ mobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>

      <div class="site-header__actions">
        <nav class="site-nav" aria-label="Hauptnavigation">
          <NuxtLink v-for="item in MAIN_NAV_ITEMS" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>
        <DsButton to="/termin-buchen" variant="secondary" icon="event_available">
          Termin buchen
        </DsButton>
      </div>

      <nav
        id="mobile-navigation"
        class="mobile-nav"
        :class="{ 'mobile-nav--open': mobileMenuOpen }"
        :aria-hidden="!mobileMenuOpen"
        aria-label="Mobile Hauptnavigation"
      >
        <NuxtLink v-for="item in MAIN_NAV_ITEMS" :key="item.to" :to="item.to" @click="closeMobileMenu">
          {{ item.label }}
        </NuxtLink>
        <NuxtLink class="mobile-nav__cta" to="/termin-buchen" @click="closeMobileMenu">
          <span class="material-icons" aria-hidden="true">event_available</span>
          <span>Termin buchen</span>
        </NuxtLink>
      </nav>
    </header>

    <NuxtPage />

    <footer class="site-footer">
      <span>Hypnose R &middot; Frankfurt-Heddernheim</span>
      <nav aria-label="Rechtliches">
        <NuxtLink v-for="item in FOOTER_NAV_ITEMS" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </footer>

    <div class="mobile-booking-cta">
      <DsButton to="/termin-buchen" icon="event_available" full-width>Termin buchen</DsButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DsButton from '~/components/design-system/DsButton.vue'
import { FOOTER_NAV_ITEMS, MAIN_NAV_ITEMS } from '~/src/constants/site'

const MOBILE_HEADER_QUERY = '(max-width: 840px)'
const MOBILE_HEADER_SCROLL_DELTA = 6
const MOBILE_HEADER_TOP_OFFSET = 24

const route = useRoute()
const mobileMenuOpen = ref(false)
const isMobileViewport = ref(false)
const shouldHideMobileHeader = ref(false)

const mobileHeaderHidden = computed(() => (
  isMobileViewport.value
  && shouldHideMobileHeader.value
  && !mobileMenuOpen.value
))

let mobileHeaderMediaQuery: MediaQueryList | null = null
let lastScrollY = 0
let scrollFrameId: number | null = null

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function resetMobileHeader() {
  closeMobileMenu()
  shouldHideMobileHeader.value = false

  if (import.meta.client) {
    lastScrollY = window.scrollY
  }
}

function setMobileViewport(matches: boolean) {
  isMobileViewport.value = matches
  lastScrollY = window.scrollY

  if (!matches) {
    shouldHideMobileHeader.value = false
  }
}

function handleMobileHeaderViewportChange(event: MediaQueryListEvent) {
  setMobileViewport(event.matches)
}

function handleMobileHeaderScroll() {
  if (scrollFrameId !== null) {
    return
  }

  scrollFrameId = window.requestAnimationFrame(() => {
    const currentScrollY = Math.max(window.scrollY, 0)
    const scrollDelta = currentScrollY - lastScrollY

    if (!isMobileViewport.value || mobileMenuOpen.value || currentScrollY <= MOBILE_HEADER_TOP_OFFSET) {
      shouldHideMobileHeader.value = false
      lastScrollY = currentScrollY
      scrollFrameId = null
      return
    }

    if (Math.abs(scrollDelta) >= MOBILE_HEADER_SCROLL_DELTA) {
      shouldHideMobileHeader.value = scrollDelta > 0
      lastScrollY = currentScrollY
    }

    scrollFrameId = null
  })
}

watch(() => route.fullPath, resetMobileHeader)

onMounted(() => {
  mobileHeaderMediaQuery = window.matchMedia(MOBILE_HEADER_QUERY)
  setMobileViewport(mobileHeaderMediaQuery.matches)

  mobileHeaderMediaQuery.addEventListener('change', handleMobileHeaderViewportChange)

  window.addEventListener('scroll', handleMobileHeaderScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollFrameId !== null) {
    window.cancelAnimationFrame(scrollFrameId)
  }

  mobileHeaderMediaQuery?.removeEventListener('change', handleMobileHeaderViewportChange)
  window.removeEventListener('scroll', handleMobileHeaderScroll)
})
</script>
