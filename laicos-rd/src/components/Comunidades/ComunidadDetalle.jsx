// ComunidadDetalle.js
import React from 'react';
import '../../css/ComunidadDetalle.css'; // Asegúrate de tener el archivo CSS

const ComunidadDetalle = ({ comunidad, onAgregarMiembro }) => {
    return (
        <div className="comunidad-detalle">
            <h3 className="comunidad-nombre">{comunidad.nombre}</h3>
            <p className="comunidad-descripcion">{comunidad.descripcion}</p>
            <h4 className="canales-titulo">Canales:</h4>
            <ul className="canales-lista">
                {comunidad.canales.map((canal) => (
                    <li key={canal._id} className="canal-item">{canal.nombre}</li>
                ))}
            </ul>
            <button className="btn-agregar-miembro" onClick={onAgregarMiembro}>
                Agregar Miembro
            </button>
        </div>
    );
};

export default ComunidadDetalle;
