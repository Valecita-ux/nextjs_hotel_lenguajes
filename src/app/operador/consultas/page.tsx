'use client';

import { useState, useEffect, useCallback } from 'react';

// Definiciones de íconos SVG para garantizar la compilación
const Mail = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const AlertCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const RefreshCw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

// Tipos
type Consulta = {
  id_consulta: number;
  nombre: string;
  correo: string;
  mensaje: string;
  estado: 'pendiente' | 'respondida';
  fecha_consulta: string;
  respuesta: string | null;
};

export default function OperadorConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<Consulta | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [traduccion, setTraduccion] = useState<string | null>(null);
  const [loadingTraduccion, setLoadingTraduccion] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // --- Lógica de APIs (Mantenida sin cambios) ---

  const cargarConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Este fetch es solo de ejemplo, se asume que la API funciona.
      const response = await fetch('/api/operador/consultas?estado=pendiente', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error al cargar la lista de consultas.');
      }
      const data = await response.json();
      // Simulación de datos si la respuesta está vacía (solo para demo)
      if (data.consultas.length === 0) {
        setConsultas([
          
        ]);
      } else {
        setConsultas(data.consultas);
      }
    } catch (err: any) {
      setError(err.message);
      // Mantener la simulación en caso de error para la vista de lista
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarConsultas();
  }, [cargarConsultas]);
  
  // SEGUNDA API WEB: Función para traducir la consulta del cliente (Lógica mantenida)
  const handleTraducir = async (id: number) => {
    setLoadingTraduccion(true);
    setTraduccion(null);
    try {
      const response = await fetch(`/api/operador/consultas?id=${id}&traducir=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error en la traducción.');
      }
      const data = await response.json();
      setTraduccion(`[Idioma detectado: ${data.idioma.toUpperCase()}] Traducción (EN): ${data.traduccion}`);
    } catch (err: any) {
      // Reemplazo de alert() por mensaje de error en la UI (práctica recomendada)
      console.error(`Error de Traducción: ${err.message}`);
      setTraduccion('Error al intentar traducir la consulta. (Ver consola)');
    } finally {
      setLoadingTraduccion(false);
    }
  };

  const handleAbrirModal = (consulta: Consulta) => {
    setConsultaSeleccionada(consulta);
    setRespuestaTexto('');
    setTraduccion(null);
    setModalAbierto(true);
  };
  
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setConsultaSeleccionada(null);
    setRespuestaTexto('');
    setTraduccion(null);
  };

  const handleResponder = async () => {
    if (!consultaSeleccionada || !respuestaTexto.trim()) {
      // Reemplazo de alert()
      console.error('La respuesta no puede estar vacía.');
      return;
    }

    setEnviando(true);
    try {
      // NOTE: Este fetch es solo de ejemplo, se asume que la API funciona.
      const response = await fetch('/api/operador/consultas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_consulta: consultaSeleccionada.id_consulta,
          respuesta: respuestaTexto.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reemplazo de alert()
        console.log(data.message);
        handleCerrarModal();
        cargarConsultas();
      } else {
        // Reemplazo de alert()
        console.error(data.message);
      }
    } catch (err) {
      // Reemplazo de alert()
      console.error('Error al enviar la respuesta.');
    } finally {
      setEnviando(false);
    }
  };
  // --- Fin Lógica de APIs ---


  // Manejo de Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-[#3E0014] border-t-[#5B002C] rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Header Estilizado */}
      <div className="bg-gradient-to-r from-[#3E0014] to-[#830d46] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-playfair text-4xl font-bold mb-2">Bandeja de Consultas</h1>
            <p className="font-inter text-lg text-white/90">
              Gestión y respuesta de {consultas.length} consultas pendientes.
            </p>
          </div>
          
          {/* Botón de Recarga (Estilo uniforme) */}
          <button
            onClick={cargarConsultas}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 bg-white text-[#3E0014] rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {loading ? 'Cargando...' : 'Recargar'}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 flex items-center" role="alert">
            <AlertCircle className="w-6 h-6 mr-3"/>
            <div>
              <p className="font-bold">Error de Carga</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de Consultas */}
        {consultas.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-xl border-t-4 border-green-500">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-2xl font-semibold font-playfair text-gray-700">¡Bandeja de entrada vacía!</p>
            <p className="text-gray-500 mt-2">No hay consultas pendientes de respuesta.</p>
          </div>
        ) : (
          <div className="space-y-4">
              {consultas.map((consulta) => (
                  <div
                      key={consulta.id_consulta}
                      className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#AC1634] hover:shadow-lg transition cursor-pointer flex items-center justify-between"
                      onClick={() => handleAbrirModal(consulta)}
                  >
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                              <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                                  {consulta.estado.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                  {new Date(consulta.fecha_consulta).toLocaleDateString('es-AR', { dateStyle: 'medium' })}
                              </span>
                          </div>
                          <p className="font-playfair text-lg font-bold text-gray-800 truncate">
                              {consulta.nombre}
                          </p>
                          <p className="text-sm text-gray-600 truncate mt-1">
                              {consulta.correo} - {consulta.mensaje}
                          </p>
                      </div>
                      <div className="ml-4">
                          <button
                              className="p-3 bg-[#5B002C] text-white rounded-full hover:bg-[#3E0014] transition shadow-md"
                              title="Responder"
                              // Se asegura que al hacer clic en el botón se abra el modal y no active el onClick del div padre
                              onClick={(e) => { e.stopPropagation(); handleAbrirModal(consulta); }} 
                          >
                              <Mail className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Modal de Respuesta (Estilizado) */}
      {modalAbierto && consultaSeleccionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={handleCerrarModal}>
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8 transition-transform transform scale-100 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Header Modal */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h3 className="font-playfair text-2xl font-bold text-[#3E0014]">
                        Responder Consulta #{consultaSeleccionada.id_consulta}
                    </h3>
                    <button
                        onClick={handleCerrarModal}
                        className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-[#3E0014] rounded-full flex items-center justify-center transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Info Cliente y Mensaje */}
                <div className="mb-6 space-y-4">
                    <p className="text-sm text-gray-700">
                        <strong>De:</strong> <span className="font-semibold text-[#5B002C]">{consultaSeleccionada.nombre}</span> (<span className="text-gray-500">{consultaSeleccionada.correo}</span>)
                    </p>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                        <p className="font-inter text-gray-800 font-bold mb-2">Mensaje Original:</p>
                        <p className="text-base italic text-gray-600">{consultaSeleccionada.mensaje}</p>
                    </div>
                    
                    {/* Botón y resultado de Traducción */}
                    <div className="pt-2">
                        <button
                            onClick={() => handleTraducir(consultaSeleccionada.id_consulta)}
                            disabled={loadingTraduccion}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#830d46] text-white rounded-lg font-medium hover:bg-[#AC1634] transition disabled:opacity-50 shadow-md"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span>{loadingTraduccion ? 'Traduciendo...' : 'Traducir Consulta (API Web 2)'}</span>
                        </button>
                        {traduccion && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-sm border border-yellow-300">
                                {traduccion}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Área de Respuesta */}
                <div className="mb-6">
                    <label htmlFor="respuesta" className="block text-sm font-bold text-gray-700 mb-2">
                        Tu Respuesta
                    </label>
                    <textarea
                        id="respuesta"
                        rows={6}
                        value={respuestaTexto}
                        onChange={(e) => setRespuestaTexto(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-[#AC1634] focus:border-[#AC1634] resize-none transition-all"
                        placeholder={`Redacta la respuesta para ${consultaSeleccionada.nombre}...`}
                    />
                </div>
                
                {/* Botón de Enviar */}
                <div className="flex justify-end">
                    <button
                        onClick={handleResponder}
                        disabled={enviando || !respuestaTexto.trim()}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <Check className="w-5 h-5" />
                        <span>{enviando ? 'Enviando...' : 'Marcar como Respondida'}</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}