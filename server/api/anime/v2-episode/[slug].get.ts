export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  try {
    const res: any = await $fetch(`${config.public.animeApiBase}/api/stream/${slug}`)
    const d = res?.results || res
    const anime = d.anime || {}
    const ep = d.episode || {}
    const animeInfo = anime.info || {}

    const streamServers = (ep.stream || []).map((s: any, i: number) => ({
      name: s.quality || `Server ${i + 1}`,
      url: s.url || '',
      index: i,
    }))

    const downloadGroups = (ep.download || []).map((dg: any) => ({
      quality: dg.quality || '',
      links: (dg.links || dg.data || []).map((l: any) => ({
        provider: l.provider || l.quality || '',
        url: l.url || l.link || '',
      })),
    }))

    return {
      data: {
        title: ep.title || d.title || '',
        slug: d.slug || slug,
        seriesTitle: anime.title || d.title || '',
        seriesSlug: anime.slug || d.slug || '',
        episodeNumber: '',
        poster: anime.thumbnail || d.thumbnail || '',
        rating: animeInfo.score ? parseFloat(animeInfo.score) : 0,
        type: animeInfo.type || '',
        releaseDate: ep.release_date || '',
        streamServers,
        currentEmbed: streamServers[0]?.url || '',
        downloads: downloadGroups,
        prevEpisode: null,
        nextEpisode: null,
      }
    }
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data episode' })
  }
})
