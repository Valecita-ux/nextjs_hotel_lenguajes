// src/app/operador/habitaciones/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Bed, Users, Check, X, AlertCircle, Lock } from '@/components/icons/Icons';

export default function OperadorHabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<any>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const cargarHabitaciones = async () => {
    try {
      const response = await fetch('/api/operador/habitaciones');
      const data = await response.json();

      if (data.success) {
        setHabitaciones(data.habitaciones);
        setHabitacionesPorPiso(data.habitacionesPorPiso);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!habitacionSeleccionada) return;

    setCambiandoEstado(true);
    try {
      const response = await fetch('/api/operador/habitaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_habitacion: habitacionSeleccionada.id_habitaciones,
          nuevo_estado: nuevoEstado
        })
      });

      const data = await response.json();

      if (data.success) {
        await cargarHabitaciones();
        setHabitacionSeleccionada(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-500 border-green-600';
      case 'reservado':
        return 'bg-red-500 border-red-600';
      case 'mantenimiento':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <Check className="w-5 h-5" />;
      case 'reservado':
        return <X className="w-5 h-5" />;
      case 'mantenimiento':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#3E0014] border-t-[#5B002C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3E0014] to-[#830d46] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold mb-2">Mapa de Habitaciones</h1>
          <p className="font-inter text-lg text-white/90">
            Vista general del estado de todas las habitaciones
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Leyenda */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="font-inter text-sm font-semibold text-gray-700 mb-4">Leyenda:</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#13e31d] rounded-lg border-2 border-[#0ea51f]"></div>
              <span className="font-inter text-sm text-gray-700">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#c50c0c] rounded-lg border-2 border-[#ca0b0b]"></div>
              <span className="font-inter text-sm text-gray-700">Reservado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#e7af21] rounded-lg border-2 border-[#dbb874]"></div>
              <span className="font-inter text-sm text-gray-700">Mantenimiento</span>
            </div>
          </div>
        </div>

        {/* Mapa por pisos */}
        {Object.keys(habitacionesPorPiso).sort().reverse().map(piso => (
          <div key={piso} className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3E0014] to-[#830d46] rounded-full flex items-center justify-center">
                  <span className="font-playfair text-x2 font-bold text-white">{piso}</span>
                </div>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-gray-800">
                    Piso {piso}
                  </h2>
                  <p className="font-inter text-sm text-gray-600">
                    {habitacionesPorPiso[piso].length} habitaciones
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {habitacionesPorPiso[piso].map((hab: any) => {
                  const reservaActual = hab.reservas[0];
                  return (
                    <button
                      key={hab.id_habitaciones}
                      onClick={() => setHabitacionSeleccionada(hab)}
                      className={`${getEstadoColor(hab.estado)} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 relative group`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getEstadoIcon(hab.estado)}
                        <span className="font-playfair text-2xl font-bold">
                          {hab.numero_habitaciones}
                        </span>
                        <span className="font-inter text-xs capitalize opacity-90">
                          {hab.tipo}
                        </span>
                        {reservaActual && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Users className="w-3 h-3 text-[#830d46]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalle */}
      {habitacionSeleccionada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setHabitacionSeleccionada(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${getEstadoColor(habitacionSeleccionada.estado)} rounded-xl flex items-center justify-center`}>
                  <span className="font-playfair text-3xl font-bold text-white">
                    {habitacionSeleccionada.numero_habitaciones}
                  </span>
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 capitalize">
                    {habitacionSeleccionada.tipo}
                  </h3>
                  <p className="font-inter text-sm text-gray-600">
                    Habitación #{habitacionSeleccionada.numero_habitaciones}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHabitacionSeleccionada(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Información */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-inter text-sm text-gray-600 mb-2">Descripción:</p>
                <p className="font-inter text-gray-800">{habitacionSeleccionada.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-inter text-xs text-gray-600 mb-1">Capacidad</p>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#830d46]" />
                    <span className="font-inter font-semibold text-gray-800">
                      {habitacionSeleccionada.cantidad_personas} personas
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-inter text-xs text-gray-600 mb-1">Precio por noche</p>
                  <span className="font-playfair text-xl font-bold text-gray-800">
                    ${parseFloat(habitacionSeleccionada.precio).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Reserva actual */}
              {habitacionSeleccionada.reservas[0] && (
                <div className="bg-[#f7e6e9] border-l-4 border-[#7A002B] rounded-xl p-4">
                  <p className="font-inter text-sm font-semibold text-[#7A002B] mb-2">
                    Reserva Actual:
                  </p>
                  <p className="font-inter text-sm text-[#AC1634]">
                    <strong>Cliente:</strong> {habitacionSeleccionada.reservas[0].usuario.nombre}
                  </p>
                  <p className="font-inter text-sm text-[#AC1634]">
                    <strong>Check-in:</strong> {new Date(habitacionSeleccionada.reservas[0].fecha_inicio).toLocaleDateString('es-AR')}
                  </p>
                  <p className="font-inter text-sm text-[#AC1634]">
                    <strong>Check-out:</strong> {new Date(habitacionSeleccionada.reservas[0].fecha_fin).toLocaleDateString('es-AR')}
                  </p>
                </div>
              )}
            </div>

            {/* Cambiar Estado */}
            <div>
              <p className="font-inter text-sm font-semibold text-gray-700 mb-3">
                Cambiar Estado:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => cambiarEstado('disponible')}
                  disabled={cambiandoEstado || habitacionSeleccionada.estado === 'disponible'}
                  className="flex flex-col items-center space-y-2 p-4 bg-[#f7edef] hover:bg-[#f5e1e5] border-2 border-[#D38C9D] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-6 h-6 text-[#D38C9D]" />
                  <span className="font-inter text-sm font-semibold text-[#D38C9D]">Disponible</span>
                </button>

                <button
                  onClick={() => cambiarEstado('reservado')}
                  disabled={cambiandoEstado || habitacionSeleccionada.estado === 'reservado'}
                  className="flex flex-col items-center space-y-2 p-4 bg-[#f2dbe3] hover:bg-[#eac9d5] border-2 border-[#cd7091] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-6 h-6 text-[#9b385d]" />
                  <span className="font-inter text-sm font-semibold text-[#aa4568]">Reservado</span>
                </button>

                <button
                  onClick={() => cambiarEstado('mantenimiento')}
                  disabled={cambiandoEstado || habitacionSeleccionada.estado === 'mantenimiento'}
                  className="flex flex-col items-center space-y-2 p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <span className="font-inter text-sm font-semibold text-yellow-700">Mantenimiento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}