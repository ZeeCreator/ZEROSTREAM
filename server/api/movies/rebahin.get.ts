import type { ContentItem, RebahinResponse } from '~/types'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<RebahinResponse>(`${config.public.apiBase}/api/v1/movies/rebahin`)

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
  } catch (err) {
    console.error('Gagal mengambil data rebahin:', err)
    throw createError({
      statusCode: 502,
      message: 'Gagal mengambil data movie dari Rebahin',
    })
  }
})

function extractYear(title: string): number | undefined {
  const match = title.match(/\((\d{4})\)/)
  return match ? Number.parseInt(match[1]) : undefined
}
