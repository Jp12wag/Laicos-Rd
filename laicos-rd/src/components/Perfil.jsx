import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Perfil.css'; 
import { useNavigate } from 'react-router-dom';

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
        nacionalidad: ''
    });
    const [loading, setLoading] = useState(true); 
    const authToken = Cookies.get('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const userId = Cookies.get('IdUser');
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
    }, [authToken]);

    // Manejadores de cambio para admin y miembro
    const handleAdminChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleMiembroChange = (e) => {
        setMiembro({ ...miembro, [e.target.name]: e.target.value });
    };

    // Guardar tanto los datos de administrador como de miembro
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Actualizar los datos del administrador
            await axios.patch(`http://localhost:3001/api/administradores/${admin._id}`, admin, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });
console.log(miembro._id);
            // Actualizar los datos del miembro
            await axios.patch(`http://localhost:3001/api/miembros/${miembro._id || admin._id}`, miembro, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });

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

    return (
        <div className="profile-container">
            <form className='contendor' onSubmit={handleSubmit}>
                {renderProfileImage()}
                <h1>Perfil de Usuario</h1>
                
                {/* Campos del Administrador */}
                <input className='entrada'
                    type="text"
                    name="nombre"
                    value={admin.nombre}
                    onChange={handleAdminChange}
                    placeholder="Nombre"
                />
                <input className='entrada'
                    type="text"
                    name="apellido"
                    value={admin.apellido}
                    onChange={handleAdminChange}
                    placeholder="Apellido"
                />
                <div>
                    <label>
                        <input className='entrada'
                            type="radio"
                            name="sexo"
                            value="FEMENINO"
                            checked={admin.sexo === 'FEMENINO'}
                            onChange={handleAdminChange}
                        />
                        Femenino
                    </label>
                    <label>
                        <input className='entrada'
                            type="radio"
                            name="sexo"
                            value="MASCULINO"
                            checked={admin.sexo === 'MASCULINO'}
                            onChange={handleAdminChange}
                        />
                        Masculino
                    </label>
                </div>
                <input className='entrada'
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={handleAdminChange}
                    placeholder="Email"
                    disabled
                />
                <input className='entrada'
                    type="text"
                    name="celular"
                    value={admin.celular}
                    onChange={handleAdminChange}
                    placeholder="Celular"
                />
                <input className='entrada'
                    type="date"
                    name="nacimiento"
                    value={admin.nacimiento.split('T')[0]}
                    onChange={handleAdminChange}
                />
                <input className='entrada'
                    type="text"
                    name="foto"
                    value={admin.foto}
                    onChange={handleAdminChange}
                    placeholder="URL de la foto"
                />
                
                {/* Campos del Miembro */}
                <h2>Información de Miembro</h2>
                <input className='entrada'
                    type="text"
                    name="direccion"
                    value={miembro.direccion}
                    onChange={handleMiembroChange}
                    placeholder="Dirección"
                />
                <input className='entrada'
                    type="text"
                    name="estadoCivil"
                    value={miembro.estadoCivil}
                    onChange={handleMiembroChange}
                    placeholder="Estado Civil"
                />
                <input className='entrada'
                    type="text"
                    name="cargo"
                    value={miembro.cargo}
                    onChange={handleMiembroChange}
                    placeholder="Cargo"
                />
                <input className='entrada'
                    type="text"
                    name="nacionalidad"
                    value={miembro.nacionalidad}
                    onChange={handleMiembroChange}
                    placeholder="Nacionalidad"
                />

                <button className='bton' type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default EditProfile;
