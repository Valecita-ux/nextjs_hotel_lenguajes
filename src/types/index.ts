// types/index.ts

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'usuario' | 'operador' | 'administrador';
}

export interface Habitacion {
  id_habitaciones: number;
  numero_habitaciones: string;
  tipo: 'simple' | 'doble' | 'suite' | 'deluxe';
  descripcion: string;
  precio: number | string; // Prisma devuelve Decimal como string en JSON
  estado: 'disponible' | 'reservado' | 'mantenimiento';
  cantidad_personas: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  promedioCalificacion?: number;
  totalComentarios?: number;
  comentarios?: Comentario[];
  reservas?: ReservaFecha[];
}

export interface Comentario {
  id_comentarios: number;
  contenido: string;
  calificacion: number;
  fecha: Date | string;
  usuario: {
    nombre: string;
  };
}

export interface ReservaFecha {
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
}

export interface Reserva {
  pagos: any;
  id_reserva: number;
  id_usuario: number;
  id_habitaciones: number;
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
  estado_reserva: 'confirmada' | 'cancelada' | 'finalizada';
  precio_total: number | string;
  numero_huespedes: number;
  createdAt: Date | string;
  habitacion?: Habitacion;
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio_servicio: number | string;
}

export interface FiltrosHabitacion {
  tipo?: string;
  estado?: string;
  precioMin?: number;
  precioMax?: number;
  personas?: number;
}