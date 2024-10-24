import React, { useEffect, useState } from 'react';
import { listarComunidades } from '../../services/comunidadService';
import ComunidadForm from '../Comunidades/ComunidadForm';
import AgregarMiembroForm from '../Comunidades/AgregarMiembroForm';
import ComunidadDetalle from '../Comunidades/ComunidadDetalle';
import Modal from '../Modal/Modal';
import '../../css/ComunidadList.css';

const ComunidadList = ({ token, userId }) => {
    const [comunidades, setComunidades] = useState([]);
    const [selectedComunidad, setSelectedComunidad] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showForm, setShowForm] = useState(false); // Controlar visibilidad del formulario de crear comunidad

    useEffect(() => {
        const fetchComunidades = async () => {
            try {
                const response = await listarComunidades(token);
                setComunidades(response.data);
            } catch (error) {
                console.log('Error al listar las comunidades');
            }
        };

        fetchComunidades();
    }, [token]);

    const ActualizacionComunidades= async()=>{
        try {
            const response = await listarComunidades(token);
            setComunidades(response.data);
        } catch (error) {
            console.log('Error al listar las comunidades');
        } 
    }

    const actualizarMiembros = async () => {
        try {
            const response = await listarComunidades(token);
            const comunidadActualizada = response.data.find(c => c._id === selectedComunidad._id);
            setSelectedComunidad(comunidadActualizada);
        } catch (error) {
            console.log('Error al actualizar la comunidad:', error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelect = (comunidad) => {
        setSelectedComunidad(comunidad);
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };
    const miembros = selectedComunidad ? selectedComunidad.administradores.map(admin => admin.administrador) : [];
   console.log(miembros)

    const comunidadesVisibles = comunidades.filter((comunidad) => {
        if (comunidad.visibilidad === 'publica') {
            return true;
        }
        const esAdmin = comunidad.administradores.some(admin => admin.administrador === userId);
        return esAdmin;
    });

    const esAdmin = selectedComunidad ? selectedComunidad.administradores.some(admin => String(admin.administrador) === userId) : false;
   
    return (
        <div className="comunidad-list">
            <div className="contenedorCrearComunidad">
                <button className="toggle-form-button" onClick={toggleForm}>
                    {showForm ? 'Cerrar Formulario' : 'Crear Comunidad'}
                </button>
                {showForm && <ComunidadForm token={token} actualizarComunidad= {ActualizacionComunidades} />}
            </div>

            <h2 className="titulo-comunidad">Lista de Comunidades</h2>
            <ul className="lista-comunidad">
                {comunidadesVisibles.map((comunidad) => (
                    <li className="lista-comunidad-li" key={comunidad._id} onClick={() => handleSelect(comunidad)}>
                        <div className="comunidad-card">
                            <h3>{comunidad.nombre}</h3>
                            <p>{comunidad.descripcion}</p>
                            <span className={`comunidad-tipo ${comunidad.visibilidad}`}>
                                {comunidad.visibilidad === 'publica' ? 'Pública' : 'Privada'}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedComunidad && (
                <div>
                    <ComunidadDetalle comunidad={selectedComunidad} onAgregarMiembro={esAdmin ? handleOpenModal : null} />
                    {esAdmin && (
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            <AgregarMiembroForm 
                             token={token}
                             comunidadId={selectedComunidad?._id} 
                             esAdmin={esAdmin}
                             Iduser={userId} 
                             esPublica={selectedComunidad?.visibilidad === 'publica'}
                             miembros={ miembros}
                             actualizarMiembros={actualizarMiembros}
                              />
                        </Modal>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComunidadList;
