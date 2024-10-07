import React, { useEffect, useState } from 'react';
import { getSessions, logoutAllSessions, logoutSession } from '../../services/sessionsService'; // Asegúrate de tener un servicio para cerrar sesiones individuales
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import UAParser from 'ua-parser-js';
import '../../css/SessionsList.css'; // Archivo CSS para estilos

const SessionsList = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const clearCookies = () => {
        Cookies.remove('authToken');
        Cookies.remove('userRole');
        Cookies.remove('twoFactorVerified');
        Cookies.remove('IdUser');
    };

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const sessionsData = await getSessions();
                setSessions(sessionsData);
            } catch (error) {
                console.error('Error al obtener sesiones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleLogoutAll = async () => {
        try {
            await logoutAllSessions();
            setSessions([]); // Limpiar la lista de sesiones después de cerrar
            alert('Todas las sesiones han sido cerradas');
            clearCookies();
            navigate('/Login');
        } catch (error) {
            console.error('Error al cerrar todas las sesiones:', error);
        }
    };

    const handleLogoutSession = async (token) => {
        try {
            await logoutSession(token); // Cierra una sesión específica
            setSessions(sessions.filter(session => session.token !== token)); // Remueve la sesión cerrada de la lista
            alert('Sesión cerrada correctamente');
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
        }
    };

    if (loading) {
        return <div>Cargando sesiones...</div>;
    }

    return (
        <div className="sessions-container">
            <h2>Sesiones Iniciadas</h2>
            <ul className="sessions-list">
                {sessions.length > 0 ? (
                    sessions.map((session, index) => {
                        const parser = new UAParser(session.userAgent);
                        const device = parser.getDevice();
                        const browser = parser.getBrowser();
                        const os = parser.getOS();

                        return (
                            <li key={index} className="session-item">
                                <p><strong>Dispositivo:</strong> {device.model ? `${device.vendor} ${device.model}` : 'Desconocido'}</p>
                                <p><strong>Navegador:</strong> {browser.name} {browser.version}</p>
                                <button 
                                    className="logout-session-button"
                                    onClick={() => handleLogoutSession(session.token)}>
                                    Cerrar sesión
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li>No hay sesiones activas.</li>
                )}
            </ul>
            <button className="logout-all-button" onClick={handleLogoutAll}>
                Cerrar todas las sesiones
            </button>
        </div>
    );
};

export default SessionsList;
