import React, { useEffect, useState } from 'react';
import { getParroquias, createParroquia, deleteParroquia, updateParroquia } from '../../services/parroquiaService';
import ParroquiaForm from './ParroquiaForm';
import ParroquiaItem from './ParroquiaeItem';
import '../../css/ParroquiaList.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const ParroquiaList = () => {
    const [parroquias, setParroquias] = useState([]);
    const [selectedParroquia, setSelectedParroquia] = useState(null);

    useEffect(() => {
        const fetchParroquias = async () => {
            const data = await getParroquias();
            setParroquias(data);
        };

        fetchParroquias();
    }, []);

    const handleDelete = async (id) => {
        // Mostrar alerta de confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Si se confirma, eliminar la parroquia
            await deleteParroquia(id);
            setParroquias(parroquias.filter((p) => p._id !== id));

            // Mostrar alerta de éxito
            Swal.fire({
                title: '¡Eliminado!',
                text: 'La parroquia ha sido eliminada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    const handleEdit = (parroquia) => {
        setSelectedParroquia(parroquia);
    };

    const handleFormSubmit = async (data) => {
        if (selectedParroquia) {
            // Actualizar
            const updatedParroquia = await updateParroquia(selectedParroquia._id, data);
            setParroquias(parroquias.map((p) => (p._id === selectedParroquia._id ? updatedParroquia : p)));
        } else {
            // Crear nueva
            const nuevaParroquia = await createParroquia(data);
            setParroquias([...parroquias, nuevaParroquia]);
        }
        setSelectedParroquia(null); // Reiniciar formulario
    };

    return (
        <div className="parroquia-list">
            <h2>Lista de Parroquias</h2>
            <ParroquiaForm onSubmit={handleFormSubmit} parroquia={selectedParroquia} />
            <ul className='lista-parroquia'>
                {parroquias.map((p) => (
                    <ParroquiaItem
                        key={p._id}
                        parroquia={p}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ParroquiaList;
