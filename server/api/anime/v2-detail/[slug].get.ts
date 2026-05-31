export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  try {
    const res: any = await $fetch(`${config.public.animeApiBase}/api/anime/${slug}`)
    const d = res?.results || res
    const info = d.info || {}
    const episodes = (d.episode_list || []).map((ep: any) => ({
      number: ep.title?.replace(/^Episode\s+/, '') || '',
      title: ep.title || '',
      slug: ep.slug || '',
      date: ep.release_date || '',
    }))
    return {
      data: {
        title: d.title || '',
        altTitles: [info.japanese || ''].filter(Boolean),
        slug: d.slug || slug,
        poster: d.thumbnail || '',
        rating: info.score ? parseFloat(info.score) : 0,
        status: info.status || '',
        studio: info.studio || '',
        year: info.release ? parseInt(info.release) : null,
        duration: info.duration || '',
        season: info.season || '',
        type: info.type || '',
        episodeCount: info.total_episode ? parseInt(info.total_episode) : null,
        fansub: '',
        director: info.director ? [info.director] : [],
        casts: info.casts || [],
        genres: (info.genre || []).map((g: string) => ({ name: g, slug: g.toLowerCase().replace(/\s+/g, '-') })),
        synopsis: d.synopsis || '',
        description: d.synopsis || '',
        episodes,
        characters: [],
        recommendations: [],
      }
    }
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil detail anime' })
  }
})
