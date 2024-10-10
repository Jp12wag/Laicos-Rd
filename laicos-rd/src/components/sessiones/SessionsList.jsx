import React, { useEffect, useState } from 'react';
import { getSessions, logoutAllSessions, logoutSession } from '../../services/sessionsService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import UAParser from 'ua-parser-js';
import '../../css/SessionsList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faTabletAlt, faDesktop } from '@fortawesome/free-solid-svg-icons';

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

    const formatElapsedTime = (createdAt) => {
        const creationTime = new Date(createdAt);
        const currentTime = new Date();
        const elapsedTime = currentTime - creationTime;

        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours} horas y ${minutes} minutos`;
        }
        return `${minutes} minutos`;
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'mobile':
                return <FontAwesomeIcon icon={faMobileAlt} />;
            case 'tablet':
                return <FontAwesomeIcon icon={faTabletAlt} />;
            case 'desktop':
            default:
                return <FontAwesomeIcon icon={faDesktop} />;
        }
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
            setSessions([]);
            alert('Todas las sesiones han sido cerradas');
            clearCookies();
            navigate('/Login');
        } catch (error) {
            console.error('Error al cerrar todas las sesiones:', error);
        }
    };

    const handleLogoutSession = async (token) => {
        try {
            await logoutSession(token);
            const updatedSessions = sessions.filter(session =>
                session.__parentArray.some(t => t.token !== token) // Filtra correctamente las sesiones
            );

            setSessions(updatedSessions); // Actualiza el estado con las sesiones restantes

            alert('Sesión cerrada correctamente');

            // Verificar si no quedan más sesiones
            if (updatedSessions.length === 0) {
                clearCookies(); // Limpia las cookies
                navigate('/Login'); // Redirige al login
            }
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
                    sessions.map((sessionData, index) => {
                        // Accede al primer elemento del array __parentArray para obtener el token y userAgent
                        const tokenData = sessionData.__parentArray[0]; // Accede al primer objeto del array
                        const token = tokenData.token; // Acceso al token
                        const parser = new UAParser(tokenData.userAgent); // User agent del token
                        const device = parser.getDevice();
                        const browser = parser.getBrowser();
                        const adminCreatedAt = formatElapsedTime(sessionData.createdAt); // Tiempo desde que se creó el administrador
                        const deviceIcon = getDeviceIcon(device.type);

                        return (
                            <li key={index} className="session-item">
                                <p><strong>Dispositivo:</strong> {deviceIcon} {device.model ? `${device.vendor} ${device.model}` : 'Desconocido'}</p>
                                <p><strong>Navegador:</strong> {browser.name} {browser.version}</p>
                                <p><strong>Tiempo de sesión:</strong> {adminCreatedAt}</p> {/* Mostrando cuando se creó el administrador */}
                                <button
                                    className="logout-session-button"
                                    onClick={() => handleLogoutSession(token)}> {/* Usar el token correcto */}
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
