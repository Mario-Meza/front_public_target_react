import { Routes, Route } from 'react-router-dom';
import Tarjeta  from './pages/Tarjeta';

function Landing() {                        //  simple landing
  return <p className="text-center mt-20">Escanea tu QR…</p>;
}

function NotFound() {                       //  fallback
  return <p className="text-center mt-20">Ruta no encontrada.</p>;
}

export default function App() {
  return (
    <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/c/:uuid" element={<Tarjeta />} />
        <Route path="*"        element={<NotFound />} />
    </Routes>
  );
}
