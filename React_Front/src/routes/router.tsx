import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm.tsx'
import LoginForm from '../components/Auth/LoginForm.tsx'
import Inscription from '@/pages/inscription.tsx';

function Routers() {
  return (
    <Router>
        <Routes>
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Inscription" element={<Inscription />} />
        </Routes>
    </Router>
  );
}

export default Routers;
