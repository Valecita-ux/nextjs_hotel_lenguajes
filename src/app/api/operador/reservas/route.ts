// src/app/api/operador/reservas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las reservas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const fecha = searchParams.get('fecha');

    // Construir filtros
    const where: any = {};

    if (estado && estado !== 'todas') {
      where.estado_reserva = estado;
    }

    if (fecha) {
      const fechaBusqueda = new Date(fecha);
      where.AND = [
        { fecha_inicio: { lte: fechaBusqueda } },
        { fecha_fin: { gte: fechaBusqueda } }
      ];
    }

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true
          }
        },
        habitacion: {
          select: {
            id_habitaciones: true,
            numero_habitaciones: true,
            tipo: true,
            precio: true
          }
        },
        pagos: {
          select: {
            id_pago: true,
            monto: true,
            estado_pago: true,
            metodo_pago: true
          }
        },
        servicios: {
          include: {
            servicio: true
          }
        },
        spa: {
          include: {
            spa: true
          }
        },
        actividades: {
          include: {
            actividad: true
          }
        },
        paquetes: {
          include: {
            paquete: true
          }
        },
        restaurante: {
          include: {
            restaurante: true
          }
        }
      },
      orderBy: {
        fecha_inicio: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      reservas
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

// PATCH - Liberar/cambiar estado de reserva
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_reserva, nuevo_estado, motivo } = body;

    if (!id_reserva || !nuevo_estado) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar estados válidos
    const estadosValidos = ['confirmada', 'cancelada', 'finalizada'];
    if (!estadosValidos.includes(nuevo_estado)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Obtener la reserva actual
    const reservaActual = await prisma.reserva.findUnique({
      where: { id_reserva: parseInt(id_reserva) },
      include: {
        habitacion: true
      }
    });

    if (!reservaActual) {
      return NextResponse.json(
        { success: false, message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar estado de la reserva
    const reserva = await prisma.reserva.update({
      where: { id_reserva: parseInt(id_reserva) },
      data: { estado_reserva: nuevo_estado }
    });

    // Si se cancela o finaliza, liberar la habitación
    if (nuevo_estado === 'cancelada' || nuevo_estado === 'finalizada') {
      await prisma.habitacion.update({
        where: { id_habitaciones: reservaActual.id_habitaciones },
        data: { estado: 'disponible' }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Reserva actualizada correctamente',
      reserva
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar reserva' },
      { status: 500 }
    );
  }
}