import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
