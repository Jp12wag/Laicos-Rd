import React, { useEffect, useState } from 'react';
import { getParroquias, createParroquia, deleteParroquia, updateParroquia } from '../../services/parroquiaService';
import ParroquiaForm from './ParroquiaForm';
import ParroquiaItem from './ParroquiaeItem';

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
        await deleteParroquia(id);
        setParroquias(parroquias.filter((p) => p._id !== id));
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
        <div>
            <h2>Lista de Parroquias</h2>
            <ParroquiaForm onSubmit={handleFormSubmit} parroquia={selectedParroquia} />
            <ul>
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
