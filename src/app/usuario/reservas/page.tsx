//(mis reservas)
// src/app/usuario/reservas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Reserva } from '@/types';
import { 
  Calendar, Users, Bed, X, Check, Lock, Flower, AlertCircle 
} from '@/components/icons/Icons';

export default function MisReservasPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'activas' | 'pasadas' | 'canceladas'>('todas');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      cargarReservas(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, []);

  const cargarReservas = async (userId: number) => {
    try {
      const response = await fetch(`/api/reservas?userId=${userId}`);
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

  const handleCancelar = async (reservaId: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    setCancelando(reservaId);

    try {
      const response = await fetch(`/api/reservas?id=${reservaId}&userId=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Recargar reservas
        cargarReservas(user.id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar la reserva');
    } finally {
      setCancelando(null);
    }
  };

  const getEstadoBadge = (reserva: Reserva) => {
    const hoy = new Date();
    const inicio = new Date(reserva.fecha_inicio);
    const fin = new Date(reserva.fecha_fin);

    if (reserva.estado_reserva === 'cancelada') {
      return { text: 'Cancelada', className: 'bg-red-100 text-red-800 border-red-300' };
    }

    if (reserva.estado_reserva === 'finalizada') {
      return { text: 'Finalizada', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }

    if (hoy < inicio) {
      return { text: 'Próxima', className: 'bg-blue-100 text-blue-800 border-blue-300' };
    }

    if (hoy >= inicio && hoy <= fin) {
      return { text: 'En curso', className: 'bg-green-100 text-green-800 border-green-300' };
    }

    return { text: 'Finalizada', className: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  const reservasFiltradas = reservas.filter(reserva => {
    const hoy = new Date();
    const inicio = new Date(reserva.fecha_inicio);
    const fin = new Date(reserva.fecha_fin);

    if (filtro === 'todas') return true;
    if (filtro === 'canceladas') return reserva.estado_reserva === 'cancelada';
    if (filtro === 'activas') return reserva.estado_reserva === 'confirmada' && fin >= hoy;
    if (filtro === 'pasadas') return reserva.estado_reserva === 'finalizada' || (reserva.estado_reserva === 'confirmada' && fin < hoy);

    return true;
  });

  const puedeCancel = (reserva: Reserva) => {
    if (reserva.estado_reserva !== 'confirmada') return false;
    
    const inicio = new Date(reserva.fecha_inicio);
    const hoy = new Date();
    
    // Permite cancelar hasta 24 horas antes
    const diff = inicio.getTime() - hoy.getTime();
    const horasRestantes = diff / (1000 * 60 * 60);
    
    return horasRestantes > 24;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
          <p className="font-inter text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Flower className="w-16 h-16 text-[#D4AF37] mb-4 animate-pulse" />
          <h1 className="font-playfair text-5xl font-bold mb-4">Mis Reservas</h1>
          <p className="font-inter text-xl text-white/90 max-w-2xl">
            Administra tus reservas y planifica tu estadía
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros y botón nueva reserva */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'activas', label: 'Activas' },
              { key: 'pasadas', label: 'Pasadas' },
              { key: 'canceladas', label: 'Canceladas' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFiltro(key as any)}
                className={`px-4 py-2 rounded-lg font-inter font-semibold transition-all ${
                  filtro === key
                    ? 'bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Botón nueva reserva */}
          <Link
            href="/usuario/habitaciones"
            className="px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white rounded-lg font-cormorant font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Nueva Reserva
          </Link>
        </div>

        {/* Lista de reservas */}
        {reservasFiltradas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Flower className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              {filtro === 'todas' ? 'No tienes reservas' : `No tienes reservas ${filtro}`}
            </h3>
            <p className="font-inter text-gray-600 mb-6">
              Explora nuestras habitaciones y reserva tu próxima estadía
            </p>
            <Link
              href="/usuario/habitaciones"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold hover:shadow-lg transition-all"
            >
              Ver Habitaciones
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reservasFiltradas.map((reserva) => {
              const badge = getEstadoBadge(reserva);
              const precio = typeof reserva.precio_total === 'string'
                ? parseFloat(reserva.precio_total)
                : reserva.precio_total;
              
              const inicio = new Date(reserva.fecha_inicio);
              const fin = new Date(reserva.fecha_fin);

              return (
                <div
                  key={reserva.id_reserva}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                      {/* Info principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold border ${badge.className}`}>
                            {badge.text}
                          </span>
                          <span className="font-inter text-sm text-gray-500">
                            Reserva #{reserva.id_reserva}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 mb-2">
                          <Bed className="w-5 h-5 text-[#895A49]" />
                          <span className="font-playfair text-xl font-bold text-gray-800">
                            Habitación {reserva.habitacion?.numero_habitaciones} - {reserva.habitacion?.tipo}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-inter text-sm">
                              Check-in: {inicio.toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-inter text-sm">
                              Check-out: {fin.toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-inter text-sm">
                              {reserva.numero_huespedes} {reserva.numero_huespedes === 1 ? 'huésped' : 'huéspedes'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Lock className="w-4 h-4" />
                            <span className="font-inter text-sm">
                              {Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))} noches
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Precio y acciones */}
                      <div className="flex flex-col items-end space-y-4">
                        <div className="text-right">
                          <span className="font-inter text-sm text-gray-500 block">Total pagado</span>
                          <span className="font-playfair text-3xl font-bold text-[#7B1D26]">
                            ${precio.toLocaleString()}
                          </span>
                        </div>

                        {puedeCancel(reserva) && (
                          <button
                            onClick={() => handleCancelar(reserva.id_reserva)}
                            disabled={cancelando === reserva.id_reserva}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-inter font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelando === reserva.id_reserva ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin"></div>
                                <span>Cancelando...</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                <span>Cancelar Reserva</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Info de pago */}
                    {reserva.pagos && reserva.pagos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-inter text-sm text-gray-600">
                            Estado del pago:
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold ${
                            reserva.pagos[0].estado_pago === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reserva.pagos[0].estado_pago === 'completado' ? 'Pagado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}