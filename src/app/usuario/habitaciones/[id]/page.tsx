// src/app/usuario/habitaciones/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Habitacion } from '@/types';
import { 
  Users, Star, ChevronLeft, Calendar, Check, 
  Wifi, Coffee, Droplet, Dumbbell, Flower 
} from '@/components/icons/Icons';

// Mapeo de imágenes por tipo
const galeriaImagenes: Record<string, string[]> = {
  simple: [
    '/images/habitacion-hotel.jpeg',
    '/images/habitacion-hotel2.jpeg',
    '/images/habitacion-hotel3.jpeg'
  ],
  doble: [
    '/images/habitacion-hotel2.jpeg',
    '/images/habitacion-hotel.jpeg',
    '/images/habitacion-hotel3.jpeg'
  ],
  suite: [
    '/images/habitacion-hotel3.jpeg',
    '/images/habitacion-hotel.jpeg',
    '/images/habitacion-hotel2.jpeg'
  ],
  deluxe: [
    '/images/habitacion-hotel.jpeg',
    '/images/habitacion-hotel3.jpeg',
    '/images/habitacion-hotel2.jpeg'
  ]
};

export default function HabitacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    if (params.id) {
      cargarHabitacion(params.id as string);
    }
  }, [params.id]);

  const cargarHabitacion = async (id: string) => {
    try {
      const response = await fetch(`/api/habitaciones/${id}`);
      const data = await response.json();

      if (data.success) {
        setHabitacion(data.habitacion);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
          <p className="font-inter text-gray-600">Cargando habitación...</p>
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
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold hover:shadow-lg transition-all"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const precio = typeof habitacion.precio === 'string' 
    ? parseFloat(habitacion.precio) 
    : habitacion.precio;

  const imagenes = galeriaImagenes[habitacion.tipo] || galeriaImagenes.simple;

  const amenidades = [
    { icon: Wifi, text: 'WiFi de alta velocidad' },
    { icon: Coffee, text: 'Cafetera y minibar' },
    { icon: Droplet, text: 'Baño privado con amenidades' },
    { icon: Dumbbell, text: 'Acceso al gimnasio' }
  ];

  const caracteristicas = [
    { icon: Check, text: `Capacidad: ${habitacion.cantidad_personas} ${habitacion.cantidad_personas === 1 ? 'persona' : 'personas'}` },
    { icon: Check, text: 'TV LED 42" con cable' },
    { icon: Check, text: 'Aire acondicionado/calefacción' },
    { icon: Check, text: 'Caja de seguridad' },
    { icon: Check, text: 'Escritorio de trabajo' },
    { icon: Check, text: 'Room service 24hs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header con breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#7B1D26] transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-inter">Volver</span>
          </button>
          <div className="flex items-center space-x-2 text-sm font-inter">
            <Link href="/usuario/dashboard" className="text-gray-500 hover:text-[#7B1D26]">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/usuario/habitaciones" className="text-gray-500 hover:text-[#7B1D26]">
              Habitaciones
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">Habitación {habitacion.numero_habitaciones}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Galería de imágenes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Imagen principal */}
          <div className="lg:col-span-2 h-96 lg:h-[500px] relative rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={imagenes[imagenActiva]}
              alt={`Habitación ${habitacion.numero_habitaciones}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badge de estado */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-sm font-inter font-semibold ${
                habitacion.estado === 'disponible' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : habitacion.estado === 'reservado'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              }`}>
                {habitacion.estado === 'disponible' ? 'Disponible' : 
                 habitacion.estado === 'reservado' ? 'Reservado' : 'Mantenimiento'}
              </span>
            </div>

            {/* Calificación */}
            {habitacion.promedioCalificacion && habitacion.promedioCalificacion > 0 && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Star className="w-5 h-5 text-[#D4AF37]" filled />
                <span className="font-inter text-lg font-bold text-gray-800">
                  {habitacion.promedioCalificacion.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4">
            {imagenes.map((img, index) => (
              <button
                key={index}
                onClick={() => setImagenActiva(index)}
                className={`h-32 rounded-xl overflow-hidden transition-all ${
                  imagenActiva === index 
                    ? 'ring-4 ring-[#7B1D26] scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Detalles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <span className="font-inter text-sm text-[#CA99AB] uppercase tracking-wide font-semibold">
                {habitacion.tipo}
              </span>
              <h1 className="font-playfair text-4xl font-bold text-gray-800 mt-2 mb-4">
                Habitación {habitacion.numero_habitaciones}
              </h1>
              <p className="font-inter text-gray-600 text-lg leading-relaxed">
                {habitacion.descripcion}
              </p>
            </div>

            {/* Características */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                Características
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caracteristicas.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-[#7B1D26] flex-shrink-0 mt-0.5" />
                      <span className="font-inter text-gray-700">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenidades */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                Amenidades Incluidas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {amenidades.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-inter text-gray-700">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comentarios */}
            {habitacion.comentarios && habitacion.comentarios.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                  Comentarios de Huéspedes
                </h2>
                <div className="space-y-6">
                  {habitacion.comentarios.slice(0, 3).map((comentario) => (
                    <div key={comentario.id_comentarios} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-cormorant font-semibold text-gray-800">
                          {comentario.usuario.nombre}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-[#D4AF37]"
                              filled={i < comentario.calificacion}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-inter text-gray-600 text-sm">
                        {comentario.contenido}
                      </p>
                      <span className="font-inter text-xs text-gray-400 mt-2 block">
                        {new Date(comentario.fecha).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Card de reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-2xl sticky top-6 border-2 border-[#D4AF37]/30">
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <span className="font-inter text-gray-600">Desde</span>
                <div className="flex items-baseline justify-center space-x-2 mt-2">
                  <span className="font-playfair text-5xl font-bold text-[#7B1D26]">
                    ${precio.toLocaleString()}
                  </span>
                  <span className="font-inter text-gray-500">/noche</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="w-5 h-5 text-[#895A49]" />
                  <span className="font-inter">
                    Hasta {habitacion.cantidad_personas} {habitacion.cantidad_personas === 1 ? 'persona' : 'personas'}
                  </span>
                </div>

                {habitacion.estado === 'disponible' ? (
                  <>
                    <Link
                      href={`/usuario/reservas/nueva?habitacion=${habitacion.id_habitaciones}`}
                      className="block w-full text-center bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-lg font-cormorant font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Reservar Ahora
                    </Link>
                    <p className="text-center font-inter text-xs text-gray-500">
                      Confirmación inmediata • Cancela gratis hasta 24hs antes
                    </p>
                  </>
                ) : (
                  <div className="bg-gray-100 text-center py-4 rounded-lg">
                    <p className="font-inter text-gray-600 font-semibold">
                      {habitacion.estado === 'reservado' 
                        ? 'Habitación no disponible' 
                        : 'En mantenimiento'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-cormorant font-semibold text-gray-800 mb-3">
                  ¿Necesitas ayuda?
                </h3>
                <Link
                  href="/usuario/consultas"
                  className="block w-full text-center border-2 border-[#7B1D26] text-[#7B1D26] hover:bg-[#7B1D26] hover:text-white py-3 rounded-lg font-inter font-semibold transition-all duration-300"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}