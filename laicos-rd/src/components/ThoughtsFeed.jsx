import React from 'react';

const ThoughtsFeed = ({ thoughts }) => {
  return (
    <div className="thoughts-feed">
      <h2>Pensamientos Compartidos</h2>
      <ul>
        {thoughts.map((thought, index) => (
          <li key={index} className="thought-item">{thought}</li>
        ))}
      </ul>
    </div>
  );
};

export default ThoughtsFeed;
