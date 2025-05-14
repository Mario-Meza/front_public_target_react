import { useParams }   from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Tarjeta() {
    const { uuid } = useParams();
    const [data, setData] = useState(null);
    const [err,  setErr]  = useState(null);
    const API_BASE    = import.meta.env.VITE_API_BASE;
    const BACKEND     = import.meta.env.VITE_BACKEND_BASE;


  useEffect(() => {
      fetch(`${API_BASE}/c/${uuid}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(setErr);
  }, [uuid]);

  if (err)   return <p className="text-center mt-20">Tarjeta no encontrada.</p>;
  if (!data) return <p className="text-center mt-20">Cargando…</p>;

  const { cliente, reward } = data;
  const ready = reward && cliente.puntos >= reward.puntos_req;


  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-white p-6 rounded-xl shadow text-center">
      <h1 className="text-xl font-bold mb-1">¡Hola, {cliente.nombre}!</h1>
      <p className="text-gray-500 mb-4">{cliente.telefono}</p>
        <img
          src={`${BACKEND}${data.qr_path}`}   // o cliente.qr_file
          alt="QR"
          className="w-40 mx-auto my-4"
        />

      <p className="text-lg font-semibold">
        Puntos: {cliente.puntos}{reward && ` / ${reward.puntos_req}`}
      </p>

      {reward ? (
        ready
          ? <p className="mt-3 text-green-600 font-medium animate-pulse">
              🎉 ¡Premio listo: «{reward.nombre}»!
            </p>
          : <p className="mt-3 text-gray-500">
              Faltan {reward.puntos_req - cliente.puntos} pts para «{reward.nombre}».
            </p>
      ) : (
        <p className="mt-3 text-gray-500">(Sin recompensa activa)</p>
      )}
    </div>
  );
}
