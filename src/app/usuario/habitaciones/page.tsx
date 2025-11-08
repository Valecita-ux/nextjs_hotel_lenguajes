// (ver habitaciones disponibles)
// app/usuario/habitaciones/page.tsx
'use client';

import { useEffect, useState } from 'react';
import HabitacionCard from '@/components/habitaciones/HabitacionCard';
import { Habitacion, FiltrosHabitacion } from '@/types';
import { Search, Filter, Flower } from '@/components/icons/Icons';

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosHabitacion>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    cargarHabitaciones();
  }, [filtros]);

  const cargarHabitaciones = async () => {
    try {
      setLoading(true);
      
      // Construir query string con filtros
      const params = new URLSearchParams();
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.precioMin) params.append('precioMin', filtros.precioMin.toString());
      if (filtros.precioMax) params.append('precioMax', filtros.precioMax.toString());
      if (filtros.personas) params.append('personas', filtros.personas.toString());

      const response = await fetch(`/api/habitaciones?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setHabitaciones(data.habitaciones);
      } else {
        console.error('Error al cargar habitaciones:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (nuevosFiltros: Partial<FiltrosHabitacion>) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const limpiarFiltros = () => {
    setFiltros({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Flower className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
          <h1 className="font-playfair text-5xl font-bold mb-4">Nuestras Habitaciones</h1>
          <p className="font-inter text-xl text-white/90 max-w-2xl mx-auto">
            Descubre el espacio perfecto para tu estadía
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Botón de filtros móvil */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center space-x-2 bg-[#7B1D26] text-white px-4 py-3 rounded-lg font-inter font-semibold"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
            </button>

            {/* Filtros */}
            <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-col lg:flex-row gap-4 w-full`}>
              {/* Tipo */}
              <div className="flex-1">
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Habitación
                </label>
                <select
                  value={filtros.tipo || 'todos'}
                  onChange={(e) => aplicarFiltros({ tipo: e.target.value === 'todos' ? undefined : e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                >
                  <option value="todos">Todas</option>
                  <option value="simple">Simple</option>
                  <option value="doble">Doble</option>
                  <option value="suite">Suite</option>
                  <option value="deluxe">Deluxe</option>
                </select>
              </div>

              {/* Personas */}
              <div className="flex-1">
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Huéspedes
                </label>
                <select
                  value={filtros.personas || ''}
                  onChange={(e) => aplicarFiltros({ personas: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                >
                  <option value="">Cualquier cantidad</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4+ personas</option>
                </select>
              </div>

              {/* Precio Mínimo */}
              <div className="flex-1">
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filtros.precioMin || ''}
                  onChange={(e) => aplicarFiltros({ precioMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                />
              </div>

              {/* Precio Máximo */}
              <div className="flex-1">
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  placeholder="$30000"
                  value={filtros.precioMax || ''}
                  onChange={(e) => aplicarFiltros({ precioMax: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-[#CA99AB] focus:border-transparent"
                />
              </div>

              {/* Botón limpiar */}
              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full lg:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-inter font-semibold transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="font-inter text-gray-600">
            {loading ? 'Cargando...' : `${habitaciones.length} habitaciones encontradas`}
          </p>
        </div>

        {/* Grid de habitaciones */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
              <p className="font-inter text-gray-600">Cargando habitaciones...</p>
            </div>
          </div>
        ) : habitaciones.length === 0 ? (
          <div className="text-center py-20">
            <Flower className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              No se encontraron habitaciones
            </h3>
            <p className="font-inter text-gray-600 mb-6">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={limpiarFiltros}
              className="px-8 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold hover:shadow-lg transition-all"
            >
              Ver todas las habitaciones
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitaciones.map((habitacion) => (
              <HabitacionCard key={habitacion.id_habitaciones} habitacion={habitacion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}