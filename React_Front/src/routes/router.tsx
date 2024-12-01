import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm.tsx'
import LoginForm from '../components/Auth/LoginForm.tsx'
import Inscription from '@/pages/inscription.tsx';
import AddInscription from '@/pages/AddInscription.tsx';
import AddEvent from '@/pages/Addevent.tsx';
import Events from '@/pages/events.tsx';
import ProtectedRoute from './ProtectedRoute';

function Routers() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* Protected routes */}
        <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/addevent" element={
          <ProtectedRoute>
            <AddEvent />
          </ProtectedRoute>
        } />
        <Route path="/inscription" element={
          <ProtectedRoute>
            <Inscription />
          </ProtectedRoute>
        } />
        <Route path="/addinscription" element={
          <ProtectedRoute>
            <AddInscription />
          </ProtectedRoute>
        } />

        {/* Redirect root to events if authenticated, otherwise to login */}
        <Route path="/" element={<Navigate to="/inscription" replace />} />
      </Routes>
    </Router> 
  );
}

export default Routers;
