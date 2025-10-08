'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Flower = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c-1.1 0-2-.9-2-2v-2.17c-1.17-.41-2.2-1.09-3.07-1.97l-1.53.88c-.95.55-2.17.22-2.72-.73-.55-.95-.22-2.17.73-2.72l1.53-.88c-.29-.96-.46-1.96-.46-3 0-1.04.17-2.04.46-3l-1.53-.88c-.95-.55-1.28-1.77-.73-2.72.55-.95 1.77-1.28 2.72-.73l1.53.88c.87-.88 1.9-1.56 3.07-1.97V2c0-1.1.9-2 2-2s2 .9 2 2v2.17c1.17.41 2.2 1.09 3.07 1.97l1.53-.88c.95-.55 2.17-.22 2.72.73.55.95.22 2.17-.73 2.72l-1.53.88c.29.96.46 1.96.46 3 0 1.04-.17 2.04-.46 3l1.53.88c.95.55 1.28 1.77.73 2.72-.55.95-1.77 1.28-2.72.73l-1.53-.88c-.87.88-1.9 1.56-3.07 1.97V20c0 1.1-.9 2-2 2zm0-8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ nombre: false, email: false, password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ nombre: false, email: false, password: false, confirmPassword: false });
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setFieldErrors({ ...fieldErrors, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message);
        if (data.message.toLowerCase().includes('email')) {
          setFieldErrors({ ...fieldErrors, email: true });
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con imagen de flores */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB]"
        style={{
          backgroundImage: 'url(/images/fondo-flores.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-[#7B1D26]/70 to-[#CA99AB]/70"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Panel izquierdo - Formulario */}
          <div className="p-12 flex flex-col justify-center bg-white order-2 md:order-1">
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center shadow-lg border-2 border-[#D4AF37]/30">
                  <Flower className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">Crear Cuenta</h3>
              <p className="font-inter text-gray-500 text-sm">Únete a nuestra comunidad exclusiva</p>
            </div>

            {success ? (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded flex items-center mb-4 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold font-inter">¡Registro exitoso!</p>
                  <p className="text-sm font-inter">Redirigiendo al inicio de sesión...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${fieldErrors.nombre ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="nombre"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border text-gray-700 rounded-lg shadow-sm font-inter
                               placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                               ${fieldErrors.nombre 
                                 ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                                 : 'border-gray-300 focus:ring-[#CA99AB] focus:border-transparent'}`}
                      value={formData.nombre}
                      onChange={(e) => {
                        setFormData({ ...formData, nombre: e.target.value });
                        setFieldErrors({ ...fieldErrors, nombre: false });
                      }}
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border text-gray-700 rounded-lg shadow-sm font-inter
                               placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                               ${fieldErrors.email 
                                 ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                                 : 'border-gray-300 focus:ring-[#CA99AB] focus:border-transparent'}`}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setFieldErrors({ ...fieldErrors, email: false });
                      }}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600 font-inter">Este email ya está registrado</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      minLength={6}
                      className={`block w-full pl-10 pr-12 py-3 border text-gray-700 rounded-lg shadow-sm font-inter
                               placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                               ${fieldErrors.password 
                                 ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                                 : 'border-gray-300 focus:ring-[#CA99AB] focus:border-transparent'}`}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setFieldErrors({ ...fieldErrors, password: false });
                      }}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      className={`block w-full pl-10 pr-12 py-3 border text-gray-700 rounded-lg shadow-sm font-inter
                               placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                               ${fieldErrors.confirmPassword 
                                 ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                                 : 'border-gray-300 focus:ring-[#CA99AB] focus:border-transparent'}`}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setFieldErrors({ ...fieldErrors, confirmPassword: false });
                      }}
                      placeholder="Repite tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-inter">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-3 px-4 rounded-lg font-cormorant font-semibold text-base
                           overflow-hidden transition-all duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] p-[2px]">
                    <span className="absolute inset-[2px] rounded-lg bg-white group-hover:bg-transparent transition-all duration-300"></span>
                  </span>
                  
                  <span className="absolute inset-0 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                  
                  <span className="relative z-10 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                  </span>
                </button>
              </form>
            )}

            {/* Link a login */}
            <div className="mt-6 text-center">
              <p className="font-inter text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  href="/login" 
                  className="font-cormorant font-semibold text-[#7B1D26] hover:text-[#CA99AB] transition-colors underline decoration-[#D4AF37]"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="font-inter text-xs text-gray-500">
                Al registrarte aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>

          {/* Panel derecho - Branding */}
          <div className="bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] p-12 flex flex-col justify-center items-center text-white relative overflow-hidden order-1 md:order-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8 inline-block">
                <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-5 border-4 border-[#D4AF37]/50">
                  <img
                    src="/images/logo-hotel.png"
                    alt="The Rose Garden Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h1 className="font-playfair text-5xl font-bold mb-4 tracking-tight">The Rose Garden</h1>
              <div className="w-20 h-1 bg-[#D4AF37]/70 mx-auto mb-6 rounded-full"></div>
              
              <h2 className="font-cormorant text-2xl font-semibold mb-4 italic">Hotel & Spa</h2>
              <p className="font-inter text-white/90 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                Únete a nuestra familia y disfruta de beneficios exclusivos
              </p>

              <div className="space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Descuentos especiales para miembros</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Reservas prioritarias</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Acceso a eventos exclusivos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}