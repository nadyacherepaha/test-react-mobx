export type CompanyType = 'funeral_home' | 'logistics_services' | 'burial_care_contractor';

export type CompanyPhoto = {
    name: string;
    filepath: string;
    thumbpath: string;
    createdAt: string;
};

export interface Company {
    id: string;
    contactId: string;
    name: string;
    shortName: string;
    businessEntity: string;
    contract: {
        no: string;
        issue_date: string;
    };
    type: CompanyType[];
    status: string;
    photos: CompanyPhoto[];
    createdAt: string;
    updatedAt: string;
}
