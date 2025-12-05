'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Lock = (props: any) => <span {...props}>🔒</span>;
const Check = (props: any) => <span {...props}>✔️</span>;
const AlertCircle = (props: any) => <span {...props}>⚠️</span>;
const ChevronLeft = (props: any) => <span {...props}></span>;
const Calendar = (props: any) => <span {...props}></span>;
const Users = (props: any) => <span {...props}></span>;
const Flower = (props: any) => <span {...props}>🌸</span>;
const CreditCard = (props: any) => <span {...props}>💳</span>;
const Building2 = (props: any) => <span {...props}>🏦</span>;
const Upload = (props: any) => <span {...props}></span>;
const X = (props: any) => <span {...props}>✖️</span>;

// Validación de Luhn Algorithm
const validarLuhn = (numero: string) => {
  const digits = numero.replace(/\s/g, '').split('').reverse();
  let sum = 0;
  
  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i]);
    
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
  }
  
  return sum % 10 === 0;
};

// Formatear número de tarjeta
const formatearTarjeta = (valor: string) => {
  const numeros = valor.replace(/\s/g, '');
  const grupos = numeros.match(/.{1,4}/g);
  return grupos ? grupos.join(' ') : '';
};

// Detectar tipo de tarjeta
const detectarTipoTarjeta = (numero: string) => {
  const primerDigito = numero.charAt(0);
  if (primerDigito === '4') return 'Visa';
  if (primerDigito === '5') return 'Mastercard';
  if (primerDigito === '3') return 'Amex';
  return 'Tarjeta';
};

export default function CheckoutPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [datosReserva, setDatosReserva] = useState<any>(null);
  const [metodo_pago, setMetodoPago] = useState('tarjeta');
  
  // Estados para el formulario de tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [mesVencimiento, setMesVencimiento] = useState('');
  const [anioVencimiento, setAnioVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [mostrarCvv, setMostrarCvv] = useState(false);
  
  // Estados para validación
  const [erroresTarjeta, setErroresTarjeta] = useState<any>({});
  
  // Estado para transferencia
  const [comprobante, setComprobante] = useState<File | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }

    const reservaData = sessionStorage.getItem('reserva_checkout');
    if (reservaData) {
      setDatosReserva(JSON.parse(reservaData));
      setLoading(false);
    } else {
      router.push('/usuario/habitaciones');
    }
  }, []);

  const validarFormularioTarjeta = () => {
    const errores: any = {};
    
    // Validar número de tarjeta
    const numeroLimpio = numeroTarjeta.replace(/\s/g, '');
    if (!numeroLimpio) {
      errores.numero = 'El número de tarjeta es requerido';
    } else if (numeroLimpio.length < 13 || numeroLimpio.length > 19) {
      errores.numero = 'El número debe tener entre 13 y 19 dígitos';
    }
    // Validación de Luhn desactivada para demo
    // else if (!validarLuhn(numeroLimpio)) {
    //   errores.numero = 'Número de tarjeta inválido';
    // }
    
    // Validar nombre
    if (!nombreTitular.trim()) {
      errores.nombre = 'El nombre del titular es requerido';
    } else if (nombreTitular.trim().length < 3) {
      errores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar fecha de vencimiento
    if (!mesVencimiento || !anioVencimiento) {
      errores.vencimiento = 'La fecha de vencimiento es requerida';
    } else {
      const mes = parseInt(mesVencimiento);
      const anio = parseInt('20' + anioVencimiento);
      const ahora = new Date();
      const fechaVencimiento = new Date(anio, mes - 1);
      
      if (mes < 1 || mes > 12) {
        errores.vencimiento = 'Mes inválido';
      } else if (fechaVencimiento < ahora) {
        errores.vencimiento = 'La tarjeta está vencida';
      }
    }
    
    // Validar CVV
    if (!cvv) {
      errores.cvv = 'El CVV es requerido';
    } else if (cvv.length < 3 || cvv.length > 4) {
      errores.cvv = 'CVV inválido';
    }
    
    setErroresTarjeta(errores);
    return Object.keys(errores).length === 0;
  };

  const procesarPago = async () => {
    if (!datosReserva || !user) return;

    // Validar según método de pago
    if (metodo_pago === 'tarjeta' && !validarFormularioTarjeta()) {
      setError('Por favor, completa correctamente todos los campos de la tarjeta');
      return;
    }

    setProcesando(true);
    setError('');

    try {
      const payload = {
        ...datosReserva,
        id_usuario: user.id,
        pagar_ahora: true,
        metodo_pago,
        // Datos adicionales según el método
        ...(metodo_pago === 'tarjeta' && {
          datos_tarjeta: {
            ultimos_digitos: numeroTarjeta.slice(-4),
            tipo: detectarTipoTarjeta(numeroTarjeta.replace(/\s/g, '')),
            titular: nombreTitular
          }
        })
      };

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.removeItem('reserva_checkout');
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

  const handleNumeroTarjeta = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '').slice(0, 19);
    setNumeroTarjeta(formatearTarjeta(soloNumeros));
    if (erroresTarjeta.numero) {
      setErroresTarjeta({ ...erroresTarjeta, numero: '' });
    }
  };

  const handleMesVencimiento = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '').slice(0, 2);
    setMesVencimiento(soloNumeros);
    if (erroresTarjeta.vencimiento) {
      setErroresTarjeta({ ...erroresTarjeta, vencimiento: '' });
    }
  };

  const handleAnioVencimiento = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '').slice(0, 2);
    setAnioVencimiento(soloNumeros);
    if (erroresTarjeta.vencimiento) {
      setErroresTarjeta({ ...erroresTarjeta, vencimiento: '' });
    }
  };

  const handleCvv = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '').slice(0, 4);
    setCvv(soloNumeros);
    if (erroresTarjeta.cvv) {
      setErroresTarjeta({ ...erroresTarjeta, cvv: '' });
    }
  };

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprobante(e.target.files[0]);
    }
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
            className="px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-semibold"
          >
            Ver habitaciones
          </button>
        </div>
      </div>
    );
  }

  const dias = calcularDias();
  const tipoTarjeta = detectarTipoTarjeta(numeroTarjeta.replace(/\s/g, ''));

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
            <span>Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Completar Pago</h1>
          <p className="text-gray-600 mt-2">Un paso más para confirmar tu estadía</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Método de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selector de método */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Método de Pago
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    metodo_pago === 'tarjeta'
                      ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      metodo_pago === 'tarjeta' ? 'bg-[#7B1D26]' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`w-7 h-7 ${
                        metodo_pago === 'tarjeta' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">
                        Tarjeta
                      </p>
                      <p className="text-sm text-gray-600">
                        Crédito/Débito
                      </p>
                    </div>
                    {metodo_pago === 'tarjeta' && (
                      <Check className="w-5 h-5 text-[#7B1D26]" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setMetodoPago('transferencia')}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    metodo_pago === 'transferencia'
                      ? 'border-[#7B1D26] bg-[#7B1D26]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      metodo_pago === 'transferencia' ? 'bg-[#7B1D26]' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-7 h-7 ${
                        metodo_pago === 'transferencia' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">
                        Transferencia
                      </p>
                      <p className="text-sm text-gray-600">
                        Bancaria
                      </p>
                    </div>
                    {metodo_pago === 'transferencia' && (
                      <Check className="w-5 h-5 text-[#7B1D26]" />
                    )}
                  </div>
                </button>
              </div>

              {/* Formulario de Tarjeta */}
              {metodo_pago === 'tarjeta' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Tarjeta 3D */}
                  <div className="relative h-56 perspective-1000">
                    <div 
                      className={`w-full h-full transition-transform duration-500 transform-style-3d ${
                        mostrarCvv ? 'rotate-y-180' : ''
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Frente de la tarjeta */}
                      <div 
                        className="absolute w-full h-full backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-[#7B1D26] via-[#CA99AB] to-[#D4AF37] rounded-2xl p-6 text-white shadow-2xl">
                          <div className="flex justify-between items-start mb-8">
                            <div className="w-12 h-12 bg-yellow-400/30 rounded-lg"></div>
                            <span className="text-sm font-semibold">{tipoTarjeta}</span>
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-2xl font-mono tracking-wider">
                              {numeroTarjeta || '•••• •••• •••• ••••'}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs opacity-70 mb-1">Titular</p>
                              <p className="font-semibold uppercase">
                                {nombreTitular || 'NOMBRE APELLIDO'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70 mb-1">Vence</p>
                              <p className="font-semibold">
                                {mesVencimiento && anioVencimiento 
                                  ? `${mesVencimiento}/${anioVencimiento}` 
                                  : 'MM/AA'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dorso de la tarjeta */}
                      <div 
                        className="absolute w-full h-full backface-hidden rotate-y-180"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-[#CA99AB] via-[#7B1D26] to-[#895A49] rounded-2xl text-white shadow-2xl">
                          <div className="w-full h-12 bg-black/50 mt-6"></div>
                          <div className="px-6 mt-6">
                            <div className="bg-white/90 rounded p-2 text-right">
                              <span className="text-black font-mono text-lg">
                                {cvv || '•••'}
                              </span>
                            </div>
                            <p className="text-xs mt-2 opacity-70">CVV</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campos del formulario */}
                  <div className="space-y-4">
                    {/* Número de tarjeta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={numeroTarjeta}
                          onChange={(e) => handleNumeroTarjeta(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            erroresTarjeta.numero
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#7B1D26] focus:ring-[#7B1D26]/20'
                          }`}
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                      </div>
                      {erroresTarjeta.numero && (
                        <p className="text-red-500 text-sm mt-1">{erroresTarjeta.numero}</p>
                      )}
                    </div>

                    {/* Nombre del titular */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Titular
                      </label>
                      <input
                        type="text"
                        value={nombreTitular}
                        onChange={(e) => {
                          setNombreTitular(e.target.value.toUpperCase());
                          if (erroresTarjeta.nombre) {
                            setErroresTarjeta({ ...erroresTarjeta, nombre: '' });
                          }
                        }}
                        placeholder="JUAN PÉREZ"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 uppercase transition-colors ${
                          erroresTarjeta.nombre
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-[#7B1D26] focus:ring-[#7B1D26]/20'
                        }`}
                      />
                      {erroresTarjeta.nombre && (
                        <p className="text-red-500 text-sm mt-1">{erroresTarjeta.nombre}</p>
                      )}
                    </div>

                    {/* Fecha y CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Vencimiento
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={mesVencimiento}
                            onChange={(e) => handleMesVencimiento(e.target.value)}
                            placeholder="MM"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-center transition-colors ${
                              erroresTarjeta.vencimiento
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-[#7B1D26] focus:ring-[#7B1D26]/20'
                            }`}
                            maxLength={2}
                          />
                          <span className="flex items-center text-gray-500">/</span>
                          <input
                            type="text"
                            value={anioVencimiento}
                            onChange={(e) => handleAnioVencimiento(e.target.value)}
                            placeholder="AA"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-center transition-colors ${
                              erroresTarjeta.vencimiento
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-[#7B1D26] focus:ring-[#7B1D26]/20'
                            }`}
                            maxLength={2}
                          />
                        </div>
                        {erroresTarjeta.vencimiento && (
                          <p className="text-red-500 text-sm mt-1">{erroresTarjeta.vencimiento}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => handleCvv(e.target.value)}
                          onFocus={() => setMostrarCvv(true)}
                          onBlur={() => setMostrarCvv(false)}
                          placeholder="123"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-center transition-colors ${
                            erroresTarjeta.cvv
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#7B1D26] focus:ring-[#7B1D26]/20'
                          }`}
                          maxLength={4}
                        />
                        {erroresTarjeta.cvv && (
                          <p className="text-red-500 text-sm mt-1">{erroresTarjeta.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transferencia Bancaria */}
              {metodo_pago === 'transferencia' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 text-lg mb-4">
                      Datos para Transferencia
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-blue-700 font-medium">Banco:</span>
                        <span className="text-blue-900 font-semibold">Banco Nación</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-blue-700 font-medium">Titular:</span>
                        <span className="text-blue-900 font-semibold">Hotel Rosalinda S.A.</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-blue-700 font-medium">CBU:</span>
                        <span className="text-blue-900 font-mono font-semibold">0110123456789012345678</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-blue-700 font-medium">Alias:</span>
                        <span className="text-blue-900 font-semibold">HOTEL.ROSALINDA</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-blue-700 font-medium">CUIT:</span>
                        <span className="text-blue-900 font-mono font-semibold">30-12345678-9</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6">
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Instrucciones:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
                      <li>Realiza la transferencia por el monto total</li>
                      <li>Incluye tu número de reserva en el concepto</li>
                      <li>Sube el comprobante a continuación (opcional)</li>
                      <li>Validaremos tu pago en 24-48 horas</li>
                    </ol>
                  </div>

                  {/* Upload comprobante */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comprobante de Transferencia (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#7B1D26] transition-colors">
                      {comprobante ? (
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">{comprobante.name}</span>
                          </div>
                          <button
                            onClick={() => setComprobante(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            Haz clic para subir o arrastra el archivo
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG o PDF (máx. 5MB)
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleComprobanteChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Seguridad */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 text-lg mb-1">
                    Pago Seguro
                  </h3>
                  <p className="text-sm text-green-800">
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
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6 border-2 border-[#D4AF37]/30">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Resumen de Reserva
              </h3>

              <div className="space-y-4 mb-6">
                {/* Habitación */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {datosReserva.habitacion_numero}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Habitación</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {datosReserva.habitacion_tipo}
                    </p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(datosReserva.fecha_inicio).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(datosReserva.fecha_fin).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Huéspedes:</span>
                    <span className="font-semibold text-gray-800">
                      {datosReserva.numero_huespedes}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Habitación ({dias} {dias === 1 ? 'noche' : 'noches'})</span>
                    <span className="text-gray-800">
                      ${datosReserva.desglose?.habitacion?.toLocaleString()}
                    </span>
                  </div>

                  {datosReserva.desglose?.servicios > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Servicios</span>
                      <span className="text-gray-800">
                        ${datosReserva.desglose.servicios.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.spa > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Spa</span>
                      <span className="text-gray-800">
                        ${datosReserva.desglose.spa.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.actividades > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Actividades</span>
                      <span className="text-gray-800">
                        ${datosReserva.desglose.actividades.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.paquetes > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Paquetes</span>
                      <span className="text-gray-800">
                        ${datosReserva.desglose.paquetes.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {datosReserva.desglose?.restaurante > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Restaurante</span>
                      <span className="text-gray-800">
                        ${datosReserva.desglose.restaurante.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 text-lg">
                      Total a Pagar
                    </span>
                    <span className="text-3xl font-bold text-[#7B1D26]">
                      ${datosReserva.precio_total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={procesarPago}
                disabled={procesando}
                className="w-full bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesando ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </span>
                ) : (
                  `Confirmar y Pagar ${datosReserva.precio_total?.toLocaleString()}`
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}