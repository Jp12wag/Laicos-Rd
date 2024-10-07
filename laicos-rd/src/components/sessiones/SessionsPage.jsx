import SessionsList from './SessionsList';
import SessionsForm from './SessionsForm';

const SessionsPage = () => {
    const handleSessionSubmit = (sessionInfo) => {
        // Lógica para agregar una nueva sesión (puedes implementar esta función en el servicio)
        console.log('Nueva sesión:', sessionInfo);
    };

    return (
        <div>
            <h1>Gestión de Sesiones</h1>
            <SessionsList />
        </div>
    );
};

export default SessionsPage;
