import React, { useEffect, useState } from 'react';
import { getParroquias, createParroquia, deleteParroquia, updateParroquia } from '../../services/parroquiaService';
import ParroquiaForm from './ParroquiaForm';
import ParroquiaItem from './ParroquiaeItem';
import '../../css/ParroquiaList.css';
import Swal from 'sweetalert2';

const ParroquiaList = () => {
    const [parroquias, setParroquias] = useState([]);
    const [selectedParroquia, setSelectedParroquia] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro de búsqueda

    useEffect(() => {
        const fetchParroquias = async () => {
            const data = await getParroquias();
            setParroquias(data);
        };

        fetchParroquias();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteParroquia(id);
            setParroquias(parroquias.filter((p) => p._id !== id));
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
            const updatedParroquia = await updateParroquia(selectedParroquia._id, data);
            setParroquias(parroquias.map((p) => (p._id === selectedParroquia._id ? updatedParroquia : p)));
        } else {
            const nuevaParroquia = await createParroquia(data);
            setParroquias([...parroquias, nuevaParroquia]);
        }
        setSelectedParroquia(null);
    };

    // Filtrar parroquias basado en el término de búsqueda
    const filteredParroquias = parroquias.filter((parroquia) =>
        parroquia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="parroquia-list">
            <h2 className='tituloParroquia'>Lista de Parroquias</h2>
            
            {/* Campo de búsqueda */}
           
            
            <ParroquiaForm onSubmit={handleFormSubmit} parroquia={selectedParroquia} />
            <input 
                type="text"
                placeholder="Buscar parroquias"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="busqueda-parroquia"
            />
            <ul className='lista-parroquia'>
                {filteredParroquias.length > 0 ? (
                    filteredParroquias.map((p) => (
                        <ParroquiaItem
                            key={p._id}
                            parroquia={p}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <li>No se encontraron parroquias</li>
                )}
            </ul>
            
        </div>
    );
};

export default ParroquiaList;
