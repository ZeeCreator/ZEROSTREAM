import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false)
  const searchHistory = ref<string[]>([])

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const addToSearchHistory = (query: string) => {
    if (!searchHistory.value.includes(query)) {
      searchHistory.value.unshift(query)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
    }
  }

  return {
    isMobileMenuOpen,
    searchHistory,
    toggleMobileMenu,
    addToSearchHistory,
  }
})
