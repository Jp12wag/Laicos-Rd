
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const ActividadDetalle = () => {

  const { id } = useParams(); // Obtén el ID de la actividad de los parámetros de la URL
  const [actividad, setActividad] = useState(null);
  const [error, setError] = useState(null);
  const authToken = Cookies.get('authToken');
  const userId = Cookies.get('IdUser');
  const isInscrito = (actividad) => {
    return actividad.inscritos.some(inscrito => inscrito === userId);
  };
  useEffect(() => {

    const obtenerActividad = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/actividades/actividades/${id}`);
        setActividad(response.data);
      } catch (error) {
        setError('Error al obtener la actividad');
      }
    };


    obtenerActividad();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!actividad) {
    return <p>Cargando detalles de la actividad...</p>;
  }

  const handleInscribirse = async (idActividad) => {
    try {
      await axios.post(`http://localhost:3001/api/actividades/${idActividad}/inscribir`, {
        miembroId: userId, // El ID del miembro que se inscribe
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      Swal.fire('Éxito', 'Te has inscrito en la actividad.', 'success');
      // Refrescar la lista de actividades si es necesario
      const response = await axios.get('http://localhost:3001/api/actividades', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    } catch (error) {
      Swal.fire('Error', 'No se pudo inscribir en la actividad.', 'error');
    }

  };



  const handleCancelarInscripcion = async (idActividad) => {

    try {
      await axios.post(`http://localhost:3001/api/actividades/${idActividad}/cancelar-inscripcion`, {
        miembroId: userId, // El ID del miembro que se desinscribe
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Añadir el token de autenticación en los headers
        },
      });

      Swal.fire('Éxito', 'Te has desinscrito de la actividad.', 'success');

      // Actualizar la lista de actividades
      const response = await axios.get('http://localhost:3001/api/actividades', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo desinscribir de la actividad.', 'error');
    }
  };

  return (
    <div>
      <h1>Detalles de la Actividad: {actividad.nombre}</h1>
      <p>Descripción: {actividad.descripcion}</p>
      <p className="actividad-fecha">Fecha: {new Date(actividad.fecha).toISOString().split('T')[0]}</p>
      <p className="actividad-estado">Estado: {actividad.estado}</p>
      <p className="actividad-ubicacion">Lugar: {actividad.ubicacion}</p>
      <p className="actividad-participantes">Inscritos: {actividad.inscritos.length} / {actividad.maxParticipantes}</p>
      {!isInscrito(actividad) ? (
        <button
          className="btn-inscribir"
          onClick={() => handleInscribirse(actividad._id)}
          disabled={actividad.inscritos.length >= actividad.maxParticipantes}
        >
          Inscribirse
        </button>
      ) : (
        <button
          className="btn-cancelar-inscripcion"
          onClick={() => handleCancelarInscripcion(actividad._id)}
        >
          Cancelar Inscripción
        </button>

      )}

    </div>
  );
};

export default ActividadDetalle;
