import React, { useState } from 'react';

const ShareThought = ({ setThoughts }) => {
  const [thought, setThought] = useState('');

  const handleShare = () => {
    if (thought) {
      setThoughts(prev => [...prev, thought]); // Añadir el nuevo pensamiento
      setThought(''); // Limpiar el campo de entrada
    }
  };

  return (
    <div className="share-thought">
      <input
        type="text"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="¿Qué estás pensando?"
      />
      <button onClick={handleShare}>Compartir</button>
    </div>
  );
};

export default ShareThought;
