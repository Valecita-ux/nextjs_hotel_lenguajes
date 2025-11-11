// src/app/operador/pagos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DollarSing, Calendar, Users, Check, X, AlertCircle, RefreshCw } from '@/components/icons/Icons';

interface Pago {
  id_pago: number;
  monto: string;
  metodo_pago: string;
  estado_pago: string;
  fecha_pago: string;
  numero_transaccion: string | null;
  reserva: {
    id_reserva: number;
    fecha_inicio: string;
    fecha_fin: string;
    numero_huespedes: number;
    usuario: {
      id_usuario: number;
      nombre: string;
      correo: string;
    };
    habitacion: {
      id_habitaciones: number;
      numero_habitaciones: string;
      tipo: string;
    };
  };
}

interface Estadisticas {
  totalPagos: number;
  pagosPendientes: number;
  pagosCompletados: number;
  ingresoTotal: number;
}

export default function OperadorPagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalPagos: 0,
    pagosPendientes: 0,
    pagosCompletados: 0,
    ingresoTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('tarjeta');

  useEffect(() => {
    cargarPagos();
  }, [filtroEstado]);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operador/pagos?estado=${filtroEstado}`);
      const data = await response.json();

      if (data.success) {
        setPagos(data.pagos);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const procesarPago = async (estado: string) => {
    if (!pagoSeleccionado) return;

    setProcesando(true);
    try {
      const response = await fetch('/api/operador/pagos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pago: pagoSeleccionado.id_pago,
          estado_pago: estado,
          metodo_pago: estado === 'completado' ? metodoSeleccionado : pagoSeleccionado.metodo_pago
        })
      });

      const data = await response.json();

      if (data.success) {
        await cargarPagos();
        setPagoSeleccionado(null);
        setMetodoSeleccionado('tarjeta');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar pago');
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'fallido':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Check className="w-4 h-4" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4" />;
      case 'fallido':
        return <X className="w-4 h-4" />;
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
          <h1 className="font-playfair text-4xl font-bold mb-2">Gestión de Pagos</h1>
          <p className="font-inter text-lg text-white/90">
            Administra y procesa los pagos de las reservas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#3E0014]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Total Pagos</p>
                <p className="font-playfair text-3xl font-bold text-gray-800">
                  {estadisticas.totalPagos}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#3E0014] to-[#830d46] rounded-full flex items-center justify-center">
                <DollarSing className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="font-playfair text-3xl font-bold text-yellow-600">
                  {estadisticas.pagosPendientes}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Completados</p>
                <p className="font-playfair text-3xl font-bold text-green-600">
                  {estadisticas.pagosCompletados}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#830d46]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Ingresos Total</p>
                <p className="font-playfair text-2xl font-bold text-[#830d46]">
                  ${estadisticas.ingresoTotal.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f7e6e9] rounded-full flex items-center justify-center">
                <DollarSing className="w-6 h-6 text-[#830d46]" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-inter text-sm font-semibold text-gray-700">Filtrar por:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFiltroEstado('todos')}
                  className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                    filtroEstado === 'todos'
                      ? 'bg-[#3E0014] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroEstado('pendiente')}
                  className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                    filtroEstado === 'pendiente'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFiltroEstado('completado')}
                  className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                    filtroEstado === 'completado'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completados
                </button>
                <button
                  onClick={() => setFiltroEstado('fallido')}
                  className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                    filtroEstado === 'fallido'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Fallidos
                </button>
              </div>
            </div>
            <button
              onClick={cargarPagos}
              className="flex items-center space-x-2 px-4 py-2 bg-[#3E0014] text-white rounded-lg hover:bg-[#5B002C] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-inter text-sm">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Lista de Pagos */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#3E0014] to-[#830d46] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">ID Pago</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Habitación</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Monto</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Método</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="font-inter text-gray-500">No hay pagos para mostrar</p>
                    </td>
                  </tr>
                ) : (
                  pagos.map((pago) => (
                    <tr key={pago.id_pago} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm font-semibold text-gray-800">
                          #{pago.id_pago}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-inter text-sm font-semibold text-gray-800">
                            {pago.reserva.usuario.nombre}
                          </p>
                          <p className="font-inter text-xs text-gray-600">
                            {pago.reserva.usuario.correo}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-inter text-sm font-semibold text-gray-800">
                            #{pago.reserva.habitacion.numero_habitaciones}
                          </p>
                          <p className="font-inter text-xs text-gray-600 capitalize">
                            {pago.reserva.habitacion.tipo}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-playfair text-lg font-bold text-[#830d46]">
                          ${parseFloat(pago.monto).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700 capitalize">
                          {pago.metodo_pago}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border font-inter text-xs font-semibold ${getEstadoColor(pago.estado_pago)}`}>
                          {getEstadoIcon(pago.estado_pago)}
                          <span className="capitalize">{pago.estado_pago}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700">
                          {new Date(pago.fecha_pago).toLocaleDateString('es-AR')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setPagoSeleccionado(pago)}
                          className="px-4 py-2 bg-[#3E0014] text-white rounded-lg hover:bg-[#5B002C] transition-colors font-inter text-sm"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalle y Procesamiento */}
      {pagoSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPagoSeleccionado(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3E0014] to-[#830d46] rounded-xl flex items-center justify-center">
                  <DollarSing className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800">
                    Pago #{pagoSeleccionado.id_pago}
                  </h3>
                  <p className="font-inter text-sm text-gray-600">
                    Reserva #{pagoSeleccionado.reserva.id_reserva}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPagoSeleccionado(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Información del Pago */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-inter text-sm font-semibold text-gray-700 mb-3">
                  Información del Cliente:
                </p>
                <div className="space-y-2">
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Nombre:</strong> {pagoSeleccionado.reserva.usuario.nombre}
                  </p>
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Correo:</strong> {pagoSeleccionado.reserva.usuario.correo}
                  </p>
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Huéspedes:</strong> {pagoSeleccionado.reserva.numero_huespedes} personas
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-inter text-sm font-semibold text-gray-700 mb-3">
                  Información de la Reserva:
                </p>
                <div className="space-y-2">
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Habitación:</strong> #{pagoSeleccionado.reserva.habitacion.numero_habitaciones} - {pagoSeleccionado.reserva.habitacion.tipo}
                  </p>
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Check-in:</strong> {new Date(pagoSeleccionado.reserva.fecha_inicio).toLocaleDateString('es-AR')}
                  </p>
                  <p className="font-inter text-sm text-gray-800">
                    <strong>Check-out:</strong> {new Date(pagoSeleccionado.reserva.fecha_fin).toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f7e6e9] rounded-xl p-4 border-l-4 border-[#830d46]">
                  <p className="font-inter text-xs text-gray-600 mb-1">Monto Total</p>
                  <p className="font-playfair text-3xl font-bold text-[#830d46]">
                    ${parseFloat(pagoSeleccionado.monto).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-inter text-xs text-gray-600 mb-1">Estado Actual</p>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border font-inter text-sm font-semibold ${getEstadoColor(pagoSeleccionado.estado_pago)}`}>
                    {getEstadoIcon(pagoSeleccionado.estado_pago)}
                    <span className="capitalize">{pagoSeleccionado.estado_pago}</span>
                  </span>
                </div>
              </div>

              {pagoSeleccionado.numero_transaccion && (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
                  <p className="font-inter text-sm font-semibold text-green-700 mb-1">
                    Número de Transacción:
                  </p>
                  <p className="font-mono text-sm text-green-900">
                    {pagoSeleccionado.numero_transaccion}
                  </p>
                </div>
              )}
            </div>

            {/* Procesar Pago */}
            {pagoSeleccionado.estado_pago === 'pendiente' && (
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <p className="font-inter text-sm font-semibold text-gray-700 mb-4">
                    Procesar Pago:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="font-inter text-sm text-gray-700 mb-2 block">
                        Método de Pago:
                      </label>
                      <select
                        value={metodoSeleccionado}
                        onChange={(e) => setMetodoSeleccionado(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#830d46] font-inter"
                      >
                        <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => procesarPago('completado')}
                        disabled={procesando}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-semibold"
                      >
                        <Check className="w-5 h-5" />
                        <span>{procesando ? 'Procesando...' : 'Confirmar Pago'}</span>
                      </button>

                      <button
                        onClick={() => procesarPago('fallido')}
                        disabled={procesando}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-semibold"
                      >
                        <X className="w-5 h-5" />
                        <span>{procesando ? 'Procesando...' : 'Marcar como Fallido'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pagoSeleccionado.estado_pago !== 'pendiente' && (
              <div className="border-t pt-6">
                <div className={`rounded-xl p-4 ${
                  pagoSeleccionado.estado_pago === 'completado' 
                    ? 'bg-green-50 border-l-4 border-green-500' 
                    : 'bg-red-50 border-l-4 border-red-500'
                }`}>
                  <p className={`font-inter text-sm font-semibold ${
                    pagoSeleccionado.estado_pago === 'completado' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {pagoSeleccionado.estado_pago === 'completado' 
                      ? '✓ Este pago ya ha sido procesado exitosamente' 
                      : '✗ Este pago ha sido marcado como fallido'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}