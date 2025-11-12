// app/admin/operadores/page.tsx
'use client';

import { useEffect, useState } from 'react';

// Icons
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UserPlus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
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

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
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

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reservas: number;
    comentarios: number;
    consultas: number;
  };
}

export default function AdminOperadoresPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('todos');
  
  // Modal estados
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'operador'
  });

  // Modal eliminar
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, [filtroRol]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/operadores?rol=${filtroRol}`);
      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setUsuarioEditar(null);
    setFormData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: 'operador'
    });
    setMostrarPassword(false);
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setModoEdicion(true);
    setUsuarioEditar(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: '',
      rol: usuario.rol
    });
    setMostrarPassword(false);
    setMostrarModal(true);
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!formData.nombre || !formData.correo) {
      alert('Por favor complete nombre y correo');
      return;
    }

    if (!modoEdicion && !formData.contraseña) {
      alert('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (formData.contraseña && formData.contraseña.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setGuardando(true);

    try {
      const url = '/api/admin/operadores';
      const method = modoEdicion ? 'PUT' : 'POST';
      
      let body: any = modoEdicion
        ? { ...formData, id_usuario: usuarioEditar?.id_usuario }
        : formData;

      // Si estamos editando y no hay contraseña, no la enviar
      if (modoEdicion && !formData.contraseña) {
        const { contraseña, ...bodyWithoutPassword } = body;
        body = bodyWithoutPassword;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        await cargarUsuarios();
        setMostrarModal(false);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar usuario');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (usuario: Usuario) => {
    setUsuarioEliminar(usuario);
    setMostrarModalEliminar(true);
  };

  const eliminarUsuario = async () => {
    if (!usuarioEliminar) return;

    setEliminando(true);
    try {
      const response = await fetch(`/api/admin/operadores?id=${usuarioEliminar.id_usuario}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await cargarUsuarios();
        setMostrarModalEliminar(false);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar usuario');
    } finally {
      setEliminando(false);
    }
  };

  const getRolBadge = (rol: string) => {
    const styles = {
      operador: 'bg-blue-100 text-blue-800 border-blue-300',
      administrador: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return styles[rol as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getRolIcon = (rol: string) => {
    return rol === 'administrador' ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />;
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
              <h1 className="font-playfair text-4xl font-bold mb-2">Gestión de Operadores</h1>
              <p className="font-inter text-lg text-white/90">
                Administra el equipo de operadores y administradores
              </p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition-colors shadow-lg font-inter font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-sm text-gray-600 mb-1">Total Usuarios</p>
                  <p className="font-playfair text-3xl font-bold text-gray-800">{estadisticas.total}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-sm text-gray-600 mb-1">Operadores</p>
                  <p className="font-playfair text-3xl font-bold text-blue-600">{estadisticas.operadores}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-sm text-gray-600 mb-1">Administradores</p>
                  <p className="font-playfair text-3xl font-bold text-purple-600">{estadisticas.administradores}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-2">
            <span className="font-inter text-sm font-semibold text-gray-700">Filtrar por rol:</span>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="todos">Todos</option>
              <option value="operador">Operadores</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-600 to-rose-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Usuario</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Correo</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Rol</th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Fecha Registro</th>
                  
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="font-inter text-gray-500">No hay usuarios para mostrar</p>
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white font-bold font-playfair">
                            {usuario.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-inter text-sm font-semibold text-gray-800">
                            {usuario.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-inter text-sm text-gray-700">
                            {usuario.correo}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border font-inter text-xs font-semibold capitalize ${getRolBadge(usuario.rol)}`}>
                          {getRolIcon(usuario.rol)}
                          <span>{usuario.rol}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-inter text-sm text-gray-700">
                          {new Date(usuario.createdAt).toLocaleDateString('es-AR')}
                        </span>
                      </td>
                     
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => abrirModalEditar(usuario)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmarEliminar(usuario)}
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
                {modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Contraseña {modoEdicion && '(dejar en blanco para no cambiar)'}
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={formData.contraseña}
                    onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12"
                    placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-inter text-sm font-semibold text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="operador">Operador</option>
                  <option value="administrador">Administrador</option>
                </select>
                <p className="font-inter text-xs text-gray-500 mt-2">
                  <strong>Operador:</strong> Gestiona habitaciones, reservas y pagos. <br />
                  <strong>Administrador:</strong> Acceso completo al sistema.
                </p>
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
      {mostrarModalEliminar && usuarioEliminar && (
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
              ¿Eliminar Usuario?
            </h3>
            <p className="font-inter text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar a <strong>{usuarioEliminar.nombre}</strong>? 
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
                onClick={eliminarUsuario}
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