export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  try {
    return await $fetch(`https://lk-21-apis.vercel.app/api/v1/watch/${slug}?resolve=true`)
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil sumber streaming' })
  }
})
