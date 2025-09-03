import { api } from './client';
import type { Contact } from '../models/contact';

export async function getContact(id: string): Promise<Contact> {
    const { data } = await api.get(`/contacts/${id}`);
    return data;
}

export async function patchContact(id: string, payload: Partial<Contact>): Promise<Contact> {
    const { data } = await api.patch(`/contacts/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    return data;
}
