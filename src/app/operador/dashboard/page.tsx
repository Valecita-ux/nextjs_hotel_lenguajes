// src/app/operador/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bed, Calendar, MessageSquare, DollarSing, 
  Users, Lock, Check, AlertCircle 
} from '@/components/icons/Icons';

export default function OperadorDashboard() {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('/api/operador/estadisticas');
      const data = await response.json();
      
      if (data.success) {
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-playfair text-5xl font-bold mb-4">Panel de Operador</h1>
          <p className="font-inter text-xl text-white/90">
            Gestión y control del hotel en tiempo real
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Habitaciones */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Habitaciones</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.totalHabitaciones || 0}
            </p>
            <p className="font-inter text-sm text-green-600">
              {estadisticas?.habitacionesDisponibles || 0} disponibles
            </p>
          </div>

          {/* Reservas Activas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Reservas</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.reservasActivas || 0}
            </p>
            <p className="font-inter text-sm text-gray-600">Activas hoy</p>
          </div>

          {/* Consultas Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Consultas</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.consultasPendientes || 0}
            </p>
            <p className="font-inter text-sm text-orange-600">Por responder</p>
          </div>

          {/* Pagos Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Pagos</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.pagosPendientes || 0}
            </p>
            <p className="font-inter text-sm text-purple-600">Por procesar</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/operador/habitaciones"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bed className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              Gestionar Habitaciones
            </h3>
            <p className="font-inter text-gray-600">
              Ver mapa de habitaciones, abrir/cerrar y cambiar estados
            </p>
          </Link>

          <Link href="/operador/reservas"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              Consultar Reservas
            </h3>
            <p className="font-inter text-gray-600">
              Ver todas las reservas y liberar cuando sea necesario
            </p>
          </Link>

          <Link href="/operador/pagos"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              Procesar Pagos
            </h3>
            <p className="font-inter text-gray-600">
              Gestionar y confirmar pagos de reservas
            </p>
          </Link>

          <Link href="/operador/consultas"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              Responder Consultas
            </h3>
            <p className="font-inter text-gray-600">
              Atender consultas de clientes por email
            </p>
          </Link>
        </div>

        {/* Actividad reciente */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-inter text-sm font-semibold text-gray-800">
                  Nueva reserva confirmada
                </p>
                <p className="font-inter text-xs text-gray-600">
                  Habitación 301 - Check-in mañana
                </p>
              </div>
              <span className="font-inter text-xs text-gray-500">Hace 2h</span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-inter text-sm font-semibold text-gray-800">
                  Consulta sin responder
                </p>
                <p className="font-inter text-xs text-gray-600">
                  Cliente pregunta sobre servicios de spa
                </p>
              </div>
              <span className="font-inter text-xs text-gray-500">Hace 5h</span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-inter text-sm font-semibold text-gray-800">
                  Pago procesado
                </p>
                <p className="font-inter text-xs text-gray-600">
                  Reserva #1234 - $15,000
                </p>
              </div>
              <span className="font-inter text-xs text-gray-500">Ayer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);