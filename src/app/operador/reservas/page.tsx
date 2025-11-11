// src/app/operador/reservas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, Users, Bed, DollarSing, Check, X, 
  Lock, AlertCircle, Star, Droplet, Dumbbell, Utensils 
} from '@/components/icons/Icons';

export default function OperadorReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarReservas();
  }, [filtroEstado]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroEstado !== 'todas') {
        params.append('estado', filtroEstado);
      }

      const response = await fetch(`/api/operador/reservas?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReservas(data.reservas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const liberarReserva = async (nuevoEstado: 'cancelada' | 'finalizada') => {
    if (!reservaSeleccionada) return;

    const confirmar = confirm(
      `¿Estás seguro de ${nuevoEstado === 'cancelada' ? 'cancelar' : 'finalizar'} esta reserva?`
    );

    if (!confirmar) return;

    setProcesando(true);
    try {
      const response = await fetch('/api/operador/reservas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_reserva: reservaSeleccionada.id_reserva,
          nuevo_estado: nuevoEstado
        })
      });

      const data = await response.json();

      if (data.success) {
        await cargarReservas();
        setReservaSeleccionada(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar reserva');
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges: any = {
      confirmada: { text: 'Confirmada', className: 'bg-green-100 text-green-800 border-green-300' },
      cancelada: { text: 'Cancelada', className: 'bg-red-100 text-red-800 border-red-300' },
      finalizada: { text: 'Finalizada', className: 'bg-gray-100 text-gray-800 border-gray-300' }
    };
    return badges[estado] || badges.confirmada;
  };

  const getPagoBadge = (estadoPago: string) => {
    const badges: any = {
      completado: { text: 'Pagado', className: 'bg-green-100 text-green-800' },
      pendiente: { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      fallido: { text: 'Fallido', className: 'bg-red-100 text-red-800' }
    };
    return badges[estadoPago] || badges.pendiente;
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
          <h1 className="font-playfair text-4xl font-bold mb-2">Gestión de Reservas</h1>
          <p className="font-inter text-lg text-white/90">
            Consulta y administra todas las reservas del hotel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'todas', label: 'Todas' },
              { value: 'confirmada', label: 'Confirmadas' },
              { value: 'cancelada', label: 'Canceladas' },
              { value: 'finalizada', label: 'Finalizadas' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFiltroEstado(value)}
                className={`px-6 py-3 rounded-xl font-inter font-semibold transition-all ${
                  filtroEstado === value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="space-y-4">
          <p className="font-inter text-gray-600 mb-4">
            {reservas.length} reserva{reservas.length !== 1 ? 's' : ''} encontrada{reservas.length !== 1 ? 's' : ''}
          </p>

          {reservas.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="font-inter text-gray-600">No hay reservas con este filtro</p>
            </div>
          ) : (
            reservas.map((reserva) => {
              const badge = getEstadoBadge(reserva.estado_reserva);
              const pagoBadge = getPagoBadge(reserva.pagos[0]?.estado_pago);
              const inicio = new Date(reserva.fecha_inicio);
              const fin = new Date(reserva.fecha_fin);
              const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={reserva.id_reserva}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setReservaSeleccionada(reserva)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold border ${badge.className}`}>
                          {badge.text}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold ${pagoBadge.className}`}>
                          {pagoBadge.text}
                        </span>
                        <span className="font-inter text-xs text-gray-500">
                          Reserva #{reserva.id_reserva}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center space-x-2 text-gray-700 mb-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-inter text-sm font-semibold">
                              {reserva.usuario.nombre}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Bed className="w-4 h-4 text-green-500" />
                            <span className="font-inter text-sm">
                              Habitación {reserva.habitacion.numero_habitaciones} - {reserva.habitacion.tipo}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="font-inter text-sm">
                              {inicio.toLocaleDateString('es-AR')} → {fin.toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Lock className="w-4 h-4 text-purple-500" />
                            <span className="font-inter text-sm">
                              {dias} {dias === 1 ? 'noche' : 'noches'} • {reserva.numero_huespedes} huéspedes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2 mb-1">
                        <DollarSing className="w-5 h-5 text-green-600" />
                        <span className="font-playfair text-3xl font-bold text-gray-800">
                          ${parseFloat(reserva.precio_total).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-inter text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {reservaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setReservaSeleccionada(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
                  Reserva #{reservaSeleccionada.id_reserva}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold border ${getEstadoBadge(reservaSeleccionada.estado_reserva).className}`}>
                    {getEstadoBadge(reservaSeleccionada.estado_reserva).text}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold ${getPagoBadge(reservaSeleccionada.pagos[0]?.estado_pago).className}`}>
                    {getPagoBadge(reservaSeleccionada.pagos[0]?.estado_pago).text}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReservaSeleccionada(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Cliente */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-inter text-sm font-semibold text-blue-900 mb-4">Cliente</h4>
                <p className="font-inter text-gray-800 mb-2">
                  <strong>Nombre:</strong> {reservaSeleccionada.usuario.nombre}
                </p>
                <p className="font-inter text-gray-800">
                  <strong>Email:</strong> {reservaSeleccionada.usuario.correo}
                </p>
              </div>

              {/* Habitación */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-inter text-sm font-semibold text-green-900 mb-4">Habitación</h4>
                <p className="font-inter text-gray-800 mb-2">
                  <strong>N°:</strong> {reservaSeleccionada.habitacion.numero_habitaciones}
                </p>
                <p className="font-inter text-gray-800">
                  <strong>Tipo:</strong> {reservaSeleccionada.habitacion.tipo}
                </p>
              </div>

              {/* Fechas */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-inter text-sm font-semibold text-orange-900 mb-4">Fechas</h4>
                <p className="font-inter text-gray-800 mb-2">
                  <strong>Check-in:</strong> {new Date(reservaSeleccionada.fecha_inicio).toLocaleDateString('es-AR')}
                </p>
                <p className="font-inter text-gray-800">
                  <strong>Check-out:</strong> {new Date(reservaSeleccionada.fecha_fin).toLocaleDateString('es-AR')}
                </p>
              </div>

              {/* Pago */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-inter text-sm font-semibold text-purple-900 mb-4">Pago</h4>
                <p className="font-playfair text-2xl font-bold text-purple-800 mb-2">
                  ${parseFloat(reservaSeleccionada.precio_total).toLocaleString()}
                </p>
                <p className="font-inter text-sm text-purple-700">
                  Estado: {reservaSeleccionada.pagos[0]?.estado_pago || 'Pendiente'}
                </p>
              </div>
            </div>

            {/* Servicios adicionales */}
            {(reservaSeleccionada.servicios.length > 0 || 
              reservaSeleccionada.spa.length > 0 || 
              reservaSeleccionada.actividades.length > 0 || 
              reservaSeleccionada.paquetes.length > 0 || 
              reservaSeleccionada.restaurante.length > 0) && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-inter text-sm font-semibold text-gray-900 mb-4">Servicios Adicionales</h4>
                <div className="space-y-3">
                  {reservaSeleccionada.servicios.length > 0 && (
                    <div>
                      <p className="font-inter text-xs text-gray-600 mb-2">Servicios Hotel:</p>
                      <div className="flex flex-wrap gap-2">
                        {reservaSeleccionada.servicios.map((item: any) => (
                          <span key={item.id_servicio} className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{item.servicio.nombre_servicio} (x{item.cantidad})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Más servicios... */}
                </div>
              </div>
            )}

            {/* Acciones */}
            {reservaSeleccionada.estado_reserva === 'confirmada' && (
              <div className="flex gap-4">
                <button
                  onClick={() => liberarReserva('finalizada')}
                  disabled={procesando}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-inter font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>{procesando ? 'Procesando...' : 'Finalizar Reserva'}</span>
                </button>
                <button
                  onClick={() => liberarReserva('cancelada')}
                  disabled={procesando}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-inter font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>{procesando ? 'Procesando...' : 'Cancelar Reserva'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}