// components/habitaciones/HabitacionCard.tsx
'use client';

import Link from 'next/link';
import { Habitacion } from '@/types';
import { Users, Star } from '@/components/icons/Icons';

interface HabitacionCardProps {
  habitacion: Habitacion;
}

// Imágenes por tipo de habitación
const imagenesPorTipo: Record<string, string> = {
  simple: '/images/habitacion-simple.jpeg',
  doble: '/images/habitacion-doble.jpeg',
  suite: '/images/habitacion-suite.jpeg',
  deluxe: '/images/habitacion-deluxe.jpeg'
};

// Badges de estado
const estadoBadge: Record<string, { text: string; className: string }> = {
  disponible: { 
    text: 'Disponible', 
    className: 'bg-green-100 text-green-800 border-green-300' 
  },
  reservado: { 
    text: 'Reservado', 
    className: 'bg-red-100 text-red-800 border-red-300' 
  },
  mantenimiento: { 
    text: 'Mantenimiento', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
  }
};

export default function HabitacionCard({ habitacion }: HabitacionCardProps) {
  const precio = typeof habitacion.precio === 'string' 
    ? parseFloat(habitacion.precio) 
    : habitacion.precio;

  const imagen = imagenesPorTipo[habitacion.tipo] || imagenesPorTipo.simple;
  const badge = estadoBadge[habitacion.estado] || estadoBadge.disponible;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imagen} 
          alt={habitacion.tipo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold border ${badge.className}`}>
            {badge.text}
          </span>
        </div>

        {/* Precio */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <span className="font-cormorant font-bold text-[#7B1D26] text-lg">
            ${precio.toLocaleString()}
          </span>
          <span className="font-inter text-xs text-gray-600">/noche</span>
        </div>

        {/* Calificación */}
        {habitacion.promedioCalificacion && habitacion.promedioCalificacion > 0 && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <Star className="w-4 h-4 text-[#D4AF37]" filled />
            <span className="font-inter text-sm font-semibold text-gray-800">
              {habitacion.promedioCalificacion.toFixed(1)}
            </span>
            <span className="font-inter text-xs text-gray-500">
              ({habitacion.totalComentarios || 0})
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Tipo y número */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-xs text-[#CA99AB] uppercase tracking-wide font-semibold">
            {habitacion.tipo}
          </span>
          <span className="font-inter text-xs text-gray-500">
            Habitación {habitacion.numero_habitaciones}
          </span>
        </div>

        {/* Descripción */}
        <p className="font-inter text-gray-600 text-sm mb-4 line-clamp-2">
          {habitacion.descripcion}
        </p>

        {/* Capacidad */}
        <div className="flex items-center space-x-2 text-gray-500 mb-4">
          <Users className="w-4 h-4" />
          <span className="font-inter text-sm">
            Hasta {habitacion.cantidad_personas} {habitacion.cantidad_personas === 1 ? 'persona' : 'personas'}
          </span>
        </div>

        {/* Botones */}
        <div className="flex space-x-2">
          <Link
            href={`/usuario/habitaciones/${habitacion.id_habitaciones}`}
            className="flex-1 text-center bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-3 rounded-lg font-cormorant font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Ver Detalles
          </Link>
          
          {habitacion.estado === 'disponible' && (
            <Link
              href={`/usuario/reservas/nueva?habitacion=${habitacion.id_habitaciones}`}
              className="flex-1 text-center bg-white border-2 border-[#7B1D26] text-[#7B1D26] hover:bg-[#7B1D26] hover:text-white py-3 rounded-lg font-cormorant font-semibold transition-all duration-300"
            >
              Reservar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}