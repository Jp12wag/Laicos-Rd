import React from 'react';
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';


const App = () => {
  const getRole = () => localStorage.getItem('userRole');
  
  console.log(getRole);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Agrega otras rutas aquí */}
          <Route path="/dashboard" element={
          getRole() === 'Administrador' ? <AdminDashboard /> : 
          getRole() === 'Usuario' ? <UserDashboard /> : 
          <Navigate to="/login" />
        } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
