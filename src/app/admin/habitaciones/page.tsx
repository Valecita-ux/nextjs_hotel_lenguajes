// app/admin/habitaciones/page.tsx
'use client';

import { useEffect, useState } from 'react';

// Icons
const Bed = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 17h20"></path>
    <path d="M6 8V4"></path>
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Edit = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

interface Habitacion {
  id_habitaciones: number;
  numero_habitaciones: string;
  tipo: string;
  descripcion: string;
  precio: string;
  cantidad_personas: number;
  estado: string;
  _count?: {
    reservas: number;
    comentarios: number;
  };
}

export default function AdminHabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Modal estados
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [habitacionEditar, setHabitacionEditar] = useState<Habitacion | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    numero_habitaciones: '',
    tipo: 'simple',
    descripcion: '',
    precio: '',
    cantidad_personas: '1',
    estado: 'disponible'
  });

  // Modal eliminar
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [habitacionEliminar, setHabitacionEliminar] = useState<Habitacion | null>(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarHabitaciones();
  }, [filtroTipo, filtroEstado]);

  const cargarHabitaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/habitaciones?tipo=${filtroTipo}&estado=${filtroEstado}`);
      const data = await response.json();

      if (data.success) {
        setHabitaciones(data.habitaciones);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNueva = () => {
    setModoEdicion(false);
    setHabitacionEditar(null);
    setFormData({
      numero_habitaciones: '',
      tipo: 'simple',
      descripcion: '',
      precio: '',
      cantidad_personas: '1',
      estado: 'disponible'
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (habitacion: Habitacion) => {
    setModoEdicion(true);
    setHabitacionEditar(habitacion);
    setFormData({
      numero_habitaciones: habitacion.numero_habitaciones,
      tipo: habitacion.tipo,
      descripcion: habitacion.descripcion,
      precio: habitacion.precio,
      cantidad_personas: habitacion.cantidad_personas.toString(),
      estado: habitacion.estado
    });
    setMostrarModal(true);
  };

  const handleGuardar = async () => {
    if (!formData.numero_habitaciones || !formData.descripcion || !formData.precio || !formData.cantidad_personas) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    setGuardando(true);

    try {
      const url = '/api/admin/habitaciones';
      const method = modoEdicion ? 'PUT' : 'POST';
      
      const body = modoEdicion
        ? { ...formData, id_habitaciones: habitacionEditar?.id_habitaciones }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        await cargarHabitaciones();
        setMostrarModal(false);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar habitación');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (habitacion: Habitacion) => {
    setHabitacionEliminar(habitacion);
    setMostrarModalEliminar(true);
  };

  const eliminarHabitacion = async () => {
    if (!habitacionEliminar) return;

    setEliminando(true);
    try {
      const response = await fetch(`/api/admin/habitaciones?id=${habitacionEliminar.id_habitaciones}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await cargarHabitaciones();
        setMostrarModalEliminar(false);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar habitación');
    } finally {
      setEliminando(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      disponible: 'bg-green-100 text-green-800 border-green-300',
      reservado: 'bg-red-100 text-red-800 border-red-300',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return styles[estado as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-600 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-playfair text-4xl font-bold mb-2">Gestión de Habitaciones</h1>
              <p className="font-inter text-lg text-white/90">
                Administra el inventario completo de habitaciones
              </p>
            </div>
            <button
              onClick={abrirModalNueva}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition-colors shadow-lg font-inter font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Habitación</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-600">
              <p className="font-inter text-sm text-gray-600 mb-1">Total</p>
              <p className="font-playfair text-3xl font-bold text-gray-800">{estadisticas.total}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
              <p className="font-inter text-sm text-gray-600 mb-1">Disponibles</p>
              <p className="font-playfair text-3xl font-bold text-green-600">{estadisticas.disponibles}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
              <p className="font-inter text-sm text-gray-600 mb-1">Reservadas</p>
              <p className="font-playfair text-3xl font-bold text-red-600">{estadisticas.reservadas}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
              <p className="font-inter text-sm text-gray-600 mb-1">Mantenimiento</p>
              <p className="font-playfair text-3xl font-bold text-yellow-600">{estadisticas.mantenimiento}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-inter text-sm font-semibold text-gray-700">Tipo:</span>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="todos">Todos</option>
                <option value="simple">Simple</option>
                <option value="doble">Doble</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-inter text-sm font-semibold text-gray-700">Estado:</span>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-600 to-rose-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Número</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Descripción</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Precio</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Capacidad</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Reservas</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {habitaciones.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="font-inter text-gray-500">No hay habitaciones para mostrar</p>
                    </td>
                  </tr>
                ) : (
                  habitaciones.map((hab) => (
                    <tr key={hab.id_habitaciones} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm font-semibold text-gray-800">
                          #{hab.numero_habitaciones}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700 capitalize">
                          {hab.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700 line-clamp-2">
                          {hab.descripcion}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-playfair text-lg font-bold text-pink-600">
                          ${parseFloat(hab.precio).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-inter text-sm text-gray-700">
                            {hab.cantidad_personas}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full border font-inter text-xs font-semibold capitalize ${getEstadoBadge(hab.estado)}`}>
                          {hab.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700">
                          {hab._count?.reservas || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => abrirModalEditar(hab)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmarEliminar(hab)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Eliminar"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {mostrarModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-gray-800">
                {modoEdicion ? 'Editar Habitación' : 'Nueva Habitación'}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                    Número de Habitación *
                  </label>
                  <input
                    type="text"
                    value={formData.numero_habitaciones}
                    onChange={(e) => setFormData({ ...formData, numero_habitaciones: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ej: 101"
                  />
                </div>

                <div>
                  <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="simple">Simple</option>
                    <option value="doble">Doble</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Describe las características de la habitación..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                    Precio por Noche *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                    Capacidad (personas) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.cantidad_personas}
                    onChange={(e) => setFormData({ ...formData, cantidad_personas: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-inter font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl hover:from-pink-700 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-semibold"
                >
                  <Check className="w-5 h-5" />
                  <span>{guardando ? 'Guardando...' : 'Guardar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {mostrarModalEliminar && habitacionEliminar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModalEliminar(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="font-playfair text-2xl font-bold text-gray-800 text-center mb-4">
              ¿Eliminar Habitación?
            </h3>
            <p className="font-inter text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar la habitación <strong>#{habitacionEliminar.numero_habitaciones}</strong>? 
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setMostrarModalEliminar(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-inter font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarHabitacion}
                disabled={eliminando}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-semibold"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}