// src/app/usuario/reservas/nueva/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Habitacion } from '@/types';
import { 
  Calendar, Users, AlertCircle, Check, ChevronLeft, Flower, Star, Plus, Minus, X,
  Droplet, Dumbbell, Utensils, Coffee, Lock
} from '@/components/icons/Icons';

export default function NuevaReservaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitacionId = searchParams.get('habitacion');

  const [user, setUser] = useState<any>(null);
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [todosServicios, setTodosServicios] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<'servicios' | 'spa' | 'deportes' | 'turismo' | 'restaurante'>('servicios');

  // Estados para servicios seleccionados
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Map<number, number>>(new Map());
  const [spaSeleccionado, setSpaSeleccionado] = useState<Array<{id_spa: number, fecha_servicio: string}>>([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState<Array<{id_actividad: number, fecha_actividad: string}>>([]);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState<Set<number>>(new Set());
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState<Map<number, {cantidad: number, fecha: string, horario: string}>>(new Map());

  const [formData, setFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    numero_huespedes: 1
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }

    if (habitacionId) {
      cargarDatos(habitacionId);
    }
  }, [habitacionId]);

  const cargarDatos = async (id: string) => {
    try {
      const [habitacionRes, serviciosRes] = await Promise.all([
        fetch(`/api/habitaciones/${id}`),
        fetch('/api/servicios')
      ]);

      const habitacionData = await habitacionRes.json();
      const serviciosData = await serviciosRes.json();

      if (habitacionData.success) {
        setHabitacion(habitacionData.habitacion);
      }

      if (serviciosData.success) {
        setTodosServicios(serviciosData.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar servicios hotel
  const toggleServicio = (servicioId: number, accion: 'agregar' | 'quitar') => {
    const nuevo = new Map(serviciosSeleccionados);
    const cantidadActual = nuevo.get(servicioId) || 0;
    
    if (accion === 'agregar') {
      nuevo.set(servicioId, cantidadActual + 1);
    } else if (cantidadActual > 1) {
      nuevo.set(servicioId, cantidadActual - 1);
    } else {
      nuevo.delete(servicioId);
    }
    
    setServiciosSeleccionados(nuevo);
  };

  // Funciones para Spa
  const toggleSpa = (spaId: number) => {
    const existe = spaSeleccionado.find(s => s.id_spa === spaId);
    if (existe) {
      setSpaSeleccionado(spaSeleccionado.filter(s => s.id_spa !== spaId));
    } else {
      setSpaSeleccionado([...spaSeleccionado, { id_spa: spaId, fecha_servicio: formData.fecha_inicio || '' }]);
    }
  };

  const actualizarFechaSpa = (spaId: number, fecha: string) => {
    setSpaSeleccionado(spaSeleccionado.map(s => 
      s.id_spa === spaId ? { ...s, fecha_servicio: fecha } : s
    ));
  };

  // Funciones para Actividades
  const toggleActividad = (actividadId: number) => {
    const existe = actividadesSeleccionadas.find(a => a.id_actividad === actividadId);
    if (existe) {
      setActividadesSeleccionadas(actividadesSeleccionadas.filter(a => a.id_actividad !== actividadId));
    } else {
      setActividadesSeleccionadas([...actividadesSeleccionadas, { id_actividad: actividadId, fecha_actividad: formData.fecha_inicio || '' }]);
    }
  };

  const actualizarFechaActividad = (actividadId: number, fecha: string) => {
    setActividadesSeleccionadas(actividadesSeleccionadas.map(a => 
      a.id_actividad === actividadId ? { ...a, fecha_actividad: fecha } : a
    ));
  };

  // Funciones para Paquetes
  const togglePaquete = (paqueteId: number) => {
    const nuevo = new Set(paquetesSeleccionados);
    if (nuevo.has(paqueteId)) {
      nuevo.delete(paqueteId);
    } else {
      nuevo.add(paqueteId);
    }
    setPaquetesSeleccionados(nuevo);
  };

  // Funciones para Restaurante
  const toggleRestaurante = (restauranteId: number) => {
    const nuevo = new Map(restauranteSeleccionado);
    if (nuevo.has(restauranteId)) {
      nuevo.delete(restauranteId);
    } else {
      nuevo.set(restauranteId, { cantidad: 1, fecha: formData.fecha_inicio || '', horario: '' });
    }
    setRestauranteSeleccionado(nuevo);
  };

  const actualizarRestaurante = (restauranteId: number, campo: 'cantidad' | 'fecha' | 'horario', valor: any) => {
    const nuevo = new Map(restauranteSeleccionado);
    const item = nuevo.get(restauranteId);
    if (item) {
      nuevo.set(restauranteId, { ...item, [campo]: valor });
      setRestauranteSeleccionado(nuevo);
    }
  };

  const calcularPrecioTotal = () => {
    if (!todosServicios || !habitacion) return { total: 0, desglose: {} };

    let total = 0;
    let desglose: any = {};

    // Precio habitación
    if (formData.fecha_inicio && formData.fecha_fin) {
      const dias = calcularDias();
      const precioHab = typeof habitacion.precio === 'string' ? parseFloat(habitacion.precio) : habitacion.precio;
      const precioHabitacion = precioHab * dias;
      total += precioHabitacion;
      desglose.habitacion = precioHabitacion;
      desglose.dias = dias;
    }

    // Servicios hotel
    if (serviciosSeleccionados.size > 0) {
      let precioServicios = 0;
      serviciosSeleccionados.forEach((cantidad, id) => {
        const servicio = todosServicios.servicios.find((s: any) => s.id_servicio === id);
        if (servicio) {
          const precio = typeof servicio.precio_servicio === 'string' ? parseFloat(servicio.precio_servicio) : servicio.precio_servicio;
          precioServicios += precio * cantidad;
        }
      });
      total += precioServicios;
      desglose.servicios = precioServicios;
    }

    // Spa
    if (spaSeleccionado.length > 0) {
      let precioSpa = 0;
      spaSeleccionado.forEach(item => {
        const spa = todosServicios.spa.find((s: any) => s.id_spa === item.id_spa);
        if (spa) {
          const precio = typeof spa.costo_tramamiento === 'string' ? parseFloat(spa.costo_tramamiento) : spa.costo_tramamiento;
          precioSpa += precio;
        }
      });
      total += precioSpa;
      desglose.spa = precioSpa;
    }

    // Actividades
    if (actividadesSeleccionadas.length > 0) {
      let precioActividades = 0;
      actividadesSeleccionadas.forEach(item => {
        const actividad = todosServicios.actividadesDeportivas.find((a: any) => a.id_actividad === item.id_actividad);
        if (actividad) {
          const precio = typeof actividad.costo_actividad === 'string' ? parseFloat(actividad.costo_actividad) : actividad.costo_actividad;
          precioActividades += precio;
        }
      });
      total += precioActividades;
      desglose.actividades = precioActividades;
    }

    // Paquetes
    if (paquetesSeleccionados.size > 0) {
      let precioPaquetes = 0;
      paquetesSeleccionados.forEach(id => {
        const paquete = todosServicios.paquetesTuristicos.find((p: any) => p.id_paquete === id);
        if (paquete) {
          const precio = typeof paquete.costo === 'string' ? parseFloat(paquete.costo) : paquete.costo;
          precioPaquetes += precio;
        }
      });
      total += precioPaquetes;
      desglose.paquetes = precioPaquetes;
    }

    // Restaurante
    if (restauranteSeleccionado.size > 0) {
      let precioRestaurante = 0;
      restauranteSeleccionado.forEach((item, id) => {
        const platoData = Object.values(todosServicios.restaurante).flat().find((p: any) => p.id_restaurante === id);
        if (platoData) {
          const precio = typeof (platoData as any).precio === 'string' ? parseFloat((platoData as any).precio) : (platoData as any).precio;
          precioRestaurante += precio * item.cantidad;
        }
      });
      total += precioRestaurante;
      desglose.restaurante = precioRestaurante;
    }

    return { total, desglose };
  };

  const calcularDias = () => {
    if (!formData.fecha_inicio || !formData.fecha_fin) return 0;
    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        id_usuario: user.id,
        id_habitacion: habitacionId,
        ...formData,
        servicios_seleccionados: Array.from(serviciosSeleccionados.entries()).map(([id_servicio, cantidad]) => ({ id_servicio, cantidad })),
        spa_seleccionados: spaSeleccionado,
        actividades_seleccionadas: actividadesSeleccionadas,
        paquetes_seleccionados: Array.from(paquetesSeleccionados).map(id_paquete => ({ id_paquete })),
        restaurante_seleccionado: Array.from(restauranteSeleccionado.entries()).map(([id_restaurante, data]) => ({
          id_restaurante,
          cantidad: data.cantidad,
          fecha_consumo: data.fecha,
          horario_solicitado: data.horario,
          observaciones: null
        }))
      };

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/usuario/reservas'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (!formData.fecha_inicio) return getMinDate();
    const checkIn = new Date(formData.fecha_inicio);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
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

  if (!habitacion || !todosServicios) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Flower className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">Error al cargar</h2>
          <Link href="/usuario/habitaciones" className="inline-block px-6 py-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg font-cormorant font-semibold">
            Ver habitaciones
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-4">¡Reserva Confirmada!</h2>
          <p className="font-inter text-gray-600 mb-6">Tu reserva ha sido creada exitosamente.</p>
          <p className="font-inter text-sm text-gray-500">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const { total: precioTotal, desglose } = calcularPrecioTotal();
  const totalServicios = serviciosSeleccionados.size + spaSeleccionado.length + actividadesSeleccionadas.length + paquetesSeleccionados.size + restauranteSeleccionado.size;

  const categorias = [
    { id: 'servicios', label: 'Servicios Hotel', icon: Star, badge: serviciosSeleccionados.size },
    { id: 'spa', label: 'Spa', icon: Droplet, badge: spaSeleccionado.length },
    { id: 'deportes', label: 'Deportes', icon: Dumbbell, badge: actividadesSeleccionadas.length },
    { id: 'turismo', label: 'Turismo', icon: Calendar, badge: paquetesSeleccionados.size },
    { id: 'restaurante', label: 'Restaurante', icon: Utensils, badge: restauranteSeleccionado.size }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-600 hover:text-[#7B1D26] transition-colors mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-inter">Volver</span>
          </button>
          <h1 className="font-playfair text-3xl font-bold text-gray-800">Nueva Reserva</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Formulario básico */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">Datos de la Reserva</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                  <input type="date" required min={getMinDate()} value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value, fecha_fin: '' })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB]" />
                </div>
                <div>
                  <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                  <input type="date" required min={getMinCheckoutDate()} value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    disabled={!formData.fecha_inicio}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB] disabled:bg-gray-100" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-cormorant text-sm font-semibold text-gray-700 mb-2">Huéspedes</label>
                <select required value={formData.numero_huespedes}
                  onChange={(e) => setFormData({ ...formData, numero_huespedes: parseInt(e.target.value) })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-[#CA99AB]">
                  {[...Array(habitacion.cantidad_personas)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-inter">{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting || !formData.fecha_inicio || !formData.fecha_fin}
                className="w-full bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white py-4 rounded-xl font-cormorant font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                {submitting ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>

            {/* Servicios adicionales con tabs */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-2">Personaliza tu Estadía</h2>
              <p className="font-inter text-sm text-gray-600 mb-6">Opcional - Servicios seleccionados: {totalServicios}</p>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                {categorias.map(({ id, label, icon: Icon, badge }) => (
                  <button key={id} type="button"
                    onClick={() => setCategoriaActiva(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                      categoriaActiva === id ? 'bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {badge > 0 && <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">{badge}</span>}
                  </button>
                ))}
              </div>

              {/* Contenido de servicios hotel */}
              {categoriaActiva === 'servicios' && (
                <div className="space-y-3">
                  {todosServicios.servicios.map((servicio: any) => {
                    const cantidad = serviciosSeleccionados.get(servicio.id_servicio) || 0;
                    const precio = typeof servicio.precio_servicio === 'string' ? parseFloat(servicio.precio_servicio) : servicio.precio_servicio;
                    return (
                      <div key={servicio.id_servicio} className={`border rounded-xl p-4 ${cantidad > 0 ? 'border-[#7B1D26] bg-[#7B1D26]/5' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-cormorant text-lg font-bold text-gray-800">{servicio.nombre_servicio}</h4>
                            <p className="font-inter text-sm text-gray-600 mb-2">{servicio.descripcion}</p>
                            <span className="font-inter text-sm font-semibold text-[#7B1D26]">${precio.toLocaleString()}</span>
                          </div>
                          {cantidad === 0 ? (
                            <button type="button" onClick={() => toggleServicio(servicio.id_servicio, 'agregar')}
                              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white rounded-lg text-sm">
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="ml-4 flex items-center space-x-2">
                              <button type="button" onClick={() => toggleServicio(servicio.id_servicio, 'quitar')}
                                className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                {cantidad === 1 ? <X className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="font-cormorant text-lg font-bold min-w-[2rem] text-center">{cantidad}</span>
                              <button type="button" onClick={() => toggleServicio(servicio.id_servicio, 'agregar')}
                                className="w-8 h-8 bg-[#7B1D26] text-white rounded-lg flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Contenido de Spa */}
              {categoriaActiva === 'spa' && (
                <div className="space-y-3">
                  {todosServicios.spa.map((spa: any) => {
                    const seleccionado = spaSeleccionado.find(s => s.id_spa === spa.id_spa);
                    const precio = typeof spa.costo_tramamiento === 'string' ? parseFloat(spa.costo_tramamiento) : spa.costo_tramamiento;
                    return (
                      <div key={spa.id_spa} className={`border rounded-xl p-4 ${seleccionado ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-cormorant text-lg font-bold text-gray-800">{spa.nombre_tratamiento}</h4>
                            <p className="font-inter text-sm text-gray-600 mb-2">{spa.descripcion}</p>
                            <span className="font-inter text-sm font-semibold text-blue-600">${precio.toLocaleString()}</span>
                          </div>
                          <button type="button" onClick={() => toggleSpa(spa.id_spa)}
                            className={`ml-4 px-4 py-2 rounded-lg text-sm ${seleccionado ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {seleccionado ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                        {seleccionado && (
                          <div>
                            <label className="block font-inter text-xs text-gray-600 mb-1">Fecha del tratamiento</label>
                            <input type="date" value={seleccionado.fecha_servicio} min={formData.fecha_inicio} max={formData.fecha_fin}
                              onChange={(e) => actualizarFechaSpa(spa.id_spa, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Contenido de Deportes */}
              {categoriaActiva === 'deportes' && (
                <div className="space-y-3">
                  {todosServicios.actividadesDeportivas.map((actividad: any) => {
                    const seleccionado = actividadesSeleccionadas.find(a => a.id_actividad === actividad.id_actividad);
                    const precio = typeof actividad.costo_actividad === 'string' ? parseFloat(actividad.costo_actividad) : actividad.costo_actividad;
                    return (
                      <div key={actividad.id_actividad} className={`border rounded-xl p-4 ${seleccionado ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-cormorant text-lg font-bold text-gray-800">{actividad.nombre_actividad}</h4>
                            <p className="font-inter text-sm text-gray-600 mb-2">{actividad.descripcion}</p>
                            <span className="font-inter text-sm font-semibold text-green-600">${precio.toLocaleString()}</span>
                          </div>
                          <button type="button" onClick={() => toggleActividad(actividad.id_actividad)}
                            className={`ml-4 px-4 py-2 rounded-lg text-sm ${seleccionado ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {seleccionado ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                        {seleccionado && (
                          <div>
                            <label className="block font-inter text-xs text-gray-600 mb-1">Fecha de la actividad</label>
                            <input type="date" value={seleccionado.fecha_actividad} min={formData.fecha_inicio} max={formData.fecha_fin}
                              onChange={(e) => actualizarFechaActividad(actividad.id_actividad, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}


              

            

              {/* Contenido de Turismo */}
              {categoriaActiva === 'turismo' && (
                <div className="space-y-3">
                  {todosServicios.paquetesTuristicos.map((paquete: any) => {
                    const seleccionado = paquetesSeleccionados.has(paquete.id_paquete);
                    const precio = typeof paquete.costo === 'string' ? parseFloat(paquete.costo) : paquete.costo;
                    return (
                      <div key={paquete.id_paquete} className={`border rounded-xl p-4 ${seleccionado ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-cormorant text-lg font-bold text-gray-800">{paquete.nombre_paquete}</h4>
                            <p className="font-inter text-sm text-gray-600 mb-2">{paquete.descripcion}</p>
                            <span className="font-inter text-sm font-semibold text-purple-600">${precio.toLocaleString()}</span>
                          </div>
                          <button type="button" onClick={() => togglePaquete(paquete.id_paquete)}
                            className={`ml-4 px-4 py-2 rounded-lg text-sm ${seleccionado ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'}`}>
                            {seleccionado ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Contenido de Restaurante */}
              {categoriaActiva === 'restaurante' && (
                <div className="space-y-6">
                  {['desayuno', 'almuerzo', 'cena', 'bebida'].map(categoria => {
                    const platos = todosServicios.restaurante[categoria] || [];
                    if (platos.length === 0) return null;
                    
                    return (
                      <div key={categoria}>
                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-3 capitalize flex items-center space-x-2">
                          {categoria === 'desayuno' && <Coffee className="w-5 h-5 text-orange-500" />}
                          {categoria === 'almuerzo' && <Utensils className="w-5 h-5 text-red-500" />}
                          {categoria === 'cena' && <Star className="w-5 h-5 text-purple-500" />}
                          {categoria === 'bebida' && <Droplet className="w-5 h-5 text-blue-500" />}
                          <span>{categoria}</span>
                        </h3>
                        <div className="space-y-3">
                          {platos.map((plato: any) => {
                            const seleccionado = restauranteSeleccionado.get(plato.id_restaurante);
                            const precio = typeof plato.precio === 'string' ? parseFloat(plato.precio) : plato.precio;
                            return (
                              <div key={plato.id_restaurante} className={`border rounded-xl p-4 ${seleccionado ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-cormorant text-lg font-bold text-gray-800">{plato.nombre_plato}</h4>
                                    <p className="font-inter text-sm text-gray-600 mb-1">{plato.descripcion}</p>
                                    {plato.tiempo_preparacion && (
                                      <div className="flex items-center space-x-1 text-gray-500 mb-2">
                                        <Lock className="w-3 h-3" />
                                        <span className="font-inter text-xs">{plato.tiempo_preparacion} min</span>
                                      </div>
                                    )}
                                    <span className="font-inter text-sm font-semibold text-orange-600">${precio.toLocaleString()}</span>
                                  </div>
                                  <button type="button" onClick={() => toggleRestaurante(plato.id_restaurante)}
                                    className={`ml-4 px-4 py-2 rounded-lg text-sm ${seleccionado ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                                    {seleccionado ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                  </button>
                                </div>
                                {seleccionado && (
                                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                                    <div>
                                      <label className="block font-inter text-xs text-gray-600 mb-1">Cantidad</label>
                                      <input type="number" min="4" value={seleccionado.cantidad}
                                        onChange={(e) => actualizarRestaurante(plato.id_restaurante, 'cantidad', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                      <label className="block font-inter text-xs text-gray-600 mb-1">Fecha</label>
                                      <input type="date" value={seleccionado.fecha} min={formData.fecha_inicio} max={formData.fecha_fin}
                                        onChange={(e) => actualizarRestaurante(plato.id_restaurante, 'fecha', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                      <label className="block font-inter text-xs text-gray-600 mb-1">Horario</label>
                                      <input type="time" value={seleccionado.horario}
                                        onChange={(e) => actualizarRestaurante(plato.id_restaurante, 'horario', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6 border-2 border-[#D4AF37]/30">
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">Resumen</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-inter text-sm text-gray-600">Habitación N°</span>
                  <span className="font-cormorant font-semibold text-gray-800">{habitacion.numero_habitaciones}</span>
                </div>

                {desglose.dias > 0 && (
                  <>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-inter text-sm text-gray-600">Noches</span>
                      <span className="font-inter text-gray-800">{desglose.dias}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-inter text-sm text-gray-600">Habitación</span>
                      <span className="font-inter text-gray-800">${desglose.habitacion?.toLocaleString()}</span>
                    </div>
                  </>
                )}

                {desglose.servicios > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-inter text-sm text-gray-600">Servicios Hotel</span>
                    <span className="font-inter text-gray-800">${desglose.servicios.toLocaleString()}</span>
                  </div>
                )}

                {desglose.spa > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-inter text-sm text-gray-600">Spa</span>
                    <span className="font-inter text-gray-800">${desglose.spa.toLocaleString()}</span>
                  </div>
                )}

                {desglose.actividades > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-inter text-sm text-gray-600">Actividades</span>
                    <span className="font-inter text-gray-800">${desglose.actividades.toLocaleString()}</span>
                  </div>
                )}

                {desglose.paquetes > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-inter text-sm text-gray-600">Paquetes</span>
                    <span className="font-inter text-gray-800">${desglose.paquetes.toLocaleString()}</span>
                  </div>
                )}

                {desglose.restaurante > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-inter text-sm text-gray-600">Restaurante</span>
                    <span className="font-inter text-gray-800">${desglose.restaurante.toLocaleString()}</span>
                  </div>
                )}

                {precioTotal > 0 && (
                  <div className="bg-gradient-to-br from-[#7B1D26]/10 to-[#CA99AB]/10 p-4 rounded-xl mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-cormorant font-semibold text-gray-700">Total</span>
                      <span className="font-playfair text-2xl font-bold text-[#7B1D26]">${precioTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {totalServicios > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg mb-4">
                  <p className="font-inter text-xs text-blue-800">
                    <strong>{totalServicios}</strong> servicios adicionales seleccionados
                  </p>
                </div>
              )}

              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg">
                <p className="font-inter text-xs text-green-800">
                  <strong>Cancelación gratis</strong> hasta 24hs antes del check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}