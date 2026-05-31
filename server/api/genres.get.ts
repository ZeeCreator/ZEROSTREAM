export default defineEventHandler(async () => {
  try {
    return await $fetch('https://lk-21-apis.vercel.app/api/v1/genres/')
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil daftar genre' })
  }
})
