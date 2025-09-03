import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from './stores';
import './styles/base.scss';

const App = observer(function App() {
    const { auth, company, contact } = useStores();

    useEffect(() => {
        const run = async () => {
            if (!auth.isAuthed) await auth.login();
            await Promise.all([company.fetch(), contact.fetch()]);
        };
        run();
    }, []);

    return (
        <div className="container">
            <h1>Test Assignment</h1>

            {auth.loading && <p>Auth…</p>}
            {auth.error && <p style={{color:'#ff8080'}}>Auth error: {auth.error}</p>}

            {company.loading && <p>Loading company…</p>}
            {contact.loading && <p>Loading contact…</p>}

            {company.data && (
                <div className="card" style={{ marginTop: 12 }}>
                    <h3>Company</h3>
                    <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(company.data, null, 2)}</pre>
                </div>
            )}

            {contact.data && (
                <div className="card" style={{ marginTop: 12 }}>
                    <h3>Contact</h3>
                    <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(contact.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
});

export default App;
