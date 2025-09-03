import { http, HttpResponse } from 'msw';
import type { Company, CompanyPhoto } from '../models/company';
import type { Contact } from '../models/contact';

let token = 'Bearer mock-token-' + Math.random().toString(36).slice(2);

let company: Company | null = {
    id: '12',
    contactId: '16',
    name: 'Eternal Rest Funeral Home',
    shortName: 'ERFH',
    businessEntity: 'Partnership',
    contract: { no: '1624/2-24', issue_date: '2024-03-12T00:00:00Z' },
    type: ['funeral_home', 'logistics_services', 'burial_care_contractor'],
    status: 'active',
    photos: [
        {
            name: 'seed-1.jpg',
            filepath: 'https://picsum.photos/seed/seed-1/1200/800',
            thumbpath: 'https://picsum.photos/seed/seed-1/300/200',
            createdAt: new Date().toISOString(),
        },
    ],
    createdAt: '2020-11-21T08:03:00Z',
    updatedAt: '2020-11-23T09:30:00Z',
};

let contact: Contact = {
    id: '16',
    lastname: 'Rosenberg',
    firstname: 'David',
    phone: '17025552345',
    email: 'david_rosenberg88@gmail.com',
    createdAt: '2020-11-21T08:03:26.589Z',
    updatedAt: '2020-11-23T09:30:00Z',
};

function requireAuth(req: Request) {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer')) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return null;
}

export const handlers = [
    http.get('/api/auth', ({ request, requestId, params, url }) => {
        const user = new URL(request.url).searchParams.get('user') ?? 'demo';
        token = 'Bearer mock-' + user + '-' + Math.random().toString(36).slice(2);
        return new HttpResponse(null, {
            status: 200,
            headers: { Authorization: token },
        });
    }),

    // COMPANIES
    http.get('/api/companies/:id', ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!company || params.id !== company.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        return HttpResponse.json(company, { status: 200 });
    }),

    http.patch('/api/companies/:id', async ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!company || params.id !== company.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        const body = await request.json();
        company = {
            ...company,
            ...body,
            contract: { ...company.contract, ...(body.contract || {}) },
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(company, { status: 200 });
    }),

    http.delete('/api/companies/:id', ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!company || params.id !== company.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        company = null;
        return HttpResponse.json({ ok: true }, { status: 200 });
    }),

    http.post('/api/companies/:id/image', async ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!company || params.id !== company.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }

        const form = await request.formData();
        const file = form.get('file') as File | null;
        const seed = 'img-' + Math.random().toString(36).slice(2);
        const photo: CompanyPhoto = {
            name: file?.name || `${seed}.jpg`,
            filepath: `https://picsum.photos/seed/${seed}/1200/800`,
            thumbpath: `https://picsum.photos/seed/${seed}/300/200`,
            createdAt: new Date().toISOString(),
        };
        company.photos = [photo, ...(company.photos || [])];
        return HttpResponse.json(photo, { status: 200 });
    }),

    http.delete('/api/companies/:id/image/:name', ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!company || params.id !== company.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        const name = params.name as string;
        company.photos = (company.photos || []).filter((p) => p.name !== name);
        return HttpResponse.json({ ok: true }, { status: 200 });
    }),

    // CONTACTS
    http.get('/api/contacts/:id', ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!contact || params.id !== contact.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        return HttpResponse.json(contact, { status: 200 });
    }),

    http.patch('/api/contacts/:id', async ({ params, request }) => {
        const guard = requireAuth(request);
        if (guard) return guard;
        if (!contact || params.id !== contact.id) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        const body = await request.json();
        contact = {
            ...contact,
            ...body,
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(contact, { status: 200 });
    }),
];
