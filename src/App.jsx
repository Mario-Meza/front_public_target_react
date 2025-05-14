import { Routes, Route } from 'react-router-dom';
import Tarjeta  from './pages/Tarjeta';

export default function App() {
  return (
    <Routes>
        <Route path="/c/:uuid" element={<Tarjeta />} />
    </Routes>
  );
}
