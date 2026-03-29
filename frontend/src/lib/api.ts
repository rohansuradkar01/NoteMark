import { ApiResponse, AuthResponse, Note, Bookmark, NoteInput, BookmarkInput } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    }

    // Auth endpoints
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getMe(): Promise<ApiResponse<{ id: string; name: string; email: string }>> {
        return this.request('/auth/me');
    }

    // Notes endpoints
    async getNotes(query?: string, tags?: string[], favorites?: boolean): Promise<ApiResponse<Note[]>> {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (tags && tags.length > 0) params.append('tags', tags.join(','));
        if (favorites) params.append('favorites', 'true');

        const queryString = params.toString();
        return this.request(`/notes${queryString ? `?${queryString}` : ''}`);
    }

    async getNote(id: string): Promise<ApiResponse<Note>> {
        return this.request(`/notes/${id}`);
    }

    async createNote(note: NoteInput): Promise<ApiResponse<Note>> {
        return this.request('/notes', {
            method: 'POST',
            body: JSON.stringify(note),
        });
    }

    async updateNote(id: string, note: Partial<NoteInput>): Promise<ApiResponse<Note>> {
        return this.request(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(note),
        });
    }

    async deleteNote(id: string): Promise<ApiResponse<object>> {
        return this.request(`/notes/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleNoteFavorite(id: string): Promise<ApiResponse<Note>> {
        return this.request(`/notes/${id}/favorite`, {
            method: 'PUT',
        });
    }

    // Bookmarks endpoints
    async getBookmarks(query?: string, tags?: string[], favorites?: boolean): Promise<ApiResponse<Bookmark[]>> {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (tags && tags.length > 0) params.append('tags', tags.join(','));
        if (favorites) params.append('favorites', 'true');

        const queryString = params.toString();
        return this.request(`/bookmarks${queryString ? `?${queryString}` : ''}`);
    }

    async getBookmark(id: string): Promise<ApiResponse<Bookmark>> {
        return this.request(`/bookmarks/${id}`);
    }

    async createBookmark(bookmark: BookmarkInput): Promise<ApiResponse<Bookmark>> {
        return this.request('/bookmarks', {
            method: 'POST',
            body: JSON.stringify(bookmark),
        });
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkInput>): Promise<ApiResponse<Bookmark>> {
        return this.request(`/bookmarks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookmark),
        });
    }

    async deleteBookmark(id: string): Promise<ApiResponse<object>> {
        return this.request(`/bookmarks/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleBookmarkFavorite(id: string): Promise<ApiResponse<Bookmark>> {
        return this.request(`/bookmarks/${id}/favorite`, {
            method: 'PUT',
        });
    }
}

export const api = new ApiClient();
