import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm.tsx'
import LoginForm from '../components/Auth/LoginForm.tsx'
import Inscription from '@/pages/inscription.tsx';
import AddInscription from '@/pages/AddInscription.tsx';
import AddEvent from '@/pages/Addevent.tsx';
import Events from '@/pages/events.tsx';
function Routers() {
  return (
    <Router>
        <Routes>
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/AddInscription" element={<AddInscription />} />
          <Route path="/AddEvent" element={<AddEvent />} />
          <Route path="/Events" element={<Events />} />
        </Routes>
    </Router>
  );
}

export default Routers;
