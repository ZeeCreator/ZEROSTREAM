export interface Anime {
  id: string
  title: string
  slug: string
  poster: string
  synopsis: string
  genre: string[]
  studio: string
  year: number
  rating: number
  status: string
  duration: string
  episodes: Episode[]
  type: 'anime'
}

export interface Movie {
  id: string
  title: string
  slug: string
  poster: string
  backdrop: string
  synopsis: string
  genre: string[]
  cast: string[]
  director: string
  runtime: string
  rating: number
  year: number
  server: string[]
  type: 'movie'
}

export interface Episode {
  id: number
  title: string
  slug: string
  duration: string
  thumbnail: string
  status: 'watched' | 'active' | 'upcoming'
}

export interface ContentItem {
  id: string
  title: string
  slug: string
  poster: string
  rating?: number
  quality?: string
  year?: number
  type: 'anime' | 'movie' | 'tv'
  genre?: string[]
  episodeCount?: number | string
}

export interface PaginationMeta {
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse {
  items: ContentItem[]
  meta: PaginationMeta
}

export interface SearchResult {
  items: ContentItem[]
  total: number
  query: string
}

export interface RebahinMovie {
  externalId: string
  title: string
  slug: string
  type: 'movie'
  posterUrl: string
  rating?: number
  quality: string
}

export interface Genre {
  name: string
  slug: string
}

export interface GenreMovie {
  externalId: string
  title: string
  slug: string
  type: 'movie'
  posterUrl: string
  rating?: number
  quality: string
}

export interface GenreResponse {
  success: boolean
  code: number
  message: string
  data: Genre[]
}

export interface GenreMovieResponse {
  success: boolean
  code: number
  message: string
  data: GenreMovie[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface RebahinResponse {
  success: boolean
  code: number
  message: string
  data: RebahinMovie[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface WatchSource {
  url: string
  server: string
  isEmbed: boolean
}

export interface DownloadLink {
  url: string
  provider: string
}

export interface MovieDetail {
  externalId: string
  title: string
  slug: string
  type: string
  description: string
  posterUrl: string
  year: number
  rating: number
  duration: string
  quality: string
  country: string
  genres: string[]
  releaseDate: string
  watchSources: WatchSource[]
  downloadLinks: DownloadLink[]
}

export interface MovieDetailResponse {
  success: boolean
  code: number
  message: string
  data: MovieDetail
}

export interface WatchResponse {
  success: boolean
  code: number
  message: string
  data: WatchSource[]
}

export interface SeriesItem {
  externalId: string
  title: string
  slug: string
  type: 'tv'
  episodeCount: string
  posterUrl: string
  rating?: number
}

export interface SeriesEpisode {
  title: string
  slug: string
  episode: string
}

export interface SeriesDetail {
  externalId: string
  title: string
  slug: string
  type: string
  description: string
  posterUrl: string
  year: number
  rating: number
  duration: string
  quality: string
  country: string
  genres: string[]
  releaseDate: string
  episodeCount: string
  episodes: SeriesEpisode[]
  watchSources: WatchSource[]
}

export interface SeriesResponse {
  success: boolean
  code: number
  message: string
  data: SeriesItem[]
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
}

export interface SeriesDetailResponse {
  success: boolean
  code: number
  message: string
  data: SeriesDetail
}

export interface AnimeV2Item {
  title: string
  slug: string
  poster: string
  rating: number | null
  quality: string | null
  type: string | null
  episode: string | null
  year: number | null
  genre: string | null
  link?: string | null
}

export interface AnimeV2Response {
  success: boolean
  code: number
  message: string
  data: {
    popularToday: AnimeV2Item[]
    latest: AnimeV2Item[]
    popularWeekly: AnimeV2Item[]
  }
}

export interface AnimeV2Episode {
  number: string
  title: string
  slug: string
  date: string
}

export interface AnimeV2Character {
  name: string
  role: string
  actor: {
    name: string
    slug: string
  }
}

export interface AnimeV2StreamServer {
  name: string
  url: string
  index: number
}

export interface AnimeV2DownloadLink {
  provider: string
  url: string
}

export interface AnimeV2DownloadGroup {
  quality: string
  links: AnimeV2DownloadLink[]
}

export interface AnimeV2PrevNext {
  title: string
  slug: string
}

export interface AnimeV2EpisodeWatch {
  title: string
  slug: string
  seriesTitle: string
  seriesSlug: string
  episodeNumber: string
  poster: string
  rating: number
  type: string
  releaseDate: string
  streamServers: AnimeV2StreamServer[]
  currentEmbed: string
  downloads: AnimeV2DownloadGroup[]
  prevEpisode: AnimeV2PrevNext | null
  nextEpisode: AnimeV2PrevNext | null
}

export interface AnimeV2Detail {
  title: string
  altTitles: string[]
  slug: string
  poster: string
  rating: number
  status: string
  studio: string
  year: number
  duration: string
  season: string
  type: string
  episodeCount: number | null
  fansub: string
  director: string[]
  casts: string[]
  genres: { name: string; slug: string }[]
  synopsis: string
  description: string
  episodes: AnimeV2Episode[]
  characters: AnimeV2Character[]
  recommendations: AnimeV2Item[]
}

export interface DonghuaItem {
  title: string
  slug: string
  poster: string
  type: string | null
  episode: string | null
  status: string | null
}

export interface DonghuaHomeData {
  slider: DonghuaItem[]
  popularToday: DonghuaItem[]
  latestRelease: DonghuaItem[]
}

export interface DonghuaHomeResponse {
  success: boolean
  code: number
  message: string
  data: DonghuaHomeData
}

export interface DonghuaGenre {
  name: string
  slug: string
}

export interface DonghuaDetail {
  title: string
  altTitles: string[]
  slug: string
  poster: string
  cover: string
  rating: number
  status: string
  studio: string | null
  network: string | null
  type: string | null
  season: string | null
  country: string | null
  duration: string
  released: string
  fansub: string
  genres: DonghuaGenre[]
  synopsis: string
  episodes: any[]
  downloads: any[]
}

export interface DonghuaDetailResponse {
  success: boolean
  code: number
  message: string
  data: DonghuaDetail
}

export interface DonghuaDownloadLink {
  provider: string
  url: string
}

export interface DonghuaQuality {
  quality: string
  links: DonghuaDownloadLink[]
}

export interface DonghuaDownloadGroup {
  title: string
  qualities: DonghuaQuality[]
}

export interface DonghuaEpisodeData {
  title: string
  slug: string
  episodeNumber: string
  poster: string
  seriesTitle: string
  seriesSlug: string
  releaseDate: string
  streamServers: any[]
  currentEmbed: string
  downloads: DonghuaDownloadGroup[]
  seriesInfo: {
    title: string
    altTitles: string[]
    poster: string
    rating: number
    status: string
    genres: DonghuaGenre[]
    synopsis: string
  } | null
  prevEpisode: { title: string; slug: string } | null
  nextEpisode: { title: string; slug: string } | null
}

export interface DonghuaEpisodeResponse {
  success: boolean
  code: number
  message: string
  data: DonghuaEpisodeData
}

export interface DonghuaSearchData {
  query: string
  items: DonghuaItem[]
}

export interface DonghuaSearchResponse {
  success: boolean
  code: number
  message: string
  data: DonghuaSearchData
}
