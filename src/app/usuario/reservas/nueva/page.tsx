// src/app/usuario/reservas/nueva/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Habitacion } from '@/types';
import { 
  Calendar, Users, AlertCircle, Check, ChevronLeft, Flower 
} from '@/components/icons/Icons';

export default function NuevaReservaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitacionId = searchParams.get('habitacion');

  const [user, setUser] = useState<any>(null);
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      cargarHabitacion(habitacionId);
    }
  }, [habitacionId]);

  const cargarHabitacion = async (id: string) => {
    try {
      const response = await fetch(`/api/habitaciones/${id}`);
      const data = await response.json();

      if (data.success) {
        setHabitacion(data.habitacion);
        setFormData(prev => ({ 
          ...prev, 
          numero_huespedes: 1 
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar la habitación');
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecioTotal = () => {
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
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          id_habitacion: habitacionId,
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

  // Fecha mínima: mañana
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Fecha mínima para check-out: un día después del check-in
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

  const precioTotal = calcularPrecioTotal();
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
          <div className="lg:col-span-2">
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
                      // Reset fecha_fin si es anterior a la nueva fecha_inicio
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

                {precioTotal > 0 && (
                  <>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-inter text-gray-600">Precio por noche:</span>
                      <span className="font-inter text-gray-800">
                        ${(typeof habitacion.precio === 'string' 
                          ? parseFloat(habitacion.precio) 
                          : habitacion.precio).toLocaleString()}
                      </span>
                    </div>

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