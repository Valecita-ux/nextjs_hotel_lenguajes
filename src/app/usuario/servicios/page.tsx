// src/app/usuario/servicios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Droplet, Dumbbell, Coffee, Utensils, Star, 
  Lock, Users, Calendar, Flower, Check 
} from '@/components/icons/Icons';

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio_servicio: number | string;
}

interface TratamientoSpa {
  id_spa: number;
  nombre_tratamiento: string;
  descripcion: string;
  costo_tramamiento: number | string;
}

interface ActividadDeportiva {
  id_actividad: number;
  nombre_actividad: string;
  descripcion: string;
  costo_actividad: number | string;
  costo_adicional: number | string | null;
}

interface PaqueteTuristico {
  id_paquete: number;
  nombre_paquete: string;
  descripcion: string;
  costo: number | string;
}

interface PlatoRestaurante {
  id_restaurante: number;
  nombre_plato: string;
  descripcion: string;
  categoria: string;
  precio: number | string;
  tiempo_preparacion: number | null;
  ingredientes_especiales: string | null;
}

export default function ServiciosPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<'servicios' | 'spa' | 'deportes' | 'turismo' | 'restaurante'>('servicios');

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await fetch('/api/servicios');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { id: 'servicios', label: 'Servicios', icon: Star, color: 'from-[#7B1D26] to-[#CA99AB]' },
    { id: 'spa', label: 'Spa & Wellness', icon: Droplet, color: 'from-blue-500 to-cyan-500' },
    { id: 'deportes', label: 'Deportes', icon: Dumbbell, color: 'from-green-500 to-emerald-500' },
    { id: 'turismo', label: 'Turismo', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { id: 'restaurante', label: 'Restaurante', icon: Utensils, color: 'from-orange-500 to-red-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#CA99AB] border-t-[#7B1D26] rounded-full animate-spin"></div>
          <p className="font-inter text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-inter text-gray-600">Error al cargar servicios</p>
      </div>
    );
  }

  const formatPrecio = (precio: number | string) => {
    const p = typeof precio === 'string' ? parseFloat(precio) : precio;
    return p.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Flower className="w-20 h-20 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
          <h1 className="font-playfair text-6xl font-bold mb-6">Nuestros Servicios</h1>
          <p className="font-inter text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Experimenta una estadía inolvidable con nuestros servicios premium
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Navegación por categorías */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setCategoriaActiva(id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-cormorant font-semibold text-lg transition-all duration-300 ${
                  categoriaActiva === id
                    ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido por categoría */}
        <div className="space-y-8">
          {/* SERVICIOS GENERALES */}
          {categoriaActiva === 'servicios' && (
            <div>
              <div className="mb-8">
                <h2 className="font-playfair text-4xl font-bold text-gray-800 mb-2">
                  Servicios del Hotel
                </h2>
                <p className="font-inter text-gray-600 text-lg">
                  Comodidades y atenciones para hacer tu estadía perfecta
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.servicios.map((servicio: Servicio) => (
                  <div
                    key={servicio.id_servicio}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#CA99AB]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-playfair text-2xl font-bold text-[#7B1D26]">
                        ${formatPrecio(servicio.precio_servicio)}
                      </span>
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                      {servicio.nombre_servicio}
                    </h3>
                    <p className="font-inter text-gray-600 text-sm">
                      {servicio.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPA & WELLNESS */}
          {categoriaActiva === 'spa' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Droplet className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-4xl font-bold text-gray-800">
                      Spa & Wellness
                    </h2>
                    <p className="font-inter text-gray-600 text-lg">
                      Relájate y renueva tu energía con nuestros tratamientos
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.spa.map((tratamiento: TratamientoSpa) => (
                  <div
                    key={tratamiento.id_spa}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-playfair text-2xl font-bold text-white">
                          {tratamiento.nombre_tratamiento}
                        </h3>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-cormorant font-bold text-white text-lg">
                          ${formatPrecio(tratamiento.costo_tramamiento)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-inter text-gray-700">
                        {tratamiento.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVIDADES DEPORTIVAS */}
          {categoriaActiva === 'deportes' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-4xl font-bold text-gray-800">
                      Actividades Deportivas
                    </h2>
                    <p className="font-inter text-gray-600 text-lg">
                      Mantente activo durante tu estadía
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.actividadesDeportivas.map((actividad: ActividadDeportiva) => (
                  <div
                    key={actividad.id_actividad}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="font-playfair text-2xl font-bold text-green-600 block">
                          ${formatPrecio(actividad.costo_actividad)}
                        </span>
                        {actividad.costo_adicional && (
                          <span className="font-inter text-xs text-gray-500">
                            +${formatPrecio(actividad.costo_adicional)} adicional
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                      {actividad.nombre_actividad}
                    </h3>
                    <p className="font-inter text-gray-600 text-sm">
                      {actividad.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAQUETES TURÍSTICOS */}
          {categoriaActiva === 'turismo' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-4xl font-bold text-gray-800">
                      Paquetes Turísticos
                    </h2>
                    <p className="font-inter text-gray-600 text-lg">
                      Descubre los mejores lugares de la región
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.paquetesTuristicos.map((paquete: PaqueteTuristico) => (
                  <div
                    key={paquete.id_paquete}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-playfair text-2xl font-bold text-white">
                          {paquete.nombre_paquete}
                        </h3>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-cormorant font-bold text-white text-lg">
                          ${formatPrecio(paquete.costo)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-inter text-gray-700">
                        {paquete.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESTAURANTE */}
          {categoriaActiva === 'restaurante' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-4xl font-bold text-gray-800">
                      Restaurante
                    </h2>
                    <p className="font-inter text-gray-600 text-lg">
                      Deléitate con nuestra gastronomía internacional
                    </p>
                  </div>
                </div>
              </div>

              {/* Desayunos */}
              {data.restaurante.desayuno.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Coffee className="w-6 h-6 text-orange-500" />
                    <span>Desayunos</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.restaurante.desayuno.map((plato: PlatoRestaurante) => (
                      <div
                        key={plato.id_restaurante}
                        className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-cormorant text-lg font-bold text-gray-800">
                            {plato.nombre_plato}
                          </h4>
                          <span className="font-playfair text-xl font-bold text-orange-600">
                            ${formatPrecio(plato.precio)}
                          </span>
                        </div>
                        <p className="font-inter text-sm text-gray-600 mb-2">
                          {plato.descripcion}
                        </p>
                        {plato.tiempo_preparacion && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Lock className="w-4 h-4" />
                            <span className="font-inter text-xs">
                              {plato.tiempo_preparacion} min
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Almuerzos */}
              {data.restaurante.almuerzo.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Utensils className="w-6 h-6 text-red-500" />
                    <span>Almuerzos</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.restaurante.almuerzo.map((plato: PlatoRestaurante) => (
                      <div
                        key={plato.id_restaurante}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-cormorant text-xl font-bold text-gray-800">
                            {plato.nombre_plato}
                          </h4>
                          <span className="font-playfair text-2xl font-bold text-red-600">
                            ${formatPrecio(plato.precio)}
                          </span>
                        </div>
                        <p className="font-inter text-sm text-gray-600 mb-3">
                          {plato.descripcion}
                        </p>
                        <div className="flex items-center justify-between text-gray-500">
                          {plato.tiempo_preparacion && (
                            <div className="flex items-center space-x-1">
                              <Lock className="w-4 h-4" />
                              <span className="font-inter text-xs">
                                {plato.tiempo_preparacion} min
                              </span>
                            </div>
                          )}
                          {plato.ingredientes_especiales && (
                            <span className="font-inter text-xs italic">
                              {plato.ingredientes_especiales}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cenas */}
              {data.restaurante.cena.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Star className="w-6 h-6 text-purple-500" />
                    <span>Cenas</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.restaurante.cena.map((plato: PlatoRestaurante) => (
                      <div
                        key={plato.id_restaurante}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-cormorant text-xl font-bold text-gray-800">
                            {plato.nombre_plato}
                          </h4>
                          <span className="font-playfair text-2xl font-bold text-purple-600">
                            ${formatPrecio(plato.precio)}
                          </span>
                        </div>
                        <p className="font-inter text-sm text-gray-600 mb-3">
                          {plato.descripcion}
                        </p>
                        <div className="flex items-center justify-between text-gray-500">
                          {plato.tiempo_preparacion && (
                            <div className="flex items-center space-x-1">
                              <Lock className="w-4 h-4" />
                              <span className="font-inter text-xs">
                                {plato.tiempo_preparacion} min
                              </span>
                            </div>
                          )}
                          {plato.ingredientes_especiales && (
                            <span className="font-inter text-xs italic">
                              {plato.ingredientes_especiales}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bebidas */}
              {data.restaurante.bebida.length > 0 && (
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Droplet className="w-6 h-6 text-blue-500" />
                    <span>Bebidas</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.restaurante.bebida.map((plato: PlatoRestaurante) => (
                      <div
                        key={plato.id_restaurante}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-center"
                      >
                        <h4 className="font-cormorant text-base font-bold text-gray-800 mb-2">
                          {plato.nombre_plato}
                        </h4>
                        <span className="font-playfair text-xl font-bold text-blue-600">
                          ${formatPrecio(plato.precio)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Final */}
        <div className="mt-16 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] rounded-3xl p-12 text-center text-white">
          <Flower className="w-16 h-16 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
          <h2 className="font-playfair text-4xl font-bold mb-4">
            ¿Listo para disfrutar?
          </h2>
          <p className="font-inter text-xl mb-8 max-w-2xl mx-auto">
            Todos estos servicios están disponibles durante tu estadía. 
            Algunos pueden reservarse con anticipación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/usuario/habitaciones"
              className="px-8 py-4 bg-white text-[#7B1D26] rounded-xl font-cormorant font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Reservar Habitación
            </a>
            <a
              href="/usuario/consultas"
              className="px-8 py-4 bg-[#D4AF37] text-white rounded-xl font-cormorant font-bold text-lg hover:bg-[#B8941F] transition-all shadow-lg"
            >
              Consultar Servicios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}