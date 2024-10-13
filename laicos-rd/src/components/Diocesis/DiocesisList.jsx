import React, { useEffect, useState } from 'react';
import dioesisService from '../../services/diocesisService';
import DioesisForm from './DiocesisForm';
import DioesisItem from './DiocesisItem';
import '../../css/dioesis.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2


const DioesisList = () => {
  const [dioesis, setDioesis] = useState([]);
  const [selectedDioesis, setSelectedDioesis] = useState(null);

  const fetchDioesis = async () => {
    const data = await dioesisService.getDioesis();
    setDioesis(data);
  };

  const handleCreateOrUpdate = async (dioesisData) => {
    if (selectedDioesis) {
      await dioesisService.updateDioesis(selectedDioesis._id, dioesisData);
      Swal.fire({
        title: '¡Actualizado!',
        text: 'La diócesis ha sido actualizada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-confirm'
        }
      });
    } else {
      await dioesisService.createDioesis(dioesisData);
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'La diócesis ha sido registrada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-confirm'
        }
      });
    }
    fetchDioesis();
    setSelectedDioesis(null);
  };

  const handleEdit = (dioesis) => {
    setSelectedDioesis(dioesis);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      }
    });

    if (result.isConfirmed) {
      await dioesisService.deleteDioesis(id);
      fetchDioesis();
      Swal.fire({
        title: '¡Eliminado!',
        text: 'La diócesis ha sido eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-confirm'
        }
      });
    }
  };

  useEffect(() => {
    fetchDioesis();
  }, []);

  return (
    <div className="dioesis-list">
      <h2>Lista de Diócesis</h2>
      <DioesisForm
        selectedDioesis={selectedDioesis}
        onFormSubmit={handleCreateOrUpdate}
        onCancel={() => setSelectedDioesis(null)}
      />
      <div className="dioesis-items">
        {dioesis.map((dioesis) => (
          <DioesisItem
            key={dioesis._id}
            dioesis={dioesis}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default DioesisList;
