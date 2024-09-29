import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Perfil.css'; // Asegúrate de que los estilos estén importados

const EditProfile = () => {
    const [admin, setAdmin] = useState({
        nombre: '',
        apellido: '',
        email: '',
        celular: '',
        nacimiento: '',
        foto: '', // Aquí viene la URL de la imagen
    });
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // Indicador de carga
    const authToken = Cookies.get('authToken');

    useEffect(() => {
        const fetchAdminData = async () => {
            const adminData = Cookies.get('adminData');

            if (adminData) {
                try {
                    const parsedAdminData = JSON.parse(adminData);
                    setUser(parsedAdminData);

                    // Obtener datos del administrador
                    const response = await axios.get(`http://localhost:3001/api/administradores/${parsedAdminData._id}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    setAdmin(response.data); // Asignar los datos del administrador obtenidos
                } catch (error) {
                    console.error('Error al obtener los datos del administrador:', error);
                }
            }

            setLoading(false); // Finalizar la carga
        };

        fetchAdminData();
    }, [authToken]);

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        console.log(admin);
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:3001/api/administradores/${user._id}`, admin, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                   
                },
            });
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            alert('Error al actualizar el perfil');
        }
    };

    const renderProfileImage = () => {
        if (admin.foto) {
            return <img src={admin.foto} alt="Foto de perfil" className="profile-imageI" />;
        } else {
            // Mostrar las iniciales si no hay imagen
            const initials = `${admin.nombre.charAt(0)}${admin.apellido.charAt(0)}`;
            return (
                <div className="profile-initials">
                    <span>{initials.toUpperCase()}</span>
                </div>
            );
        }
    };

    if (loading) {
        return <div>Cargando...</div>; // Mostrar mientras se cargan los datos
    }

    return (
        <div className="profile-container">

            <form className='contendor' onSubmit={handleSubmit}>
                {renderProfileImage()}
                <h1>Perfil de Usuario</h1>
                <input className='entrada'
                    type="text"
                    name="nombre"
                    value={admin.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                />
                <input className='entrada'
                    type="text"
                    name="apellido"
                    value={admin.apellido}
                    onChange={handleChange}
                    placeholder="Apellido"
                />
                <input className='entrada'
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input className='entrada'
                    type="text"
                    name="celular"
                    value={admin.celular}
                    onChange={handleChange}
                    placeholder="Celular"
                />
                <input className='entrada'
                    type="date"
                    name="nacimiento"
                    value={admin.nacimiento.split('T')[0]}
                    onChange={handleChange}
                />
                <input className='entrada'
                    type="text"
                    name="foto"
                    value={admin.foto}
                    onChange={handleChange}
                    placeholder="URL de la foto"
                />
                <button className='bton' type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default EditProfile;
