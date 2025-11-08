// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Flower } from '@/components/icons/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ email: false, password: false });
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(data.redirectPath);
      } else {
        setError(data.message);
        if (data.message.toLowerCase().includes('email') || data.message.toLowerCase().includes('usuario')) {
          setFieldErrors({ email: true, password: false });
        } else if (data.message.toLowerCase().includes('contraseña')) {
          setFieldErrors({ email: false, password: true });
        } else {
          setFieldErrors({ email: true, password: true });
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setFieldErrors({ email: true, password: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFF8F0]">
      {/* Fondo con imagen de flores */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/fondo-flores.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#E4CDDD]/80 via-[#CA99AB]/70 to-[#895A49]/80 backdrop-blur-sm"></div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#D4AF37]/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-[#7B1D26]/20 blur-3xl"></div>
      
      {/* Patrón de ondas japonesas */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="#7B1D26" strokeWidth="1" fill="none"/>
              <path d="M0 70 Q 25 45, 50 70 T 100 70" stroke="#7B1D26" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)"/>
        </svg>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 border border-[#D4AF37]/30">
          
          {/* Panel izquierdo - Branding */}
          <div className="bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 border-4 border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 border-4 border-white/20"></div>
            
            <div className="absolute top-10 left-10">
              <Flower className="w-12 h-12 text-white/20 animate-pulse" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Flower className="w-16 h-16 text-white/20 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8 inline-block">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-6 border-4 border-white/30 shadow-2xl">
                  <img
                    src="/images/logo-hotel.png"
                    alt="The Rose Garden Hotel Logo"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
              </div>

              <h1 className="font-playfair text-5xl font-bold mb-2 tracking-wide text-shadow-lg">
                The Rose Garden
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-white to-white rounded-full"></div>
                <Flower className="w-6 h-6 text-[#D4AF37]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-white via-white to-transparent rounded-full"></div>
              </div>
              
              <h2 className="font-cormorant text-3xl font-semibold mb-6 italic">Hotel & Spa</h2>
              <p className="text-white/90 font-inter text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                Experimenta la elegancia asiática fusionada con el lujo contemporáneo
              </p>

              <div className="space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Habitaciones de lujo</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Spa y tratamientos orientales</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Flower className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-inter text-sm">Gastronomía internacional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="p-12 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center shadow-lg border-4 border-[#D4AF37]/30">
                  <Flower className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-2">Bienvenido</h3>
              <p className="font-inter text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-[#895A49]'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border text-gray-700 rounded-xl shadow-sm font-inter
                             placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                             ${fieldErrors.email 
                               ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                               : 'border-[#E4CDDD] focus:ring-[#CA99AB] focus:border-[#CA99AB]'}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFieldErrors({ ...fieldErrors, email: false });
                    }}
                    placeholder="tu@email.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-inter">Por favor verifica tu correo electrónico</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-[#895A49]'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className={`block w-full pl-10 pr-12 py-3 border text-gray-700 rounded-xl shadow-sm font-inter
                             placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                             ${fieldErrors.password 
                               ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                               : 'border-[#E4CDDD] focus:ring-[#CA99AB] focus:border-[#CA99AB]'}`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setFieldErrors({ ...fieldErrors, password: false });
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#895A49] transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-[#895A49] transition-colors" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-inter">Por favor verifica tu contraseña</p>
                )}
              </div>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-inter">{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3 px-4 rounded-xl font-cormorant font-semibold text-lg
                         overflow-hidden transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-[1.02] active:scale-[0.98]
                         bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white
                         shadow-lg hover:shadow-xl border-2 border-[#D4AF37]/50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <Flower className="w-5 h-5" />
                      Ingresar
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Registro link */}
            <div className="mt-6 text-center">
              <p className="font-inter text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  href="/register" 
                  className="font-cormorant font-semibold text-[#7B1D26] hover:text-[#CA99AB] transition-colors underline decoration-[#D4AF37]"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center pt-6 border-t border-[#E4CDDD]">
              <p className="font-inter text-xs text-gray-500">
                © 2025 The Rose Garden Hotel - Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}