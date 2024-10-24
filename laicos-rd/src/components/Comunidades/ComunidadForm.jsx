import React, { useState } from 'react';
import { crearComunidad } from '../../services/comunidadService';
import '../../css/ComunidadForm.css'; // Asegúrate de que la ruta sea correcta

const ComunidadForm = ({ token, actualizarComunidad }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [visibilidad, setVisibilidad] = useState('publica'); // Nueva opción para visibilidad
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearComunidad({ nombre, descripcion, visibilidad }, token); // Enviar visibilidad al servicio
            setMensaje('Comunidad creada exitosamente');
            actualizarComunidad();
            setNombre('');
            setDescripcion('');
            setVisibilidad('publica'); // Reiniciar a pública por defecto
        } catch (error) {
            setMensaje('Error al crear la comunidad');
        }
    };

    return (
        <form className="comunidad-form" onSubmit={handleSubmit}>
            <h2 className='titulocomunidad'>Crear Comunidad</h2>
            <label className="form-label">Nombre</label>
            <input
                className="form-input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder='Ingrese nombre de comunidad'
            />
            <label className="form-label">Descripción</label>
            <textarea
                className="form-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder='Ingrese descripcion de la comunidad'
            />
            <label className="form-label">Visibilidad</label>
            <select
                className="form-select"
                value={visibilidad}
                onChange={(e) => setVisibilidad(e.target.value)}
            >
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
            </select>
            <button type="submit" className="form-button">Crear</button>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
    );
};

export default ComunidadForm;
