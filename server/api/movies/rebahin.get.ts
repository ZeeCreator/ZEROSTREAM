import type { ContentItem, RebahinResponse } from '~/types'

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()
  const response = await $fetch<RebahinResponse>(`${config.public.apiBase}/api/v1/movies/rebahin`).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data movie dari Rebahin' })
  })

  const items: ContentItem[] = response.data.map((movie) => ({
    id: movie.externalId,
    title: movie.title,
    slug: movie.slug,
    poster: movie.posterUrl,
    rating: movie.rating,
    quality: movie.quality,
    type: 'movie' as const,
    genre: [],
    year: extractYear(movie.title),
  }))

  return items
}, { maxAge: 600 })

function extractYear(title: string): number | undefined {
  const match = title.match(/\((\d{4})\)/)
  return match ? Number.parseInt(match[1]) : undefined
}
