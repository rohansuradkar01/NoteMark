export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Note {
    _id: string;
    user: string;
    title: string;
    content: string;
    tags: string[];
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Bookmark {
    _id: string;
    user: string;
    url: string;
    title: string;
    description: string;
    tags: string[];
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
}

export interface NoteInput {
    title: string;
    content: string;
    tags?: string[];
    isFavorite?: boolean;
}

export interface BookmarkInput {
    url: string;
    title?: string;
    description?: string;
    tags?: string[];
    isFavorite?: boolean;
}
