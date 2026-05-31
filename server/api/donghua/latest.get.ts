export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  try {
    const url = `https://lk-21-apis.vercel.app/api/anichin/latest?page=${page}`
    const res: any = await $fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      retry: 0,
    })
    return res
  } catch {
    try {
      const homeUrl = 'https://lk-21-apis.vercel.app/api/anichin/home'
      const homeRes: any = await $fetch(homeUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        retry: 0,
      })
      const items = homeRes?.data?.latestRelease || []
      const perPage = 20
      const totalPages = Math.ceil(items.length / perPage) || 1
      const start = (page - 1) * perPage
      const sliced = items.slice(start, start + perPage)
      return {
        success: true,
        data: {
          items: sliced,
          pagination: {
            current: page,
            total: totalPages,
            next: page < totalPages ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        }
      }
    } catch {
      throw createError({ statusCode: 502, statusMessage: 'Gagal mengambil daftar donghua' })
    }
  }
})
