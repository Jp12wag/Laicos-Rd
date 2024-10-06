import React, { useEffect, useState } from 'react';
import { getArchdioceses, deleteArchdiocese, updateArchdiocese, createArchdiocese } from '../../services/archdioceseService';
import ArchdioceseItem from './ArchdioceseItem';
import ArchdioceseForm from './ArchdioceseForm';
import '../../css/ArchdioceseList.css'; // Importar el archivo de estilos

const ArchdioceseList = () => {
    const [archdioceses, setArchdioceses] = useState([]);
    const [selectedArchdiocese, setSelectedArchdiocese] = useState(null);

    useEffect(() => {
        const fetchArchdioceses = async () => {
            const data = await getArchdioceses();
            setArchdioceses(data);
        };

        fetchArchdioceses();
    }, []);

    const handleDelete = async (id) => {
        await deleteArchdiocese(id);
        setArchdioceses(archdioceses.filter((a) => a._id !== id));
    };

    const handleEdit = (archdiocese) => {
        setSelectedArchdiocese(archdiocese);
    };

    const handleFormSubmit = async (data) => {
        if (selectedArchdiocese) {
            // Actualizar existente
            await updateArchdiocese(selectedArchdiocese._id, data);
            setArchdioceses(archdioceses.map((a) => (a._id === selectedArchdiocese._id ? data : a)));
        } else {
            // Crear nueva
            const newArchdiocese = await createArchdiocese(data);
            setArchdioceses([...archdioceses, newArchdiocese]);
        }
        setSelectedArchdiocese(null); // Resetear formulario
    };

    return (
        <div className="archdiocese-list-container">
            <h2>Lista de Arquidiócesis</h2>
            <ArchdioceseForm onSubmit={handleFormSubmit} archdiocese={selectedArchdiocese} />
            <ul className="archdiocese-list">
                {archdioceses.map((archdiocese) => (
                    <ArchdioceseItem
                        key={archdiocese._id}
                        archdiocese={archdiocese}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ArchdioceseList;
