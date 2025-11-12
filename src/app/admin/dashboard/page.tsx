// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icons
const Bed = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 17h20"></path>
    <path d="M6 8V4"></path>
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const COLORS = ['#E91E63', '#F06292', '#FF4081', '#EC407A', '#F48FB1'];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [graficos, setGraficos] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(haceUnMes.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarEstadisticas();
    }
  }, [fechaInicio, fechaFin]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      
      // Calcular días de diferencia
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diferenciaDias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      
      const response = await fetch(`/api/admin/estadisticas?periodo=${diferenciaDias}`);
      const data = await response.json();

      if (data.success) {
        setEstadisticas(data.estadisticas);
        setGraficos(data.graficos);
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
        <div className="w-16 h-16 border-4 border-pink-600 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-playfair text-4xl font-bold mb-2">Dashboard Administrativo</h1>
              <p className="font-inter text-lg text-white/90">
                Resumen general de operaciones y métricas
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-white" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white text-gray-800 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <span className="text-white">hasta</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white text-gray-800 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <button
                onClick={cargarEstadisticas}
                className="px-4 py-2 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-inter text-sm font-medium">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tarjetas de Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Habitaciones */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-600">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-playfair font-bold text-gray-800">
                {estadisticas.habitaciones.total}
              </span>
            </div>
            <h3 className="font-inter text-sm font-semibold text-gray-600 mb-2">
              Total Habitaciones
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">✓ {estadisticas.habitaciones.disponibles} disponibles</span>
              <span className="text-red-600">✗ {estadisticas.habitaciones.reservadas} ocupadas</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs text-gray-600">Ocupación</span>
                <span className="font-inter text-sm font-bold text-pink-600">
                  {estadisticas.habitaciones.tasaOcupacion}%
                </span>
              </div>
            </div>
          </div>

          {/* Reservas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-rose-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-400 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-playfair font-bold text-gray-800">
                {estadisticas.reservas.total}
              </span>
            </div>
            <h3 className="font-inter text-sm font-semibold text-gray-600 mb-2">
              Total Reservas
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-inter text-xs text-gray-600">
                {estadisticas.reservas.periodo} este período
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs text-gray-600">Activas</span>
                <span className="font-inter text-sm font-bold text-rose-500">
                  {estadisticas.reservas.activas}
                </span>
              </div>
            </div>
          </div>

          {/* Ingresos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-400 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-playfair font-bold text-gray-800">
                ${estadisticas.ingresos.totales.toLocaleString()}
              </span>
            </div>
            <h3 className="font-inter text-sm font-semibold text-gray-600 mb-2">
              Ingresos Totales
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-inter text-xs text-gray-600">
                Este período: ${estadisticas.ingresos.periodo.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Usuarios */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-rose-400">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-300 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-playfair font-bold text-gray-800">
                {estadisticas.usuarios.total}
              </span>
            </div>
            <h3 className="font-inter text-sm font-semibold text-gray-600 mb-2">
              Total Usuarios
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{estadisticas.usuarios.clientes} clientes</span>
              <span className="text-gray-600">{estadisticas.usuarios.operadores} operadores</span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Ingresos por Día */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Ingresos Últimos 7 Días
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graficos.ingresosPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12 }}
                  stroke="#999"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#999"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E91E63',
                    borderRadius: '8px' 
                  }}
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#E91E63" 
                  strokeWidth={3}
                  dot={{ fill: '#E91E63', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Habitaciones por Tipo */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Habitaciones por Tipo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={graficos.habitacionesPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    const payload = (entry as any).payload;
                    return `${payload?.tipo}: ${payload?.cantidad}`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {graficos.habitacionesPorTipo.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E91E63',
                    borderRadius: '8px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservas por Estado */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Reservas por Estado
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficos.reservasPorEstado}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="estado" 
                  tick={{ fontSize: 12 }}
                  stroke="#999"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#999"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E91E63',
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="cantidad" fill="#E91E63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 5 Habitaciones Más Reservadas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Top 5 Habitaciones Más Reservadas
            </h3>
            <div className="space-y-3">
              {graficos.topHabitaciones.map((hab: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white font-bold font-playfair">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-gray-800">
                        Hab. #{hab.numero}
                      </p>
                      <p className="font-inter text-xs text-gray-600 capitalize">
                        {hab.tipo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair text-2xl font-bold text-pink-600">
                      {hab.reservas}
                    </p>
                    <p className="font-inter text-xs text-gray-600">reservas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}