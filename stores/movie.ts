import { defineStore } from 'pinia'
import type { ContentItem, Movie } from '~/types'

export const useMovieStore = defineStore('movie', () => {
  const trending = ref<ContentItem[]>([])
  const latest = ref<ContentItem[]>([])
  const currentMovie = ref<Movie | null>(null)
  const loading = ref(false)

  const fetchTrending = async () => {
    loading.value = true
    try {
      const data = await $fetch<ContentItem[]>('/api/movies/trending')
      trending.value = data
    } catch (err) {
      console.error('Failed to fetch trending movies', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (slug: string) => {
    loading.value = true
    try {
      const data = await $fetch<Movie>(`/api/movie/${slug}`)
      currentMovie.value = data
    } catch (err) {
      console.error('Failed to fetch movie detail', err)
    } finally {
      loading.value = false
    }
  }

  return {
    trending,
    latest,
    currentMovie,
    loading,
    fetchTrending,
    fetchDetail,
  }
})
