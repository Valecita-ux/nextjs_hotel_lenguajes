// src/app/usuario/perfil/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Mail, Lock, Calendar, MessageSquare, 
  Bed, Star, Check, AlertCircle, Eye, EyeOff, Flower 
} from '@/components/icons/Icons';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  
  // Estados para formularios
  const [formDatos, setFormDatos] = useState({ nombre: '', correo: '' });
  const [formPassword, setFormPassword] = useState({
    contraseñaActual: '',
    contraseñaNueva: '',
    confirmarNueva: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      cargarPerfil(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, []);

  const cargarPerfil = async (userId: number) => {
    try {
      const response = await fetch(`/api/usuario/perfil?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setPerfil(data.usuario);
        setFormDatos({
          nombre: data.usuario.nombre,
          correo: data.usuario.correo
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/usuario/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formDatos
        })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar localStorage
        const updatedUser = { ...user, nombre: data.usuario.nombre, email: data.usuario.correo };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setPerfil({ ...perfil, nombre: data.usuario.nombre, correo: data.usuario.correo });
        setSuccess('Datos actualizados exitosamente');
        setEditando(false);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al actualizar los datos');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (formPassword.contraseñaNueva !== formPassword.confirmarNueva) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/usuario/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          contraseñaActual: formPassword.contraseñaActual,
          contraseñaNueva: formPassword.contraseñaNueva
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Contraseña actualizada exitosamente');
        setFormPassword({ contraseñaActual: '', contraseñaNueva: '', confirmarNueva: '' });
        setCambiandoPassword(false);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al cambiar la contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
          <p className="font-inter text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-inter text-gray-600">Error al cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <span className="font-playfair text-4xl font-bold text-white">
                {getInitials(perfil.nombre)}
              </span>
            </div>
            <div>
              <h1 className="font-playfair text-5xl font-bold mb-2">{perfil.nombre}</h1>
              <p className="font-inter text-xl text-white/90">{perfil.correo}</p>
              <span className="inline-block mt-2 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-inter">
                Miembro desde {new Date(perfil.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mensajes de éxito/error globales */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-inter">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-6">
                Mis Estadísticas
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                      <Bed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-gray-500">Total Reservas</p>
                      <p className="font-playfair text-2xl font-bold text-[#7B1D26]">
                        {perfil.estadisticas.totalReservas}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-gray-500">Reservas Activas</p>
                      <p className="font-playfair text-2xl font-bold text-blue-700">
                        {perfil.estadisticas.reservasActivas}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-gray-500">Consultas</p>
                      <p className="font-playfair text-2xl font-bold text-purple-700">
                        {perfil.estadisticas.totalConsultas}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-gray-500">Comentarios</p>
                      <p className="font-playfair text-2xl font-bold text-yellow-700">
                        {perfil.estadisticas.totalComentarios}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-2xl p-6 shadow-lg text-white">
              <Flower className="w-10 h-10 text-[#D4AF37] mb-3" />
              <h3 className="font-playfair text-lg font-bold mb-2">
                Beneficios de Miembro
              </h3>
              <ul className="space-y-2 font-inter text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Check-in prioritario</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Late check-out gratuito</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>10% descuento en spa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editar datos personales */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] p-6">
                <h2 className="font-playfair text-2xl font-bold text-white flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <span>Datos Personales</span>
                </h2>
              </div>

              <div className="p-6">
                {!editando ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-inter text-sm text-gray-500 mb-1">Nombre</label>
                      <p className="font-cormorant text-lg text-gray-800">{perfil.nombre}</p>
                    </div>
                    <div>
                      <label className="block font-inter text-sm text-gray-500 mb-1">Email</label>
                      <p className="font-inter text-lg text-gray-800">{perfil.correo}</p>
                    </div>
                    <button
                      onClick={() => setEditando(true)}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white rounded-lg font-cormorant font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Editar Información
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleActualizarDatos} className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        minLength={3}
                        value={formDatos.nombre}
                        onChange={(e) => setFormDatos({ ...formDatos, nombre: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formDatos.correo}
                        onChange={(e) => setFormDatos({ ...formDatos, correo: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-inter">{error}</span>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold disabled:opacity-50"
                      >
                        {submitting ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditando(false);
                          setFormDatos({ nombre: perfil.nombre, correo: perfil.correo });
                          setError('');
                        }}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-inter font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#895A49] to-[#7B1D26] p-6">
                <h2 className="font-playfair text-2xl font-bold text-white flex items-center space-x-3">
                  <Lock className="w-6 h-6" />
                  <span>Seguridad</span>
                </h2>
              </div>

              <div className="p-6">
                {!cambiandoPassword ? (
                  <div>
                    <p className="font-inter text-gray-600 mb-4">
                      Mantén tu cuenta segura actualizando tu contraseña regularmente
                    </p>
                    <button
                      onClick={() => setCambiandoPassword(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#895A49] to-[#7B1D26] hover:from-[#7B1D26] hover:to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCambiarPassword} className="space-y-4">
                    {/* Contraseña actual */}
                    <div>
                      <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.actual ? "text" : "password"}
                          required
                          value={formPassword.contraseñaActual}
                          onChange={(e) => setFormPassword({ ...formPassword, contraseñaActual: e.target.value })}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, actual: !showPasswords.actual })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.actual ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                      <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.nueva ? "text" : "password"}
                          required
                          minLength={6}
                          value={formPassword.contraseñaNueva}
                          onChange={(e) => setFormPassword({ ...formPassword, contraseñaNueva: e.target.value })}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, nueva: !showPasswords.nueva })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.nueva ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar nueva contraseña */}
                    <div>
                      <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirmar ? "text" : "password"}
                          required
                          minLength={6}
                          value={formPassword.confirmarNueva}
                          onChange={(e) => setFormPassword({ ...formPassword, confirmarNueva: e.target.value })}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirmar ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-inter">{error}</span>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#895A49] to-[#7B1D26] text-white rounded-lg font-cormorant font-semibold disabled:opacity-50"
                      >
                        {submitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCambiandoPassword(false);
                          setFormPassword({ contraseñaActual: '', contraseñaNueva: '', confirmarNueva: '' });
                          setError('');
                        }}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-inter font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}