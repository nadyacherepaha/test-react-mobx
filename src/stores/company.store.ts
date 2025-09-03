import { makeAutoObservable, runInAction } from 'mobx';
import type { Company, CompanyPhoto } from '../models/company';
import { getCompany, patchCompany, deleteCompany, uploadCompanyImage, deleteCompanyImage } from '../api/company';

export class CompanyStore {
    data: Company | null = null;
    loading = false;
    error: string | null = null;

    constructor(private companyId: string) {
        makeAutoObservable(this);
    }

    async fetch() {
        this.loading = true;
        this.error = null;
        try {
            const data = await getCompany(this.companyId);
            runInAction(() => (this.data = data));
        } catch (e: any) {
            runInAction(() => (this.error = e?.message ?? 'Failed to fetch company'));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }

    async update(payload: Partial<Company>) {
        this.loading = true;
        try {
            const updated = await patchCompany(this.companyId, payload);
            runInAction(() => (this.data = updated));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }

    async remove() {
        this.loading = true;
        try {
            await deleteCompany(this.companyId);
            runInAction(() => (this.data = null));
        } finally {
            runInAction(() => (this.loading = false));
        }
    }

    async uploadImage(file: File) {
        const photo: CompanyPhoto = await uploadCompanyImage(this.companyId, file);
        runInAction(() => {
            if (this.data) this.data.photos = [photo, ...this.data.photos];
        });
    }

    async deleteImage(name: string) {
        await deleteCompanyImage(this.companyId, name);
        runInAction(() => {
            if (this.data) this.data.photos = this.data.photos.filter((p) => p.name !== name);
        });
    }
}
