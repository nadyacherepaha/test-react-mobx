import { makeAutoObservable, runInAction } from 'mobx';
import type { Contact } from '../models/contact';
import { getContact, patchContact } from '../api/contact';

export class ContactStore {
    data: Contact | null = null;
    loading = false;
    error: string | null = null;

    constructor(private contactId: string) {
        makeAutoObservable(this);
    }

    async fetch() {
        this.loading = true;
        this.error = null;
        try {
            const data = await getContact(this.contactId);
            runInAction(() => (this.data = data));
        } catch (e: any) {
            runInAction(() => (this.error = e?.message ?? 'Failed to fetch contact'));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }

    async update(payload: Partial<Contact>) {
        this.loading = true;
        try {
            const updated = await patchContact(this.contactId, payload);
            runInAction(() => (this.data = updated));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }
}
