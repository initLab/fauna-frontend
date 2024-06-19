import Dashboard from './pages/Dashboard';
import NavBar from './layout/NavBar';
import Footer from './layout/Footer';
import { Route, Routes } from 'react-router-dom';
import Sensors from './pages/Sensors';
import Doors from './pages/Doors.jsx';
import { Container } from 'react-bootstrap';
import ActionLog from './pages/ActionLog.jsx';
import Lights from './pages/Lights.jsx';
import { useVariant } from './hooks/useVariant.js';
import { useEffect } from 'react';
import { useGetUserInfoQuery } from './features/apiSlice.js';
import i18n from './i18n.js';

function App() {
    const variant = useVariant();

    useEffect(() => {
        if (variant === 'colibri') {
            document.title = 'Casa Libri';
        }
    }, [variant]);

    const {
        data: user,
    } = useGetUserInfoQuery();

    useEffect(function() {
        if (user?.locale) {
            (async () => {
                await i18n.changeLanguage(user.locale);
            })();
        }
    }, [user?.locale]);

    return (<>
        <NavBar />
        <main>
            <Container as="section" className="mt-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/doors" element={<Doors />} />
                    <Route path="/lights" element={<Lights />} />
                    <Route path="/sensors" element={<Sensors />} />
                    <Route path="/action-log" element={<ActionLog />} />
                </Routes>
            </Container>
        </main>
        <Footer />
    </>);
}

export default App;
