// src/app/usuario/reservas/nueva/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Habitacion } from '@/types';
import { 
  Calendar, Users, AlertCircle, Check, ChevronLeft, Flower, Star, Plus, Minus, X
} from '@/components/icons/Icons';

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio_servicio: number | string;
}

export default function NuevaReservaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitacionId = searchParams.get('habitacion');

  const [user, setUser] = useState<any>(null);
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  const [formData, setFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    numero_huespedes: 1
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }

    if (habitacionId) {
      cargarDatos(habitacionId);
    }
  }, [habitacionId]);

  const cargarDatos = async (id: string) => {
    try {
      const [habitacionRes, serviciosRes] = await Promise.all([
        fetch(`/api/habitaciones/${id}`),
        fetch('/api/servicios')
      ]);

      const habitacionData = await habitacionRes.json();
      const serviciosData = await serviciosRes.json();

      if (habitacionData.success) {
        setHabitacion(habitacionData.habitacion);
        setFormData(prev => ({ 
          ...prev, 
          numero_huespedes: 1 
        }));
      }

      if (serviciosData.success) {
        setServicios(serviciosData.data.servicios);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const agregarServicio = (servicioId: number) => {
    const nuevaCantidad = (serviciosSeleccionados.get(servicioId) || 0) + 1;
    setServiciosSeleccionados(new Map(serviciosSeleccionados.set(servicioId, nuevaCantidad)));
  };

  const quitarServicio = (servicioId: number) => {
    const cantidadActual = serviciosSeleccionados.get(servicioId) || 0;
    if (cantidadActual > 1) {
      setServiciosSeleccionados(new Map(serviciosSeleccionados.set(servicioId, cantidadActual - 1)));
    } else {
      const nuevo = new Map(serviciosSeleccionados);
      nuevo.delete(servicioId);
      setServiciosSeleccionados(nuevo);
    }
  };

  const calcularPrecioHabitacion = () => {
    if (!formData.fecha_inicio || !formData.fecha_fin || !habitacion) {
      return 0;
    }

    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    if (dias <= 0) return 0;

    const precioHabitacion = typeof habitacion.precio === 'string' 
      ? parseFloat(habitacion.precio) 
      : habitacion.precio;

    return precioHabitacion * dias;
  };

  const calcularPrecioServicios = () => {
    let total = 0;
    serviciosSeleccionados.forEach((cantidad, servicioId) => {
      const servicio = servicios.find(s => s.id_servicio === servicioId);
      if (servicio) {
        const precio = typeof servicio.precio_servicio === 'string'
          ? parseFloat(servicio.precio_servicio)
          : servicio.precio_servicio;
        total += precio * cantidad;
      }
    });
    return total;
  };

  const calcularDias = () => {
    if (!formData.fecha_inicio || !formData.fecha_fin) return 0;
    
    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return dias > 0 ? dias : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Convertir Map a array para el API
      const servicios_seleccionados = Array.from(serviciosSeleccionados.entries()).map(
        ([id_servicio, cantidad]) => ({ id_servicio, cantidad })
      );

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          id_habitacion: habitacionId,
          servicios_seleccionados,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/usuario/reservas');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (!formData.fecha_inicio) return getMinDate();
    const checkIn = new Date(formData.fecha_inicio);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
          <p className="font-inter text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!habitacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Flower className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
            Habitación no encontrada
          </h2>
          <Link
            href="/usuario/habitaciones"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold"
          >
            Ver habitaciones disponibles
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
            ¡Reserva Confirmada!
          </h2>
          <p className="font-inter text-gray-600 mb-6">
            Tu reserva ha sido creada exitosamente. Recibirás un correo de confirmación.
          </p>
          <p className="font-inter text-sm text-gray-500">
            Redirigiendo a Mis Reservas...
          </p>
        </div>
      </div>
    );
  }

  const precioHabitacion = calcularPrecioHabitacion();
  const precioServicios = calcularPrecioServicios();
  const precioTotal = precioHabitacion + precioServicios;
  const dias = calcularDias();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#7B1D26] transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-inter">Volver</span>
          </button>
          <h1 className="font-playfair text-3xl font-bold text-gray-800">
            Nueva Reserva
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                Detalles de la Reserva
              </h2>

              {/* Fecha de entrada */}
              <div className="mb-6">
                <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Check-in
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-[#895A49]" />
                  </div>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={formData.fecha_inicio}
                    onChange={(e) => {
                      setFormData({ ...formData, fecha_inicio: e.target.value });
                      if (formData.fecha_fin && e.target.value >= formData.fecha_fin) {
                        setFormData({ ...formData, fecha_inicio: e.target.value, fecha_fin: '' });
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Fecha de salida */}
              <div className="mb-6">
                <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Check-out
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-[#895A49]" />
                  </div>
                  <input
                    type="date"
                    required
                    min={getMinCheckoutDate()}
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    disabled={!formData.fecha_inicio}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Número de huéspedes */}
              <div className="mb-6">
                <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                  Número de Huéspedes
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-[#895A49]" />
                  </div>
                  <select
                    required
                    value={formData.numero_huespedes}
                    onChange={(e) => setFormData({ ...formData, numero_huespedes: parseInt(e.target.value) })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                  >
                    {[...Array(habitacion.cantidad_personas)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-inter">{error}</span>
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={submitting || !formData.fecha_inicio || !formData.fecha_fin}
                className="w-full bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-xl font-cormorant font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar Reserva'
                )}
              </button>

              <p className="text-center font-inter text-xs text-gray-500 mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </form>

            {/* Servicios adicionales */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Star className="w-6 h-6 text-[#D4AF37]" />
                    <span>Servicios Adicionales</span>
                  </h2>
                  <p className="font-inter text-sm text-gray-600">Opcional - Mejora tu estadía</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarServicios(!mostrarServicios)}
                  className="px-4 py-2 bg-[#CA99AB] hover:bg-[#7B1D26] text-white rounded-lg font-inter text-sm transition-colors"
                >
                  {mostrarServicios ? 'Ocultar' : 'Ver Servicios'}
                </button>
              </div>

              {mostrarServicios && (
                <div className="space-y-3">
                  {servicios.map((servicio) => {
                    const cantidad = serviciosSeleccionados.get(servicio.id_servicio) || 0;
                    const precio = typeof servicio.precio_servicio === 'string'
                      ? parseFloat(servicio.precio_servicio)
                      : servicio.precio_servicio;

                    return (
                      <div
                        key={servicio.id_servicio}
                        className={`border rounded-xl p-4 transition-all ${
                          cantidad > 0
                            ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                            : 'border-gray-200 hover:border-[#CA99AB]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-cormorant text-lg font-bold text-gray-800">
                              {servicio.nombre_servicio}
                            </h4>
                            <p className="font-inter text-sm text-gray-600 mb-2">
                              {servicio.descripcion}
                            </p>
                            <span className="font-inter text-sm font-semibold text-[#7B1D26]">
                              ${precio.toLocaleString()}
                            </span>
                          </div>

                          {cantidad === 0 ? (
                            <button
                              type="button"
                              onClick={() => agregarServicio(servicio.id_servicio)}
                              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-inter text-sm hover:shadow-lg transition-all flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Agregar</span>
                            </button>
                          ) : (
                            <div className="ml-4 flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => quitarServicio(servicio.id_servicio)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                              >
                                {cantidad === 1 ? <X className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="font-cormorant text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                                {cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => agregarServicio(servicio.id_servicio)}
                                className="w-8 h-8 bg-[#7B1D26] hover:bg-[#CA99AB] text-white rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {serviciosSeleccionados.size > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 rounded-xl border border-[#CA99AB]/30">
                  <p className="font-inter text-sm font-semibold text-gray-700 mb-2">
                    Servicios seleccionados: {serviciosSeleccionados.size}
                  </p>
                  <p className="font-playfair text-2xl font-bold text-[#7B1D26]">
                    Total servicios: ${precioServicios.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6 border-2 border-[#D4AF37]/30">
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                Resumen de Reserva
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-inter text-gray-600">Habitación:</span>
                  <span className="font-cormorant font-semibold text-gray-800">
                    N° {habitacion.numero_habitaciones}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-inter text-gray-600">Tipo:</span>
                  <span className="font-inter text-gray-800 capitalize">{habitacion.tipo}</span>
                </div>

                {dias > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="font-inter text-gray-600">Noches:</span>
                    <span className="font-inter text-gray-800">{dias}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-inter text-gray-600">Huéspedes:</span>
                  <span className="font-inter text-gray-800">{formData.numero_huespedes}</span>
                </div>

                {precioHabitacion > 0 && (
                  <>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-inter text-gray-600">Habitación:</span>
                      <span className="font-inter text-gray-800">
                        ${precioHabitacion.toLocaleString()}
                      </span>
                    </div>

                    {precioServicios > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="font-inter text-gray-600">Servicios:</span>
                        <span className="font-inter text-gray-800">
                          ${precioServicios.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-cormorant font-semibold text-gray-700">
                          Total:
                        </span>
                        <span className="font-playfair text-2xl font-bold text-[#7B1D26]">
                          ${precioTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="font-inter text-xs text-blue-800">
                  <strong>Política de cancelación:</strong> Cancela gratis hasta 24 horas antes de tu check-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}