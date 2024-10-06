import React, { useState, useEffect } from 'react';
import '../../css/ArchdioceseForm.css'; // Importar el archivo de estilos

const ArchdioceseForm = ({ onSubmit, archdiocese }) => {
    const [nombre, setName] = useState('');
    const [arzobispo, setArchbishop] = useState('');

    useEffect(() => {
        if (archdiocese) {
            setName(archdiocese.nombre);
            setArchbishop(archdiocese.arzobispo);
        } else {
            setName('');
            setArchbishop('');
        }
    }, [archdiocese]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, arzobispo });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nombre">Nombre de la Arquidiócesis</label>
                <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre de la Arquidiócesis"
                    value={nombre}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="arzobispo">Arzobispo</label>
                <input
                    type="text"
                    id="arzobispo"
                    placeholder="Arzobispo"
                    value={arzobispo}
                    onChange={(e) => setArchbishop(e.target.value)}
                    required
                />
            </div>

            <button type="submit">{archdiocese ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default ArchdioceseForm;
