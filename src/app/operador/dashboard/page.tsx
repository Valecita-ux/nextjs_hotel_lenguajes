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
        <div className="w-16 h-16 border-4 border-[#3E0014] border-t-[#830d46] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#3E0014] via-[#5B002C] to-[#7A002B] text-white py-16 px-6">
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#7A002B] to-[#AC1634] rounded-full flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Habitaciones</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.totalHabitaciones || 0}
            </p>
            <div className="flex items-center justify-between text-xs">
              <p className="font-inter text-[#E77291]">
                ✓ {estadisticas?.habitacionesDisponibles || 0} disponibles
              </p>
              <p className="font-inter text-[#3E0014]">
                {estadisticas?.habitacionesReservadas || 0} ocupadas
              </p>
            </div>
          </div>

          {/* Reservas Activas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7A002B] to-[#AC1634] rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Reservas</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.reservasActivas || 0}
            </p>
            <p className="font-inter text-sm text-[#E77291]">
              Confirmadas ({estadisticas?.totalReservas || 0} totales)
            </p>
          </div>

          {/* Consultas Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7A002B] to-[#AC1634] rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Consultas</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.consultasPendientes || 0}
            </p>
            <p className="font-inter text-sm text-[#E77291]">
              Por responder ({estadisticas?.totalConsultas || 0} totales)
            </p>
          </div>

          {/* Pagos Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7A002B] to-[#AC1634] rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-inter text-gray-500 uppercase">Pagos</span>
            </div>
            <p className="font-playfair text-4xl font-bold text-gray-800 mb-1">
              {estadisticas?.pagosPendientes || 0}
            </p>
            <p className="font-inter text-sm text-[#E77291]">
              Por procesar ({estadisticas?.totalPagos || 0} totales)
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/operador/habitaciones"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#9D0D2F]">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3E0D1E] to-[#9D0D2F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#B4204A]">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9D0D2F] to-[#B4204A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#E87D87]">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B4204A] to-[#E87D87] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#ECA59D]">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E87D87] to-[#ECA59D] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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