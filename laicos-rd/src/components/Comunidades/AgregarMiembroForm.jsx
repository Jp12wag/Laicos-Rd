import React, { useState, useEffect } from 'react';
import { agregarMiembro } from '../../services/comunidadService';

const AgregarMiembroForm = ({ token, comunidadId, esAdmin, Iduser, esPublica, miembros, actualizarMiembros }) => {
    const [administradorId, setAdministradorId] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [administradores, setAdministradores] = useState([]);
    const [buscarAdmin, setBuscarAdmin] = useState(''); // Estado para búsqueda
    const [rol] = useState('miembro'); // Rol fijo como 'miembro'

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Si la comunidad es pública
            if (esPublica) {
                const creadorYaMiembro = miembros.includes(Iduser);
                if (creadorYaMiembro) {
                    setMensaje('No puedes añadirte a ti mismo. Ya eres miembro de esta comunidad.');
                    return;
                }
                await agregarMiembro({ comunidadId, administradorId: Iduser, rol }, token);
                setMensaje('Te has añadido correctamente a la comunidad');
            } else {
                if (miembros.includes(administradorId)) {
                    setMensaje('Este miembro ya está registrado en la comunidad.');
                    return;
                }
                await agregarMiembro({ comunidadId, administradorId, rol }, token);
                setMensaje('Miembro agregado correctamente');
            }

            setAdministradorId('');

            if (actualizarMiembros) {
                actualizarMiembros(); // Actualiza la lista de miembros
            }

        } catch (error) {
            setMensaje('Error al agregar miembro');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const obtenerAdministradores = async () => {
            if (!esPublica && esAdmin) {
                try {
                    const response = await fetch('http://localhost:3001/api/administradores', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const data = await response.json(); 
                    setAdministradores(data);
                } catch (error) {
                    setMensaje('Error al obtener administradores');
                    console.error('Error al obtener administradores:', error);
                }
            }
        };

        obtenerAdministradores();
    }, [esAdmin, esPublica, token]);

    // Si el usuario no es administrador y no es una comunidad pública, no se debe mostrar el formulario
    if (!esAdmin && !esPublica) {
        return <p>No tienes permisos para agregar miembros a esta comunidad.</p>;
    }

    // Filtra los administradores en función de la búsqueda y si ya están registrados
    const administradoresFiltrados = administradores
        .filter((admin) => !(miembros?.includes(admin._id))) // Excluir los miembros ya inscritos
        .filter((admin) => 
            admin.nombre.toLowerCase().includes(buscarAdmin.toLowerCase()) || 
            admin.email.toLowerCase().includes(buscarAdmin.toLowerCase()) // Filtrar por nombre o email
        );

    return (
        <form onSubmit={handleSubmit}>
            <h2>{esPublica ? 'Añadirte a la Comunidad' : 'Agregar Miembro'}</h2>
            {esPublica && (
                <>
                    <p>Como esta comunidad es pública, puedes añadirte como miembro.</p>
                    {miembros.includes(Iduser) && <p>Ya eres miembro de esta comunidad.</p>}
                </>
            )}

            {!esPublica && (
                <>
                    <label>Buscar Miembro</label>
                    <input
                        type="text"
                        value={buscarAdmin}
                        onChange={(e) => setBuscarAdmin(e.target.value)}
                        placeholder="Buscar por nombre o email"
                    />
                    
                    <label>Seleccionar Miembro</label>
                    <select
                        value={administradorId}
                        onChange={(e) => setAdministradorId(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un Miembro</option>
                        {administradoresFiltrados.map((admin) => (
                            <option key={admin._id} value={admin._id}>
                                {admin.nombre} ({admin.email})
                            </option>
                        ))}
                    </select>
                </>
            )}

            <button type="submit" disabled={esPublica && miembros.includes(Iduser)}>
                {esPublica ? 'Añadirme' : 'Agregar Miembro'}
            </button>
            {mensaje && <p>{mensaje}</p>}
        </form>
    );
};

export default AgregarMiembroForm;
