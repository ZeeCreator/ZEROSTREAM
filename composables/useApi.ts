import type { ContentItem, Anime, Movie, SearchResult, AnimeV2Response } from '~/types'

const API_BASE = 'https://lk-21-apis.vercel.app'

export const useApi = () => {
  const fetchWithCache = async <T>(endpoint: string): Promise<T> => {
    try {
      return await $fetch<T>(endpoint, { baseURL: API_BASE })
    } catch (err) {
      console.error(`API Error: ${endpoint}`, err)
      throw err
    }
  }

  const getHomeData = async () => {
    const [trendingAnime, trendingMovie, latest] = await Promise.all([
      fetchWithCache<ContentItem[]>('/trending/anime'),
      fetchWithCache<ContentItem[]>('/trending/movie'),
      fetchWithCache<ContentItem[]>('/latest'),
    ])
    return { trendingAnime, trendingMovie, latest }
  }

  const searchContent = async (query: string): Promise<SearchResult> => {
    return fetchWithCache<SearchResult>(`/search?q=${encodeURIComponent(query)}`)
  }

  const getAnimeDetail = async (slug: string): Promise<Anime> => {
    return fetchWithCache<Anime>(`/anime/${slug}`)
  }

  const getMovieDetail = async (slug: string): Promise<Movie> => {
    return fetchWithCache<Movie>(`/movie/${slug}`)
  }

  const getGenreContent = async (genre: string): Promise<ContentItem[]> => {
    return fetchWithCache<ContentItem[]>(`/genre/${genre}`)
  }

  const getAnimeV2 = async (): Promise<AnimeV2Response> => {
    return $fetch<AnimeV2Response>('/api/anime/v2-home')
  }

  return {
    getHomeData,
    searchContent,
    getAnimeDetail,
    getMovieDetail,
    getGenreContent,
    getAnimeV2,
  }
}
