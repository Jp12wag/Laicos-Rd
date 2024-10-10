import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Perfil.css';
import { useNavigate } from 'react-router-dom';
import { getParroquiasByDiocesis } from '../services/parroquiaService'; // Importar servicio


const EditProfile = () => {
    const [admin, setAdmin] = useState({
        nombre: '',
        apellido: '',
        email: '',
        celular: '',
        sexo: '',
        nacimiento: '',
        foto: '',
    });
    const [miembro, setMiembro] = useState({
        direccion: '',
        estadoCivil: '',
        cargo: '',
        nacionalidad: '',
        Parroquia: '', // ID de la parroquia
    });
    const [diocesis, setDiocesis] = useState([]);
    const [parroquias, setParroquias] = useState([]);
    const [selectedDiocesis, setSelectedDiocesis] = useState('');
    const [loading, setLoading] = useState(true);
    const authToken = Cookies.get('authToken');
    const userId = Cookies.get('IdUser');
    const userRole = Cookies.get('userRole');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (userId) {
                try {
                    // Obtener datos del administrador
                    const adminResponse = await axios.get(`http://localhost:3001/api/administradores/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    setAdmin(adminResponse.data);

                    // Obtener datos del miembro asociado al administrador
                    const miembroResponse = await axios.get(`http://localhost:3001/api/miembros/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    if (miembroResponse.data) {
                        setMiembro(miembroResponse.data);
                        // Asignar la diócesis y parroquia correspondientes
                        setSelectedDiocesis(miembroResponse.data.Parroquia?.diocesis || '');
                       
                    }
                    
                    // Obtener diócesis
                    const diocesisResponse = await axios.get('http://localhost:3001/api/diocesis', {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    setDiocesis(diocesisResponse.data);
                    console.log(miembroResponse.data.Parroquia?.diocesis);
                    // Obtener parroquias de la diócesis del miembro
                    if (miembroResponse.data.Parroquia) {
                        const parroquiasData = await getParroquiasByDiocesis(miembroResponse.data.Parroquia.diocesis);
                        setParroquias(parroquiasData);
                    }

                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                }
            } else {
                console.error('No se encontró el ID de usuario en las cookies.');
            }
            setLoading(false);
        };

        fetchProfileData();
    }, [userId]);

    // Manejadores de cambio para admin y miembro
    const handleAdminChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleMiembroChange = (e) => {
        setMiembro({ ...miembro, [e.target.name]: e.target.value });
    };

    // Manejador de cambio para la selección de diócesis
    const handleDiocesisChange = async (e) => {
        const selectedDiocesisId = e.target.value;
        setSelectedDiocesis(selectedDiocesisId);

        // Obtener las parroquias de la diócesis seleccionada
        if (selectedDiocesisId) {
            try {
                const parroquiasData = await getParroquiasByDiocesis(selectedDiocesisId);
                setParroquias(parroquiasData);
                // Resetear la parroquia seleccionada si la diócesis cambia
                setMiembro({ ...miembro, Parroquia: '' }); // Limpiar la parroquia si se cambia la diócesis
            } catch (error) {
                console.error('Error al obtener las parroquias:', error);
            }
        } else {
            setParroquias([]); // Resetear parroquias si no hay diócesis seleccionada
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Actualizar los datos del administrador
            await axios.patch(`http://localhost:3001/api/administradores/${admin._id}`, admin, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });
    
            if (miembro._id) {
                // Si el miembro ya existe, actualiza los datos
                await axios.patch(`http://localhost:3001/api/miembros/${miembro._id}`, miembro, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                });
            } else {
                // Si el miembro no existe, crea uno nuevo
                await axios.post(`http://localhost:3001/api/miembros`, { ...miembro, _id: admin._id }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                });
            }
    
            alert('Perfil actualizado correctamente');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            alert('Error al actualizar el perfil');
        }
    };

    const renderProfileImage = () => {
        if (admin.foto) {
            return <img src={admin.foto} alt="Foto de perfil" className="profile-image" />;
        } else {
            const initials = `${admin.nombre.charAt(0)}${admin.apellido.charAt(0)}`;
            return (
                <div className="profile-initials">
                    <span>{initials.toUpperCase()}</span>
                </div>
            );
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    const handleViewSessions = () => {
        // Lógica para ver todas las sesiones iniciadas
        navigate('/sessions');
        console.log("Ver todas las sesiones iniciadas");
    };



    return (
        <div className="profile-container">
            <h1>Perfil</h1>
            {renderProfileImage()}
            <div className="contendor">
             <h2> {userRole }  </h2>
                <div className="section">
                    <form onSubmit={handleSubmit}>
                        <input
                            className="entrada"
                            type="text"
                            name="nombre"
                            value={admin.nombre}
                            onChange={handleAdminChange}
                            placeholder="Nombre"
                        />
                        <input
                            className="entrada"
                            type="text"
                            name="apellido"
                            value={admin.apellido}
                            onChange={handleAdminChange}
                            placeholder="Apellido"
                        />
                        <input
                            className="entrada"
                            type="email"
                            name="email"
                            value={admin.email}
                            onChange={handleAdminChange}
                            placeholder="Email"
                        />
                        <input
                            className="entrada"
                            type="tel"
                            name="celular"
                            value={admin.celular}
                            onChange={handleAdminChange}
                            placeholder="Celular"
                        />
                        <input
                            className="entrada"
                            type="date"
                            name="nacimiento"
                            value={admin.nacimiento || ''}
                            onChange={handleAdminChange}
                        />
                        <select className="entrada" name="sexo" value={admin.sexo} onChange={handleAdminChange}>
                            <option value="">Seleccione sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <button className="bton" type="submit">Guardar</button>
                    </form>
                </div>
                <div className="section">
                    <h2>Miembro</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="entrada"
                            type="text"
                            name="direccion"
                            value={miembro.direccion}
                            onChange={handleMiembroChange}
                            placeholder="Dirección"
                        />
                        <input
                            className="entrada"
                            type="text"
                            name="estadoCivil"
                            value={miembro.estadoCivil}
                            onChange={handleMiembroChange}
                            placeholder="Estado Civil"
                        />
                        <input
                            className="entrada"
                            type="text"
                            name="cargo"
                            value={miembro.cargo}
                            onChange={handleMiembroChange}
                            placeholder="Cargo"
                        />
                        <input
                            className="entrada"
                            type="text"
                            name="nacionalidad"
                            value={miembro.nacionalidad}
                            onChange={handleMiembroChange}
                            placeholder="Nacionalidad"
                        />
                        <select className="entrada" value={selectedDiocesis} onChange={handleDiocesisChange}>
                            <option value="">Seleccione una diócesis</option>
                            {diocesis.map(d => (
                                <option key={d._id} value={d._id}>{d.nombre}</option>
                            ))}
                        </select>
                        <select className="entrada" value={miembro.Parroquia} onChange={handleMiembroChange} name="Parroquia">
                            <option value="">Seleccione una parroquia</option>
                            {parroquias.map(p => (
                                <option key={p._id} value={p._id}>{p.nombre}</option>
                            ))}
                        </select>
                        <button className="bton" type="submit">Guardar</button>
                    </form>
                </div>
                <div className="section">
                    <h2>Sesiones Iniciadas</h2>
                    <button className="bton bton-rojo" onClick={handleViewSessions}>Ver todas las sesiones iniciadas</button>
                  
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
