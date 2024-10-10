import React from 'react';
import '../../css/ArchdioceseItem.css'; // Importar el archivo de estilos

const ArchdioceseItem = ({ archdiocese, onDelete, onEdit }) => {
    return (
        <li className="archdiocese-item">
            <div className="archdiocese-content">
                <h3 className="archdiocese-name">{archdiocese.nombre}</h3>
                <p className="archdiocese-archbishop">Arzobispo: {archdiocese.arzobispo}</p>
            </div>
            <div className="archdiocese-actions">
                <button className="edit-btn" onClick={() => onEdit(archdiocese)}>Editar</button>
                <button className="delete-btn" onClick={() => onDelete(archdiocese._id)}>Eliminar</button>
            </div>
        </li>
    );
};

export default ArchdioceseItem;
