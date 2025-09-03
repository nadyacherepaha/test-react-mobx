import { api } from './client';

export async function fetchAuthToken(username: string): Promise<string> {
    const res = await api.get('/auth', { params: { user: username } });
    const headers = res.headers as Record<string, string>;
    const token = headers['authorization'];
    if (!token) throw new Error('Authorization header not found');
    return token;
}
