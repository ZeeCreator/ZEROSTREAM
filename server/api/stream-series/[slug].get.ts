export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  try {
    return await $fetch(`https://lk-21-apis.vercel.app/api/v1/streamtv/${slug}?resolve=false`)
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil stream series' })
  }
})
