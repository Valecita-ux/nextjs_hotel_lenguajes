// app/api/habitaciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filtros opcionales
    const tipo = searchParams.get('tipo');
    const estado = searchParams.get('estado');
    const precioMin = searchParams.get('precioMin');
    const precioMax = searchParams.get('precioMax');
    const personas = searchParams.get('personas');

    // Construir filtros dinámicos
    const where: any = {};

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo;
    }

    if (estado && estado !== 'todos') {
      where.estado = estado;
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio.gte = parseFloat(precioMin);
      if (precioMax) where.precio.lte = parseFloat(precioMax);
    }

    if (personas) {
      where.cantidad_personas = {
        gte: parseInt(personas)
      };
    }

    // Obtener habitaciones con sus relaciones
    const habitaciones = await prisma.habitacion.findMany({
      where,
      include: {
        comentarios: {
          select: {
            calificacion: true,
            contenido: true,
            fecha: true,
            usuario: {
              select: {
                nombre: true
              }
            }
          },
          orderBy: {
            fecha: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            comentarios: true
          }
        }
      },
      orderBy: {
        precio: 'asc'
      }
    });

    // Calcular promedio de calificaciones
    const habitacionesConPromedio = habitaciones.map(habitacion => {
      const totalCalificaciones = habitacion.comentarios.reduce(
        (sum, com) => sum + com.calificacion, 
        0
      );
      const promedioCalificacion = habitacion.comentarios.length > 0
        ? totalCalificaciones / habitacion.comentarios.length
        : 0;

      return {
        ...habitacion,
        promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
        totalComentarios: habitacion._count.comentarios
      };
    });

    return NextResponse.json({
      success: true,
      habitaciones: habitacionesConPromedio,
      total: habitacionesConPromedio.length
    });

  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener habitaciones' },
      { status: 500 }
    );
  }
}

// GET individual - /api/habitaciones/[id]
export async function GET_BY_ID(id: number) {
  try {
    const habitacion = await prisma.habitacion.findUnique({
      where: { id_habitaciones: id },
      include: {
        comentarios: {
          include: {
            usuario: {
              select: {
                nombre: true
              }
            }
          },
          orderBy: {
            fecha: 'desc'
          }
        },
        reservas: {
          where: {
            estado_reserva: 'confirmada',
            fecha_fin: {
              gte: new Date()
            }
          },
          select: {
            fecha_inicio: true,
            fecha_fin: true
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

    // Calcular promedio de calificaciones
    const totalCalificaciones = habitacion.comentarios.reduce(
      (sum, com) => sum + com.calificacion, 
      0
    );
    const promedioCalificacion = habitacion.comentarios.length > 0
      ? totalCalificaciones / habitacion.comentarios.length
      : 0;

    return NextResponse.json({
      success: true,
      habitacion: {
        ...habitacion,
        promedioCalificacion: Math.round(promedioCalificacion * 10) / 10
      }
    });

  } catch (error) {
    console.error('Error al obtener habitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener la habitación' },
      { status: 500 }
    );
  }
}