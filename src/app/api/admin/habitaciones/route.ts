// src/app/api/admin/habitaciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las habitaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const estado = searchParams.get('estado');

    // Construir filtros
    const where: any = {};

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo;
    }

    if (estado && estado !== 'todos') {
      where.estado = estado;
    }

    const habitaciones = await prisma.habitacion.findMany({
      where,
      include: {
        reservas: {
          where: {
            estado_reserva: 'confirmada',
            fecha_fin: {
              gte: new Date()
            }
          },
          include: {
            usuario: {
              select: {
                nombre: true,
                correo: true
              }
            }
          },
          take: 1,
          orderBy: {
            fecha_inicio: 'asc'
          }
        },
        _count: {
          select: {
            reservas: true,
            comentarios: true
          }
        }
      },
      orderBy: {
        numero_habitaciones: 'asc'
      }
    });

    // Estadísticas
    const totalHabitaciones = habitaciones.length;
    const disponibles = habitaciones.filter(h => h.estado === 'disponible').length;
    const reservadas = habitaciones.filter(h => h.estado === 'reservado').length;
    const mantenimiento = habitaciones.filter(h => h.estado === 'mantenimiento').length;

    return NextResponse.json({
      success: true,
      habitaciones,
      estadisticas: {
        total: totalHabitaciones,
        disponibles,
        reservadas,
        mantenimiento
      }
    });

  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener habitaciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva habitación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      numero_habitaciones,
      tipo,
      descripcion,
      precio,
      cantidad_personas,
      estado
    } = body;

    // Validaciones
    if (!numero_habitaciones || !tipo || !descripcion || !precio || !cantidad_personas) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el número de habitación no exista
    const existente = await prisma.habitacion.findUnique({
      where: { numero_habitaciones }
    });

    if (existente) {
      return NextResponse.json(
        { success: false, message: 'El número de habitación ya existe' },
        { status: 400 }
      );
    }

    // Validar tipo
    const tiposValidos = ['simple', 'doble', 'suite', 'deluxe'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { success: false, message: 'Tipo de habitación inválido' },
        { status: 400 }
      );
    }

    // Validar estado
    const estadosValidos = ['disponible', 'reservado', 'mantenimiento'];
    if (estado && !estadosValidos.includes(estado)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Crear habitación
    const nuevaHabitacion = await prisma.habitacion.create({
      data: {
        numero_habitaciones,
        tipo,
        descripcion,
        precio: parseFloat(precio),
        cantidad_personas: parseInt(cantidad_personas),
        estado: estado || 'disponible'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Habitación creada exitosamente',
      habitacion: nuevaHabitacion
    });

  } catch (error) {
    console.error('Error al crear habitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear habitación' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar habitación
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id_habitaciones,
      numero_habitaciones,
      tipo,
      descripcion,
      precio,
      cantidad_personas,
      estado
    } = body;

    if (!id_habitaciones) {
      return NextResponse.json(
        { success: false, message: 'ID de habitación requerido' },
        { status: 400 }
      );
    }

    // Verificar que la habitación existe
    const habitacionExistente = await prisma.habitacion.findUnique({
      where: { id_habitaciones: parseInt(id_habitaciones) }
    });

    if (!habitacionExistente) {
      return NextResponse.json(
        { success: false, message: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    // Si se cambia el número, verificar que no exista
    if (numero_habitaciones && numero_habitaciones !== habitacionExistente.numero_habitaciones) {
      const numeroExistente = await prisma.habitacion.findUnique({
        where: { numero_habitaciones }
      });

      if (numeroExistente) {
        return NextResponse.json(
          { success: false, message: 'El número de habitación ya existe' },
          { status: 400 }
        );
      }
    }

    // Validar tipo si se proporciona
    if (tipo) {
      const tiposValidos = ['simple', 'doble', 'suite', 'deluxe'];
      if (!tiposValidos.includes(tipo)) {
        return NextResponse.json(
          { success: false, message: 'Tipo de habitación inválido' },
          { status: 400 }
        );
      }
    }

    // Validar estado si se proporciona
    if (estado) {
      const estadosValidos = ['disponible', 'reservado', 'mantenimiento'];
      if (!estadosValidos.includes(estado)) {
        return NextResponse.json(
          { success: false, message: 'Estado inválido' },
          { status: 400 }
        );
      }
    }

    // Construir objeto de actualización
    const dataToUpdate: any = {};
    if (numero_habitaciones) dataToUpdate.numero_habitaciones = numero_habitaciones;
    if (tipo) dataToUpdate.tipo = tipo;
    if (descripcion) dataToUpdate.descripcion = descripcion;
    if (precio) dataToUpdate.precio = parseFloat(precio);
    if (cantidad_personas) dataToUpdate.cantidad_personas = parseInt(cantidad_personas);
    if (estado) dataToUpdate.estado = estado;

    // Actualizar habitación
    const habitacionActualizada = await prisma.habitacion.update({
      where: { id_habitaciones: parseInt(id_habitaciones) },
      data: dataToUpdate
    });

    return NextResponse.json({
      success: true,
      message: 'Habitación actualizada exitosamente',
      habitacion: habitacionActualizada
    });

  } catch (error) {
    console.error('Error al actualizar habitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar habitación' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar habitación
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID de habitación requerido' },
        { status: 400 }
      );
    }

    // Verificar que la habitación existe
    const habitacion = await prisma.habitacion.findUnique({
      where: { id_habitaciones: parseInt(id) },
      include: {
        reservas: {
          where: {
            estado_reserva: 'confirmada',
            fecha_fin: {
              gte: new Date()
            }
          }
        }
      }
    });

    if (!habitacion) {
      return NextResponse.json(
        { success: false, message: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que no tenga reservas activas
    if (habitacion.reservas.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No se puede eliminar una habitación con reservas activas' 
        },
        { status: 400 }
      );
    }

    // Eliminar habitación
    await prisma.habitacion.delete({
      where: { id_habitaciones: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Habitación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar habitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar habitación' },
      { status: 500 }
    );
  }
}