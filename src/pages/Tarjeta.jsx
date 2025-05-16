import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Tarjeta() {
  const { uuid } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Función para cargar los datos de la tarjeta
    const fetchTarjeta = async () => {
      try {
        // Usar las variables de entorno correctas
        const apiBase = import.meta.env.VITE_API_BASE || 'https://targetas-lealtad.onrender.com/api';
        const backendBase = import.meta.env.VITE_BACKEND_BASE || 'https://targetas-lealtad.onrender.com';
        
        // Aseguramos que la URL termine sin "/" antes de añadir la ruta
        const apiUrl = `${apiBase.replace(/\/$/, '')}/c/${uuid}`;
        
        console.log('Realizando petición a:', apiUrl); // Para depuración
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Importante para solicitudes a dominios diferentes
          credentials: 'same-origin',
        });
        
        if (!response.ok) {
          console.error('Error en respuesta:', response.status, response.statusText);
          throw new Error(`Error ${response.status}: No se pudo cargar la tarjeta`);
        }
        
        const jsonData = await response.json();
        console.log('Datos recibidos:', jsonData); // Para depuración
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar la tarjeta:', err);
        setError(err.message || 'Error desconocido al cargar la tarjeta');
        setLoading(false);
      }
    };

    if (uuid) {
      fetchTarjeta();
    } else {
      setError('No se proporcionó un identificador válido');
      setLoading(false);
    }
  }, [uuid]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tarjeta...</p>
          <p className="text-xs text-gray-400 mt-2">ID: {uuid}</p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error al cargar la tarjeta</h2>
          <p className="text-gray-700">{error}</p>
          <div className="text-xs text-gray-500 mt-2 mb-4">
            ID: {uuid}<br/>
            API: {import.meta.env.VITE_API_BASE}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Si no hay datos
  if (!data || !data.cliente) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-yellow-500 text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-yellow-600 mb-2">Tarjeta no encontrada</h2>
          <p className="text-gray-700">No se pudo encontrar la información de esta tarjeta.</p>
          <div className="text-xs text-gray-500 mt-2">
            ID: {uuid}
          </div>
        </div>
      </div>
    );
  }

  // Mostrar la tarjeta con los datos
  const { cliente, reward } = data;
  const backendBase = import.meta.env.VITE_BACKEND_BASE || 'https://targetas-lealtad.onrender.com';
  const qrImagePath = data.qr_path ? `${backendBase}${data.qr_path}` : null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabecera */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Tarjeta de Lealtad</h1>
          <p className="text-center text-blue-100">Programa de recompensas</p>
        </div>

        {/* Información del cliente */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{cliente.nombre}</h2>
              <p className="text-gray-600">{cliente.telefono}</p>
            </div>
            {qrImagePath && (
              <div className="w-24 h-24 bg-gray-200 rounded">
                <img
                  src={qrImagePath}
                  alt="QR Code"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Puntos y progreso */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Puntos acumulados:</span>
              <span className="text-2xl font-bold text-blue-600">{cliente.puntos}</span>
            </div>

            {reward && (
              <>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${Math.min(100, (cliente.puntos / reward.puntos_req) * 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  {cliente.puntos >= reward.puntos_req ? (
                    <p className="text-green-600 font-semibold">
                      ¡Felicidades! Ya puedes canjear tu recompensa 🎉
                    </p>
                  ) : (
                    <p>
                      Te faltan {reward.puntos_req - cliente.puntos} puntos para obtener {reward.nombre}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Recompensa */}
          {reward && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">Próxima recompensa:</h3>
              <div className="flex justify-between items-center">
                <span>{reward.nombre}</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {reward.puntos_req} puntos
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-center text-gray-500 text-sm">
            Escanea este código cada vez que visites nuestro establecimiento
          </p>
        </div>
      </div>
    </div>
  );
}