import React, { useState, useEffect } from 'react';
import { getDioesis } from '../../services/diocesisService'; // Asegúrate de tener un servicio para obtener las diócesis
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '../../css/ParroquiaList.css';
const ParroquiaForm = ({ onSubmit, parroquia }) => {
    const [nombre, setNombre] = useState('');
    const [dioesisId, setDioesisId] = useState('');
    const [dioesisList, setDioesisList] = useState([]);
   

    useEffect(() => {
        const fetchDioesis = async () => {
            const data = await getDioesis(); // Obtener la lista de diócesis
            setDioesisList(data);
        };

        fetchDioesis();
    }, []);

    useEffect(() => {
        if (parroquia) {
            setNombre(parroquia.nombre);
            setDioesisId(parroquia.dioesis._id); // Asignar el ID de la diócesis seleccionada
        } else {
            setNombre('');
            setDioesisId('');
        }
    }, [parroquia]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, dioesis: dioesisId }); // Incluir la diócesis en los datos enviados
        // Mostrar alerta de éxito
        Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'La parroquia se ha registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        
        setNombre(''); // Limpiar campos
        setDioesisId(''); // Limpiar campos
    };
    
    return (
       
        <form onSubmit={handleSubmit}>
            <input className='textoParroquia'
                type="text"
                placeholder="Nombre de la Parroquia"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <select className='selectParroquia'
                value={dioesisId}
                onChange={(e) => setDioesisId(e.target.value)}
                required
            >
                <option value="">Selecciona una Diócesis</option>
                {dioesisList.map((dioesis) => (
                    <option key={dioesis._id} value={dioesis._id}>
                        {dioesis.nombre}
                    </option>
                ))}
            </select>
            <button className='selectParroquia'  type="submit">{parroquia ? 'Actualizar' : 'Crear'}</button>
        </form>
         
     
    );
};

export default ParroquiaForm;
