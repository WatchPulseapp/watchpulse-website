/**
 * WatchPulse API Client
 * Central API layer that connects to the same backend as the mobile app.
 * Includes JWT auth, token refresh, and SWR fetcher.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Token Management ───────────────────────────────────────────────────────

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wp-access-token');
}

export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wp-refresh-token');
}

export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('wp-access-token', accessToken);
    localStorage.setItem('wp-refresh-token', refreshToken);
}

export function clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('wp-access-token');
    localStorage.removeItem('wp-refresh-token');
    localStorage.removeItem('wp-user');
}

// ─── Token Refresh ──────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!res.ok) {
                clearTokens();
                return null;
            }

            const data = await res.json();
            setTokens(data.token, data.refreshToken || refreshToken);
            return data.token;
        } catch {
            clearTokens();
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// ─── Core Fetch Wrapper ─────────────────────────────────────────────────────

interface ApiOptions extends RequestInit {
    /** Skip adding the Authorization header */
    noAuth?: boolean;
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { noAuth, headers: customHeaders, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(customHeaders as Record<string, string>),
    };

    // Attach JWT token unless explicitly skipped
    if (!noAuth) {
        const token = getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    // If 401, try refreshing the token and retry once
    if (res.status === 401 && !noAuth) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...fetchOptions,
                headers,
            });
        } else {
            // Refresh failed — user needs to log in again
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
            throw new ApiError('Session expired. Please log in again.', 401);
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(
            errorBody.error || errorBody.message || `API error ${res.status}`,
            res.status,
            errorBody
        );
    }

    return res.json();
}

// ─── SWR Fetcher ────────────────────────────────────────────────────────────

/** SWR-compatible fetcher that uses our authenticated API client */
export const swrFetcher = <T = unknown>(endpoint: string): Promise<T> =>
    apiFetch<T>(endpoint);

/** SWR-compatible fetcher for public (no-auth) endpoints */
export const swrPublicFetcher = <T = unknown>(endpoint: string): Promise<T> =>
    apiFetch<T>(endpoint, { noAuth: true });

// ─── API Error Class ────────────────────────────────────────────────────────

export class ApiError extends Error {
    status: number;
    data?: Record<string, unknown>;
    constructor(message: string, status: number, data?: Record<string, unknown>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        displayName: string;
        photoUrl?: string;
        avatarIndex?: number;
        role: string;
    };
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        noAuth: true,
    });
}

// ─── Timezone → Country Code Helper ──────────────────────────────────────────

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
    'Europe/Istanbul': 'TR',
    'Europe/London': 'GB',
    'Europe/Berlin': 'DE',
    'Europe/Paris': 'FR',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Amsterdam': 'NL',
    'Europe/Brussels': 'BE',
    'Europe/Vienna': 'AT',
    'Europe/Zurich': 'CH',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK',
    'Europe/Helsinki': 'FI',
    'Europe/Warsaw': 'PL',
    'Europe/Prague': 'CZ',
    'Europe/Budapest': 'HU',
    'Europe/Bucharest': 'RO',
    'Europe/Sofia': 'BG',
    'Europe/Athens': 'GR',
    'Europe/Lisbon': 'PT',
    'Europe/Dublin': 'IE',
    'Europe/Moscow': 'RU',
    'Europe/Kiev': 'UA',
    'Europe/Kyiv': 'UA',
    'Asia/Tokyo': 'JP',
    'Asia/Seoul': 'KR',
    'Asia/Shanghai': 'CN',
    'Asia/Kolkata': 'IN',
    'Asia/Calcutta': 'IN',
    'Asia/Dubai': 'AE',
    'Asia/Riyadh': 'SA',
    'Australia/Sydney': 'AU',
    'Pacific/Auckland': 'NZ',
    'America/Sao_Paulo': 'BR',
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Mexico_City': 'MX',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
};

function getCountryFromTimezone(tz: string): string {
    if (TIMEZONE_COUNTRY_MAP[tz]) return TIMEZONE_COUNTRY_MAP[tz];
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'DE';
    if (tz.startsWith('Asia/')) return 'IN';
    if (tz.startsWith('Australia/')) return 'AU';
    return 'TR';
}

export async function apiRegister(
    email: string,
    password: string,
    displayName: string
): Promise<LoginResponse> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
    const countryCode = getCountryFromTimezone(timezone);
    return apiFetch<LoginResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName, timezone, countryCode }),
        noAuth: true,
    });
}

export async function apiGoogleAuth(
    email: string,
    displayName: string,
    photoUrl: string | null,
    googleId: string,
    idToken: string
): Promise<LoginResponse> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
    const countryCode = getCountryFromTimezone(timezone);
    return apiFetch<LoginResponse>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({
            email,
            displayName,
            photoUrl,
            googleId,
            idToken,
            timezone,
            countryCode,
        }),
        noAuth: true,
    });
}

// ─── User API ───────────────────────────────────────────────────────────────

export interface UserProfile {
    _id: string;
    email: string;
    displayName: string;
    photoUrl?: string;
    avatarIndex?: number;
    username?: string;
    bio?: string;
    role: string;
    favoriteMovies: (string | number)[];
    watchlist: (string | number)[];
    preferences?: {
        genres?: number[];
        language?: string;
        moods?: string[];
    };
    isPremium?: boolean;
    countryCode?: string;
    timezone?: string;
    followersCount?: number;
    followingCount?: number;
    createdAt: string;
}

export async function apiGetProfile(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/users/profile');
}

export async function apiUpdateProfile(
    data: Partial<Pick<UserProfile, 'displayName' | 'photoUrl' | 'preferences'>>
): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

// ─── Favorites & Watchlist ──────────────────────────────────────────────────
// IDs must use prefixed format: "movie_123" or "tv_456" (matching Flutter app)

export async function apiAddFavorite(movieId: string) {
    return apiFetch(`/api/users/favorites/${movieId}`, { method: 'POST' });
}

export async function apiRemoveFavorite(movieId: string) {
    return apiFetch(`/api/users/favorites/${movieId}`, { method: 'DELETE' });
}

export async function apiAddToWatchlist(movieId: string) {
    return apiFetch(`/api/users/watchlist/${movieId}`, { method: 'POST' });
}

export async function apiRemoveFromWatchlist(movieId: string) {
    return apiFetch(`/api/users/watchlist/${movieId}`, { method: 'DELETE' });
}

// ─── Content API ────────────────────────────────────────────────────────────

export interface TMDBContent {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity?: number;
    release_date?: string;
    first_air_date?: string;
    genre_ids: number[];
    media_type?: string;
    type?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    // Person-specific (TMDB multi search)
    profile_path?: string | null;
    known_for_department?: string;
}

export interface ContentResponse {
    success: boolean;
    results: TMDBContent[];
    page: number;
    totalPages: number;
    totalResults: number;
}

export interface ContentDetail {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    release_date?: string;
    first_air_date?: string;
    genres: { id: number; name: string }[];
    runtime?: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
    status: string;
    tagline?: string;
    original_language: string;
    production_countries: { iso_3166_1: string; name: string }[];
    credits?: {
        cast: Array<{
            id: number;
            name: string;
            character: string;
            profile_path: string | null;
            order: number;
        }>;
        crew: Array<{
            id: number;
            name: string;
            job: string;
            department: string;
            profile_path: string | null;
        }>;
    };
    videos?: {
        results: Array<{
            id: string;
            key: string;
            name: string;
            site: string;
            type: string;
        }>;
    };
    similar?: {
        results: TMDBContent[];
    };
    seasons?: Array<{
        id: number;
        name: string;
        season_number: number;
        episode_count: number;
        poster_path: string | null;
        overview: string;
        air_date: string;
    }>;
}

// ─── Streaming Response ─────────────────────────────────────────────────────

export interface StreamingPlatform {
    id: number;
    name: string;
    logo: string;
    type: string;
    quality?: string;
    deepLink?: string | null;
    searchUrl?: string | null;
    videoLink?: string | null;
    hasSubtitles?: boolean;
    hasTurkishAudio?: boolean;
}

export interface StreamingResponse {
    success: boolean;
    tmdbId: number;
    available: boolean;
    platforms: StreamingPlatform[];
    country?: string;
    mediaType?: string;
    justWatchLink?: string;
    message?: string;
}

// ─── TMDB Image Helpers ─────────────────────────────────────────────────────

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' = 'w500'): string {
    if (!path) return '/placeholder-poster.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function profileUrl(path: string | null, size: 'w185' | 'w342' | 'h632' = 'w185'): string {
    if (!path) return '/placeholder-avatar.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// ─── Duel API ──────────────────────────────────────────────────────────────

export interface DuelContent {
    tmdbId: number;
    title: string;
    posterPath: string | null;
    overview?: string;
    voteAverage: number;
    releaseYear?: number;
}

export interface Duel {
    _id: string;
    id?: string;
    content1: DuelContent;
    content2: DuelContent;
    status: 'active' | 'completed' | 'upcoming';
    startDate: string;
    endDate: string;
    votes1: number;
    votes2: number;
    totalVotes: number;
    percentage1?: number;
    percentage2?: number;
    isActive?: boolean;
    remainingTime?: number;
    winner?: number;
    type?: string;
    weekNumber?: number;
    year?: number;
}

export interface DuelsResponse {
    success: boolean;
    state?: string;
    duels: Record<string, Duel> | Duel[];
    endDate?: string;
    nextDuelStart?: string;
    winnerDisplayEndsAt?: string;
}

export interface DuelHistoryResponse {
    success: boolean;
    duels: Duel[];
    total: number;
    hasMore: boolean;
}

export interface MyVotesResponse {
    success: boolean;
    votes: Record<string, 1 | 2>;
    count?: number;
}

export async function apiGetActiveDuels(): Promise<DuelsResponse> {
    return apiFetch<DuelsResponse>('/api/duels/active');
}

export async function apiVoteDuel(duelId: string, choice: 1 | 2): Promise<{ success: boolean }> {
    return apiFetch('/api/duels/vote', {
        method: 'POST',
        body: JSON.stringify({ duelId, choice }),
    });
}

export async function apiGetDuelHistory(page = 1): Promise<DuelHistoryResponse> {
    return apiFetch<DuelHistoryResponse>(`/api/duels/history?page=${page}`);
}

export async function apiGetMyVotes(): Promise<MyVotesResponse> {
    return apiFetch<MyVotesResponse>('/api/duels/my-votes');
}

// ─── Follow API ────────────────────────────────────────────────────────────

export async function apiFollowUser(userId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/users/${userId}/follow`, { method: 'POST' });
}

export async function apiUnfollowUser(userId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/users/${userId}/follow`, { method: 'DELETE' });
}

export async function apiGetFollowStatus(userId: string): Promise<{ isFollowing: boolean }> {
    return apiFetch(`/api/users/${userId}/follow-status`);
}

export interface FollowUser {
    _id: string;
    displayName: string;
    photoUrl?: string;
}

export interface FollowersResponse {
    success: boolean;
    followers: FollowUser[];
    pagination: { page: number; limit: number; total: number; pages: number; hasMore: boolean };
}

export interface FollowingResponse {
    success: boolean;
    following: FollowUser[];
    pagination: { page: number; limit: number; total: number; pages: number; hasMore: boolean };
}

export async function apiGetFollowers(userId: string, page = 1): Promise<FollowersResponse> {
    return apiFetch<FollowersResponse>(`/api/users/${userId}/followers?page=${page}`);
}

export async function apiGetFollowing(userId: string, page = 1): Promise<FollowingResponse> {
    return apiFetch<FollowingResponse>(`/api/users/${userId}/following?page=${page}`);
}

// ─── User Profile API ──────────────────────────────────────────────────────

export interface UserPublicProfile {
    _id: string;
    displayName: string;
    username?: string;
    photoUrl?: string;
    avatarIndex?: number;
    bio?: string;
    followersCount: number;
    followingCount: number;
    publicCollectionsCount?: number;
    joinedAt?: string;
    isFollowing?: boolean;
}

export async function apiGetUserProfile(userId: string): Promise<{ success: boolean; user: UserPublicProfile }> {
    return apiFetch<{ success: boolean; user: UserPublicProfile }>(`/api/users/${userId}/profile`);
}

// ─── Platform API ──────────────────────────────────────────────────────────

export interface Platform {
    id: string;
    name: string;
    logo_path?: string;
    logo?: string;
    provider_id?: number;
    providerId?: number;
    color?: string;
    hasOriginals?: boolean;
    featuredBackdrop?: string;
    extraBackdrops?: string[];
    totalContent?: number;
    movieCount?: number;
    tvCount?: number;
}

export interface Genre {
    id: number;
    name: string;
}

export async function apiGetPlatforms(): Promise<{ success: boolean; platforms: Platform[] }> {
    return apiFetch('/api/platform/list', { noAuth: true });
}

export async function apiGetPlatformContent(
    platformId: string,
    filters?: { type?: string; genre?: string; year?: string; sort?: string; page?: number }
): Promise<ContentResponse> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.genre) params.set('genre', filters.genre);
    if (filters?.year) params.set('year', filters.year);
    if (filters?.sort) params.set('sort', filters.sort);
    if (filters?.page) params.set('page', String(filters.page));
    return apiFetch<ContentResponse>(`/api/platform/${platformId}/content?${params.toString()}`, { noAuth: true });
}

export async function apiGetGenres(): Promise<{ success: boolean; genres: Genre[] }> {
    return apiFetch('/api/platform/genres', { noAuth: true });
}

// ─── Collection Detail API ─────────────────────────────────────────────────

export interface CollectionDetail {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    category?: string;
    movies: Array<Record<string, unknown>>;
    movieDetails?: Array<{
        id: number;
        title: string;
        name?: string;
        poster_path: string | null;
        vote_average?: number;
        release_date?: string;
        first_air_date?: string;
        media_type?: string;
    }>;
    isPublic: boolean;
    isPublished?: boolean;
    publishedAt?: string | null;
    userId?: string;
    creatorName?: string;
    shareCode?: string;
    saves?: number;
    views?: number;
    createdAt: string;
}

export async function apiGetCollectionDetail(id: string): Promise<{ success: boolean; collection: CollectionDetail }> {
    return apiFetch(`/api/user-collections/${id}`);
}

export async function apiAddMovieToCollection(collectionId: string, movieId: number, mediaType?: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/user-collections/${collectionId}/movies`, {
        method: 'POST',
        body: JSON.stringify({ movieId, mediaType }),
    });
}

export async function apiRemoveMovieFromCollection(collectionId: string, movieId: number, mediaType?: string): Promise<{ success: boolean }> {
    const query = mediaType ? `?mediaType=${mediaType}` : '';
    return apiFetch(`/api/user-collections/${collectionId}/movies/${movieId}${query}`, {
        method: 'DELETE',
    });
}

export async function apiPublishCollection(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/user-collections/${id}/publish`, { method: 'POST' });
}

export async function apiUnpublishCollection(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/user-collections/${id}/publish`, { method: 'DELETE' });
}

export async function apiShareCollection(id: string): Promise<{ success: boolean; shareCode: string }> {
    return apiFetch(`/api/user-collections/${id}/share`, { method: 'POST' });
}

export async function apiGetSharedCollection(shareCode: string, withAuth = false): Promise<{ success: boolean; collection: CollectionDetail }> {
    const token = getAccessToken(); return apiFetch(`/api/user-collections/shared/${shareCode}`, { noAuth: !token });
}

export async function apiImportCollection(shareCode: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/user-collections/import/${shareCode}`, { method: 'POST' });
}

// ─── Discover API ──────────────────────────────────────────────────────────

export interface DiscoverCategory {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

export async function apiGetDiscoverCategories(): Promise<{ success: boolean; categories: DiscoverCategory[] }> {
    return apiFetch('/api/discover/categories', { noAuth: true });
}

export async function apiSaveDiscoverCollection(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/discover/${id}/save`, { method: 'POST' });
}

// ─── User Collections List (for modals) ────────────────────────────────────

export interface UserCollectionSummary {
    _id: string;
    name: string;
    movies: number[];
}

export async function apiGetMyCollections(): Promise<{ success: boolean; collections: UserCollectionSummary[] }> {
    return apiFetch('/api/user-collections');
}

// ─── Collaborative Collection API ────────────────────────────────────────────

export async function apiMakeCollaborative(collectionId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/${collectionId}/make-collaborative`, { method: 'POST' });
}

export async function apiRevertToNormal(collectionId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/${collectionId}/revert-to-normal`, { method: 'POST' });
}

export async function apiInviteCollaborator(collectionId: string, userId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/${collectionId}/invite/${userId}`, { method: 'POST' });
}

export async function apiRemoveCollaborator(collectionId: string, userId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/${collectionId}/collaborators/${userId}`, { method: 'DELETE' });
}

export async function apiGetCollaborators(collectionId: string): Promise<{ success: boolean; collaborators: Array<{ _id: string; displayName: string; photoUrl?: string; role: string }> }> {
    return apiFetch(`/api/collaborative/${collectionId}/collaborators`);
}

export async function apiLeaveCollection(collectionId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/${collectionId}/leave`, { method: 'POST' });
}

export async function apiGetCollaborationInvites(): Promise<{ success: boolean; invites: Array<{ _id: string; collectionId: string; collectionName: string; inviterName: string; inviterPhotoUrl?: string; role: string; createdAt: string; status: string }> }> {
    return apiFetch('/api/collaborative/invites');
}

export async function apiAcceptInvite(inviteId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/invites/${inviteId}/accept`, { method: 'POST' });
}

export async function apiRejectInvite(inviteId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/collaborative/invites/${inviteId}/reject`, { method: 'POST' });
}

export async function apiGetSentInvites(): Promise<{ success: boolean; invites: Array<{ _id: string; collectionId: string; collectionName: string; inviteeName: string; inviteePhotoUrl?: string; status: string; createdAt: string }> }> {
    return apiFetch('/api/collaborative/sent-invites');
}

export async function apiGetCollaborationActivity(collectionId: string): Promise<{ success: boolean; activities: Array<{ _id: string; action: string; userName: string; details?: string; createdAt: string }> }> {
    return apiFetch(`/api/collaborative/${collectionId}/activity`);
}

// ─── Premium API ──────────────────────────────────────────────────────────────

export async function apiGetPremiumStatus(): Promise<{
    success: boolean;
    premium: {
        isActive: boolean;
        plan: string | null;
        startDate?: string;
        expiryDate?: string;
        daysRemaining: number;
        selectedTheme: string;
        isExpired: boolean;
    };
}> {
    return apiFetch('/api/premium/status');
}

// TODO: Send plan to backend when subscription endpoint is ready
export async function apiCreateSubscription(
    // eslint-disable-next-line no-unused-vars
    _plan: 'monthly' | 'yearly'
): Promise<{ success: boolean; subscriptionId?: string }> {
    return apiFetch('/api/premium/status');
}

// ─── User Search API ──────────────────────────────────────────────────────────

export interface UserSearchResult {
    _id: string;
    displayName: string;
    username?: string;
    bio?: string;
    photoUrl?: string;
    avatarUrl?: string;
    followersCount?: number;
    isFollowing?: boolean;
}

export async function apiSearchUsers(query: string, limit = 10): Promise<{ success: boolean; users: UserSearchResult[] }> {
    return apiFetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

// ─── Password Reset API ──────────────────────────────────────────────────────

export async function apiRequestPasswordReset(email: string): Promise<{ success: boolean }> {
    return apiFetch('/api/auth/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
        noAuth: true,
    });
}

export async function apiResetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean }> {
    return apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword }),
        noAuth: true,
    });
}

// ─── Subscription APIs ────────────────────────────────────────────────────────

export async function apiGetMovieSubscriptions(): Promise<{ success: boolean; count: number; subscriptions: Array<{ _id: string; movieId: number; movieTitle: string; posterPath?: string | null; releaseDate?: string | null; status: string; notificationEnabled: boolean }> }> {
    return apiFetch('/api/movie-subscriptions');
}

export async function apiGetTvSubscriptions(): Promise<{ success: boolean; count: number; subscriptions: Array<{ _id: string; tvShowId: number; tvShowName: string; posterPath?: string | null; notificationEnabled: boolean; nextEpisode?: { season: number; episode: number; airDate: string; name?: string } | null; tvShowStatus?: string }> }> {
    return apiFetch('/api/tv-subscriptions');
}

export async function apiGetUpcomingEpisodes(): Promise<{ success: boolean; upcoming: { today: Array<{ tvShowId: number; tvShowName: string; posterPath?: string | null; nextEpisode?: { season: number; episode: number; airDate: string; name?: string } | null }>; tomorrow: Array<{ tvShowId: number; tvShowName: string; posterPath?: string | null; nextEpisode?: { season: number; episode: number; airDate: string; name?: string } | null }>; thisWeek: Array<{ tvShowId: number; tvShowName: string; posterPath?: string | null; nextEpisode?: { season: number; episode: number; airDate: string; name?: string } | null }>; later: Array<{ tvShowId: number; tvShowName: string; posterPath?: string | null; nextEpisode?: { season: number; episode: number; airDate: string; name?: string } | null }> } }> {
    return apiFetch('/api/tv-subscriptions/upcoming');
}

// ─── Favorite Actors API ──────────────────────────────────────────────────────

export async function apiAddFavoriteActor(actorId: number, name: string, profilePath: string | null): Promise<{ success: boolean }> {
    return apiFetch('/api/users/favorite-actors', {
        method: 'POST',
        body: JSON.stringify({ actorId, name, profilePath }),
    });
}

export async function apiRemoveFavoriteActor(actorId: number): Promise<{ success: boolean }> {
    return apiFetch(`/api/users/favorite-actors/${actorId}`, { method: 'DELETE' });
}

export async function apiGetFavoriteActors(): Promise<{ success: boolean; favoriteActors: Array<{ actorId: number; name: string; profilePath?: string | null }> }> {
    return apiFetch('/api/users/favorite-actors');
}

// ─── Notifications API ───────────────────────────────────────────────────────

export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'promotion' | 'update';
    imageUrl?: string;
    actionUrl?: string;
    isRead: boolean;
    metadata?: Record<string, string>;
    createdAt: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    totalPages: number;
    currentPage: number;
    total: number;
    unreadCount: number;
}

export async function apiGetNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    return apiFetch<NotificationsResponse>(`/api/notifications?page=${page}&limit=${limit}`);
}

export async function apiGetUnreadCount(): Promise<{ unreadCount: number }> {
    return apiFetch<{ unreadCount: number }>('/api/notifications/unread/count');
}

export async function apiMarkNotificationAsRead(id: string): Promise<Notification> {
    return apiFetch<Notification>(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

export async function apiMarkAllNotificationsAsRead(): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/api/notifications/read-all', { method: 'PATCH' });
}

export async function apiDeleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(`/api/notifications/${id}`, { method: 'DELETE' });
}

// ─── Discover Stats API ──────────────────────────────────────────────────────

export async function apiGetDiscoverStats(): Promise<{ success: boolean; stats: { totalCollections: number; totalViews: number; totalSaves: number } }> {
    return apiFetch('/api/discover/stats', { noAuth: true });
}

// ─── Auth - Current User & Account ─────────────────────────────────────────

export async function apiGetCurrentUser(): Promise<{ success: boolean; user: UserProfile }> {
    return apiFetch('/api/auth/me');
}

export async function apiDeleteAccount(password: string): Promise<{ success: boolean }> {
    return apiFetch('/api/auth/delete-account', {
        method: 'POST',
        body: JSON.stringify({ password, confirmDeletion: true }),
    });
}

// ─── TV Episode Tracking ──────────────────────────────────────────────────

export async function apiToggleEpisodeWatched(
    tvShowId: string,
    season: number,
    episode: number,
    watched: boolean
): Promise<{ success: boolean }> {
    return apiFetch(`/api/tv-subscriptions/${tvShowId}/episode`, {
        method: 'PATCH',
        body: JSON.stringify({ season, episode, watched }),
    });
}

export async function apiToggleSeasonWatched(
    tvShowId: string,
    season: number,
    watched: boolean,
    episodeCount: number
): Promise<{ success: boolean }> {
    return apiFetch(`/api/tv-subscriptions/${tvShowId}/season/${season}`, {
        method: 'PATCH',
        body: JSON.stringify({ watched, episodeCount }),
    });
}

export async function apiGetWatchedEpisodes(
    tvShowId: string
): Promise<{ success: boolean; episodes: Array<{ season: number; episode: number }> }> {
    return apiFetch(`/api/tv-subscriptions/${tvShowId}/episodes`);
}

export async function apiGetTvSubscriptionsByStatus(
    status: string
): Promise<{ success: boolean; subscriptions: Array<{ _id: string; tvShowId: number; tvShowName: string; posterPath?: string | null; tvShowStatus?: string }> }> {
    return apiFetch(`/api/tv-subscriptions/by-status/${encodeURIComponent(status)}`);
}

// ─── Streaming Search ─────────────────────────────────────────────────────

export async function apiSearchStreaming(
    title: string,
    country?: string
): Promise<{ success: boolean; results: Array<{ tmdbId: number; title: string; mediaType: string; platforms: StreamingPlatform[] }> }> {
    const params = country ? `?country=${encodeURIComponent(country)}` : '';
    return apiFetch(`/api/streaming/search/${encodeURIComponent(title)}${params}`);
}

// ─── Following Feed ───────────────────────────────────────────────────────

export async function apiGetFollowingFeed(
    page = 1,
    limit = 20
): Promise<{ success: boolean; feed: Array<{ _id: string; userId: string; userName: string; userPhoto?: string; action: string; contentId?: number; contentTitle?: string; contentPoster?: string; createdAt: string }>; hasMore: boolean }> {
    return apiFetch(`/api/users/me/feed?page=${page}&limit=${limit}`);
}
