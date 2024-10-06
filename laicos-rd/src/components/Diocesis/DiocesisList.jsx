import React, { useEffect, useState } from 'react';
import dioesisService from '../../services/diocesisService';
import DioesisForm from './DiocesisForm';
import DioesisItem from './DiocesisItem';
import '../../css/dioesis.css'


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
    } else {
      await dioesisService.createDioesis(dioesisData);
    }
    fetchDioesis();
    setSelectedDioesis(null);
  };

  const handleEdit = (dioesis) => {
    setSelectedDioesis(dioesis);
  };

  const handleDelete = async (id) => {
    await dioesisService.deleteDioesis(id);
    fetchDioesis();
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
