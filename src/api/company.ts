import { api } from './client';
import type { Company, CompanyPhoto } from '../models/company';

export async function getCompany(id: string): Promise<Company> {
    const { data } = await api.get(`/companies/${id}`);
    return data;
}

export async function patchCompany(id: string, payload: Partial<Company>): Promise<Company> {
    const { data } = await api.patch(`/companies/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    return data;
}

export async function deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
}

export async function uploadCompanyImage(id: string, file: File): Promise<CompanyPhoto> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/companies/${id}/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

export async function deleteCompanyImage(id: string, imageName: string): Promise<void> {
    await api.delete(`/companies/${id}/image/${imageName}`);
}
