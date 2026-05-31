import { defineStore } from 'pinia'
import type { ContentItem, Anime, Episode } from '~/types'

export const useAnimeStore = defineStore('anime', () => {
  const trending = ref<ContentItem[]>([])
  const latest = ref<ContentItem[]>([])
  const currentAnime = ref<Anime | null>(null)
  const episodes = ref<Episode[]>([])
  const loading = ref(false)

  const fetchTrending = async () => {
    loading.value = true
    try {
      const data = await $fetch<ContentItem[]>('/api/anime/trending')
      trending.value = data
    } catch (err) {
      console.error('Failed to fetch trending anime', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (slug: string) => {
    loading.value = true
    try {
      const data = await $fetch<Anime>(`/api/anime/${slug}`)
      currentAnime.value = data
      episodes.value = data.episodes || []
    } catch (err) {
      console.error('Failed to fetch anime detail', err)
    } finally {
      loading.value = false
    }
  }

  return {
    trending,
    latest,
    currentAnime,
    episodes,
    loading,
    fetchTrending,
    fetchDetail,
  }
})
