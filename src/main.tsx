import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RootStore, StoresProvider } from './stores';
import './index.css'
import App from './App.tsx'

async function prepare() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
    }
}

const rootStore = new RootStore();

prepare().then(() => {
    const rootStore = new RootStore();

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <StoresProvider value={rootStore}>
                <App />
            </StoresProvider>
        </StrictMode>
    )
});
