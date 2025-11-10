// src/app/api/operador/habitaciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las habitaciones con info de reservas
export async function GET() {
  try {
    const habitaciones = await prisma.habitacion.findMany({
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
          orderBy: {
            fecha_inicio: 'asc'
          },
          take: 1
        },
        _count: {
          select: {
            reservas: true
          }
        }
      },
      orderBy: {
        numero_habitaciones: 'asc'
      }
    });

    // Agrupar por piso
    const habitacionesPorPiso = habitaciones.reduce((acc: any, hab) => {
      const piso = hab.numero_habitaciones.charAt(0);
      if (!acc[piso]) {
        acc[piso] = [];
      }
      acc[piso].push(hab);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      habitaciones,
      habitacionesPorPiso
    });

  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener habitaciones' },
      { status: 500 }
    );
  }
}

// PATCH - Cambiar estado de habitación
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_habitacion, nuevo_estado } = body;

    if (!id_habitacion || !nuevo_estado) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el estado sea válido
    const estadosValidos = ['disponible', 'reservado', 'mantenimiento'];
    if (!estadosValidos.includes(nuevo_estado)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Actualizar estado
    const habitacion = await prisma.habitacion.update({
      where: { id_habitaciones: parseInt(id_habitacion) },
      data: { estado: nuevo_estado }
    });

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado correctamente',
      habitacion
    });

  } catch (error) {
    console.error('Error al actualizar habitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar habitación' },
      { status: 500 }
    );
  }
}