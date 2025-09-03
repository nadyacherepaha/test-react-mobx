import { makeAutoObservable, runInAction } from 'mobx';
import { fetchAuthToken } from '../api/auth';
import { setAuthHeader } from '../api/client';
import { API_USER } from '../config';

export class AuthStore {
    token: string | null = null;
    username = API_USER;
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        const saved = localStorage.getItem('token');
        if (saved) {
            this.token = saved;
            setAuthHeader(saved);
        }
    }

    get isAuthed() {
        return !!this.token;
    }

    async login(username?: string) {
        this.loading = true;
        this.error = null;
        try {
            const user = username ?? this.username;
            const token = await fetchAuthToken(user);
            runInAction(() => {
                this.token = token;
                localStorage.setItem('token', token);
                setAuthHeader(token);
            });
        } catch (e: any) {
            runInAction(() => (this.error = e?.message ?? 'Auth error'));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        setAuthHeader(null);
    }
}
