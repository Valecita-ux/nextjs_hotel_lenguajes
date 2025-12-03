// src/app/usuario/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Lock, Check, AlertCircle, ChevronLeft, DollarSing, 
  Calendar, Users, Flower 
} from '@/components/icons/Icons';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [datosReserva, setDatosReserva] = useState<any>(null);
  const [metodo_pago, setMetodoPago] = useState('tarjeta');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }

    // Obtener datos de la reserva desde sessionStorage
    const reservaData = sessionStorage.getItem('reserva_checkout');
    if (reservaData) {
      setDatosReserva(JSON.parse(reservaData));
      setLoading(false);
    } else {
      router.push('/usuario/habitaciones');
    }
  }, []);

  const procesarPago = async () => {
    if (!datosReserva || !user) return;

    setProcesando(true);
    setError('');

    try {
      // Crear la reserva con pago completado
      const payload = {
        ...datosReserva,
        id_usuario: user.id,
        pagar_ahora: true,
        metodo_pago
      };

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar sessionStorage
        sessionStorage.removeItem('reserva_checkout');
        
        // Redirigir a confirmación
        router.push(`/usuario/reservas?success=true&reserva=${data.reserva.id_reserva}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  const calcularDias = () => {
    if (!datosReserva) return 0;
    const inicio = new Date(datosReserva.fecha_inicio);
    const fin = new Date(datosReserva.fecha_fin);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
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

  if (!datosReserva) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Flower className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
            No hay datos de reserva
          </h2>
          <button
            onClick={() => router.push('/usuario/habitaciones')}
            className="px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold"
          >
            Ver habitaciones
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="font-playfair text-3xl font-bold text-gray-800">Completar Pago</h1>
          <p className="font-inter text-gray-600 mt-2">Un paso más para confirmar tu estadía</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Método de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Método de pago */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                Método de Pago
              </h2>

              <div className="space-y-4">
                {/* Tarjeta */}
                <button
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`w-full p-6 border-2 rounded-xl transition-all ${
                    metodo_pago === 'tarjeta'
                      ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        metodo_pago === 'tarjeta' ? 'bg-[#7B1D26]' : 'bg-gray-100'
                      }`}>
                        <Lock className={`w-6 h-6 ${
                          metodo_pago === 'tarjeta' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-cormorant font-semibold text-gray-800 text-lg">
                          Tarjeta de Crédito/Débito
                        </p>
                        <p className="font-inter text-sm text-gray-600">
                          Pago seguro y verificado
                        </p>
                      </div>
                    </div>
                    {metodo_pago === 'tarjeta' && (
                      <Check className="w-6 h-6 text-[#7B1D26]" />
                    )}
                  </div>
                </button>

                {/* Efectivo */}
                <button
                  onClick={() => setMetodoPago('efectivo')}
                  className={`w-full p-6 border-2 rounded-xl transition-all ${
                    metodo_pago === 'efectivo'
                      ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        metodo_pago === 'efectivo' ? 'bg-[#7B1D26]' : 'bg-gray-100'
                      }`}>
                        <DollarSing className={`w-6 h-6 ${
                          metodo_pago === 'efectivo' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-cormorant font-semibold text-gray-800 text-lg">
                          Efectivo
                        </p>
                        <p className="font-inter text-sm text-gray-600">
                          Pagar al llegar al hotel
                        </p>
                      </div>
                    </div>
                    {metodo_pago === 'efectivo' && (
                      <Check className="w-6 h-6 text-[#7B1D26]" />
                    )}
                  </div>
                </button>

                {/* Transferencia */}
                <button
                  onClick={() => setMetodoPago('transferencia')}
                  className={`w-full p-6 border-2 rounded-xl transition-all ${
                    metodo_pago === 'transferencia'
                      ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        metodo_pago === 'transferencia' ? 'bg-[#7B1D26]' : 'bg-gray-100'
                      }`}>
                        <Lock className={`w-6 h-6 ${
                          metodo_pago === 'transferencia' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-cormorant font-semibold text-gray-800 text-lg">
                          Transferencia Bancaria
                        </p>
                        <p className="font-inter text-sm text-gray-600">
                          Directo a nuestra cuenta
                        </p>
                      </div>
                    </div>
                    {metodo_pago === 'transferencia' && (
                      <Check className="w-6 h-6 text-[#7B1D26]" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-cormorant font-semibold text-green-900 text-lg mb-1">
                    Pago Seguro
                  </h3>
                  <p className="font-inter text-sm text-green-800">
                    Tu información está protegida. Usamos encriptación de nivel bancario 
                    para procesar tu pago de forma segura.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="font-inter text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6 border-2 border-[#D4AF37]/30">
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                Resumen de Reserva
              </h3>

              <div className="space-y-4 mb-6">
                {/* Habitación */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                    <span className="font-playfair text-white font-bold">
                      {datosReserva.habitacion_numero}
                    </span>
                  </div>
                  <div>
                    <p className="font-inter text-sm text-gray-600">Habitación</p>
                    <p className="font-cormorant font-semibold text-gray-800 capitalize">
                      {datosReserva.habitacion_tipo}
                    </p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-inter text-gray-600">Check-in:</span>
                    <span className="font-inter font-semibold text-gray-800">
                      {new Date(datosReserva.fecha_inicio).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-inter text-gray-600">Check-out:</span>
                    <span className="font-inter font-semibold text-gray-800">
                      {new Date(datosReserva.fecha_fin).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-inter text-gray-600">Huéspedes:</span>
                    <span className="font-inter font-semibold text-gray-800">
                      {datosReserva.numero_huespedes}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-inter text-gray-600">Habitación ({dias} {dias === 1 ? 'noche' : 'noches'})</span>
                    <span className="font-inter text-gray-800">
                      ${datosReserva.desglose?.habitacion?.toLocaleString()}
                    </span>
                  </div>

                  {datosReserva.desglose?.servicios > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-inter text-gray-600">Servicios</span>
                      <span className="font-inter text-gray-800">
                        ${datosReserva.desglose.servicios.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.spa > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-inter text-gray-600">Spa</span>
                      <span className="font-inter text-gray-800">
                        ${datosReserva.desglose.spa.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.actividades > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-inter text-gray-600">Actividades</span>
                      <span className="font-inter text-gray-800">
                        ${datosReserva.desglose.actividades.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.paquetes > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-inter text-gray-600">Paquetes</span>
                      <span className="font-inter text-gray-800">
                        ${datosReserva.desglose.paquetes.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.restaurante > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-inter text-gray-600">Restaurante</span>
                      <span className="font-inter text-gray-800">
                        ${datosReserva.desglose.restaurante.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-cormorant font-semibold text-gray-700 text-lg">
                      Total a Pagar
                    </span>
                    <span className="font-playfair text-3xl font-bold text-[#7B1D26]">
                      ${datosReserva.precio_total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={procesarPago}
                disabled={procesando}
                className="w-full bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-xl font-cormorant font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesando ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </span>
                ) : (
                  `Confirmar y Pagar $${datosReserva.precio_total?.toLocaleString()}`
                )}
              </button>

              <p className="text-center font-inter text-xs text-gray-500 mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}