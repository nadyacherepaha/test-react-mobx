import { createContext, useContext } from 'react';
import { AuthStore } from './auth.store';
import { CompanyStore } from './company.store';
import { ContactStore } from './contact.store';
import { COMPANY_ID, CONTACT_ID } from '../config';

export class RootStore {
    auth = new AuthStore();
    company = new CompanyStore(COMPANY_ID);
    contact = new ContactStore(CONTACT_ID);
}

const Ctx = createContext<RootStore>(new RootStore());
export const StoresProvider = Ctx.Provider;
export const useStores = () => useContext(Ctx);
