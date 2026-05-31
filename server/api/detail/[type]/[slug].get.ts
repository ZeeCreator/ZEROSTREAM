export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const type = getRouterParam(event, 'type')
  const slug = getRouterParam(event, 'slug')
  try {
    return await $fetch(`${config.public.apiBase}/${type}/${slug}`)
  } catch (err) {
    throw createError({ statusCode: 502, message: `Gagal mengambil detail ${type}` })
  }
})
