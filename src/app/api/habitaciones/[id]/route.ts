// src/app/api/habitaciones/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      );
    }

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
              gte: new Date() // Solo reservas futuras o actuales
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