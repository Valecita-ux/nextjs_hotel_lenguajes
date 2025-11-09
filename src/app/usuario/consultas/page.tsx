// src/app/usuario/consultas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, MessageSquare, Check, AlertCircle, Flower, Lock 
} from '@/components/icons/Icons';

interface Consulta {
  id_consulta: number;
  asunto: string;
  mensaje: string;
  fecha_consulta: string;
  respuesta: string | null;
  fecha_respuesta: string | null;
  estado: string;
  usuario: {
    nombre: string;
    correo: string;
  };
}

export default function ConsultasPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    asunto: '',
    mensaje: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      cargarConsultas(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, []);

  const cargarConsultas = async (userId: number) => {
    try {
      const response = await fetch(`/api/consultas?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setConsultas(data.consultas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ asunto: '', mensaje: '' });
        // Recargar consultas
        cargarConsultas(user.id);
        
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al enviar la consulta');
    } finally {
      setSubmitting(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'respondido') {
      return { 
        text: 'Respondida', 
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: Check
      };
    }
    return { 
      text: 'Pendiente', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Lock
    };
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <MessageSquare className="w-16 h-16 text-[#D4AF37] mb-4 animate-pulse" />
          <h1 className="font-playfair text-5xl font-bold mb-4">Consultas</h1>
          <p className="font-inter text-xl text-white/90 max-w-2xl">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de nueva consulta */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-gray-800">
                    Nueva Consulta
                  </h2>
                  <p className="font-inter text-sm text-gray-500">
                    Completa el formulario y te responderemos a la brevedad
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asunto */}
                <div>
                  <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    required
                    minLength={5}
                    maxLength={200}
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    placeholder="¿Sobre qué quieres consultar?"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500 font-inter">
                    Mínimo 5 caracteres
                  </p>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={6}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Escribe tu consulta de forma detallada..."
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500 font-inter">
                    {formData.mensaje.length}/1000 caracteres
                  </p>
                </div>

                {/* Success message */}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-start">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-inter">
                      ¡Consulta enviada exitosamente! Te responderemos pronto.
                    </span>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-inter">{error}</span>
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-xl font-cormorant font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Enviar Consulta</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de contacto */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#D4AF37]/30">
              <Flower className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-inter text-sm text-gray-500 mb-1">Email</p>
                  <a 
                    href="mailto:info@rosegardenhotel.com" 
                    className="font-inter text-[#7B1D26] hover:text-[#CA99AB] transition-colors"
                  >
                    info@rosegardenhotel.com
                  </a>
                </div>

                <div>
                  <p className="font-inter text-sm text-gray-500 mb-1">Teléfono</p>
                  <a 
                    href="tel:+5493874123456" 
                    className="font-inter text-gray-800"
                  >
                    +54 9 387 412-3456
                  </a>
                </div>

                <div>
                  <p className="font-inter text-sm text-gray-500 mb-1">WhatsApp</p>
                  <a 
                    href="https://wa.me/5493874123456" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-[#7B1D26] hover:text-[#CA99AB] transition-colors"
                  >
                    +54 9 387 412-3456
                  </a>
                </div>

                <div>
                  <p className="font-inter text-sm text-gray-500 mb-1">Horario de atención</p>
                  <p className="font-inter text-gray-800">Lunes a Domingo</p>
                  <p className="font-inter text-gray-800">24 horas</p>
                </div>
              </div>
            </div>

            {/* Card de tiempo de respuesta */}
            <div className="bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 rounded-2xl p-6 border border-[#CA99AB]/20">
              <Lock className="w-10 h-10 text-[#7B1D26] mb-3" />
              <h4 className="font-cormorant text-lg font-semibold text-gray-800 mb-2">
                Tiempo de Respuesta
              </h4>
              <p className="font-inter text-sm text-gray-700">
                Nuestro equipo responde consultas en un plazo máximo de 24 horas hábiles.
              </p>
            </div>
          </div>
        </div>

        {/* Historial de consultas */}
        <div className="mt-12">
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">
            Mis Consultas Anteriores
          </h2>

          {consultas.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="font-inter text-gray-600">
                No tienes consultas anteriores
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {consultas.map((consulta) => {
                const badge = getEstadoBadge(consulta.estado);
                const IconEstado = badge.icon;

                return (
                  <div
                    key={consulta.id_consulta}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-inter font-semibold border ${badge.className}`}>
                              <IconEstado className="w-3 h-3" />
                              <span>{badge.text}</span>
                            </span>
                            <span className="font-inter text-xs text-gray-500">
                              Consulta #{consulta.id_consulta}
                            </span>
                          </div>
                          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                            {consulta.asunto}
                          </h3>
                          <p className="font-inter text-sm text-gray-500">
                            Enviada el {new Date(consulta.fecha_consulta).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Mensaje */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-inter text-sm font-semibold text-gray-700 mb-2">
                          Tu consulta:
                        </p>
                        <p className="font-inter text-gray-700 whitespace-pre-wrap">
                          {consulta.mensaje}
                        </p>
                      </div>

                      {/* Respuesta */}
                      {consulta.respuesta && (
                        <div className="bg-gradient-to-br from-[#7B1D26]/5 to-[#CA99AB]/5 rounded-xl p-4 border border-[#CA99AB]/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <p className="font-inter text-sm font-semibold text-gray-700">
                              Respuesta del equipo:
                            </p>
                          </div>
                          <p className="font-inter text-gray-700 whitespace-pre-wrap mb-2">
                            {consulta.respuesta}
                          </p>
                          <p className="font-inter text-xs text-gray-500">
                            Respondida el {new Date(consulta.fecha_respuesta!).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}