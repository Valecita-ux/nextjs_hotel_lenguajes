// src/app/api/reservas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener reservas del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Usuario no especificado' },
        { status: 400 }
      );
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        id_usuario: parseInt(userId)
      },
      include: {
        habitacion: true,
        pagos: true,
        servicios: {
          include: {
            servicio: true
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

// POST - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id_usuario, 
      id_habitacion, 
      fecha_inicio, 
      fecha_fin, 
      numero_huespedes,
      servicios_seleccionados = [], // Array de { id_servicio, cantidad }
      spa_ids = [],
      deportes_ids = [],
      turismo_ids = [],
      restaurant_ids=[],
    } = body;

    // Validaciones básicas
    if (!id_usuario || !id_habitacion || !fecha_inicio || !fecha_fin || !numero_huespedes) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Convertir fechas
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Validar que la fecha de inicio sea futura
    if (inicio < hoy) {
      return NextResponse.json(
        { success: false, message: 'La fecha de inicio debe ser futura' },
        { status: 400 }
      );
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (fin <= inicio) {
      return NextResponse.json(
        { success: false, message: 'La fecha de fin debe ser posterior a la de inicio' },
        { status: 400 }
      );
    }

    // Verificar que la habitación existe y está disponible
    const habitacion = await prisma.habitacion.findUnique({
      where: { id_habitaciones: parseInt(id_habitacion) }
    });

    if (!habitacion) {
      return NextResponse.json(
        { success: false, message: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    if (habitacion.estado !== 'disponible') {
      return NextResponse.json(
        { success: false, message: 'Habitación no disponible' },
        { status: 400 }
      );
    }

    // Validar capacidad
    if (numero_huespedes > habitacion.cantidad_personas) {
      return NextResponse.json(
        { 
          success: false, 
          message: `La habitación tiene capacidad máxima de ${habitacion.cantidad_personas} personas` 
        },
        { status: 400 }
      );
    }

    // Verificar disponibilidad en las fechas seleccionadas
    const reservasExistentes = await prisma.reserva.findMany({
      where: {
        id_habitaciones: parseInt(id_habitacion),
        estado_reserva: 'confirmada',
        OR: [
          {
            AND: [
              { fecha_inicio: { lte: inicio } },
              { fecha_fin: { gt: inicio } }
            ]
          },
          {
            AND: [
              { fecha_inicio: { lt: fin } },
              { fecha_fin: { gte: fin } }
            ]
          },
          {
            AND: [
              { fecha_inicio: { gte: inicio } },
              { fecha_fin: { lte: fin } }
            ]
          }
        ]
      }
    });

    if (reservasExistentes.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'La habitación no está disponible en las fechas seleccionadas' 
        },
        { status: 400 }
      );
    }

    // Calcular precio de la habitación
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    const precioHabitacion = typeof habitacion.precio === 'string' 
      ? parseFloat(habitacion.precio) 
      : Number(habitacion.precio);
    
    let precio_total = precioHabitacion * dias;

    // Calcular precio de servicios adicionales
    let precio_servicios = 0;
    if (servicios_seleccionados.length > 0) {
      const serviciosIds = servicios_seleccionados.map((s: any) => s.id_servicio);
      const servicios = await prisma.servicio.findMany({
        where: {
          id_servicio: {
            in: serviciosIds
          }
        }
      });

      precio_servicios = servicios_seleccionados.reduce((total: number, item: any) => {
        const servicio = servicios.find(s => s.id_servicio === item.id_servicio);
        if (servicio) {
          const precio = typeof servicio.precio_servicio === 'string' 
            ? parseFloat(servicio.precio_servicio) 
            : Number(servicio.precio_servicio);
          return total + (precio * item.cantidad);
        }
        return total;
      }, 0);

      precio_total += precio_servicios;
    }

    // Crear la reserva con servicios en una transacción
    const nuevaReserva = await prisma.$transaction(async (tx) => {
      // Crear reserva
      const reserva = await tx.reserva.create({
        data: {
          id_usuario: parseInt(id_usuario),
          id_habitaciones: parseInt(id_habitacion),
          fecha_inicio: inicio,
          fecha_fin: fin,
          estado_reserva: 'confirmada',
          precio_total: precio_total,
          numero_huespedes: parseInt(numero_huespedes)
        }
      });

      // Agregar servicios si hay
      if (servicios_seleccionados.length > 0) {
        await tx.reservaXServicio.createMany({
          data: servicios_seleccionados.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_servicio: item.id_servicio,
            cantidad: item.cantidad
          }))
        });
      }

      // Crear registro de pago pendiente
      await tx.pago.create({
        data: {
          id_reserva: reserva.id_reserva,
          monto: precio_total,
          metodo_pago: 'pendiente',
          estado_pago: 'pendiente'
        }
      });

      // Obtener reserva completa con relaciones
      return await tx.reserva.findUnique({
        where: { id_reserva: reserva.id_reserva },
        include: {
          habitacion: true,
          servicios: {
            include: {
              servicio: true
            }
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Reserva creada exitosamente',
      reserva: nuevaReserva,
      desglose: {
        precio_habitacion: precioHabitacion * dias,
        precio_servicios: precio_servicios,
        dias: dias
      }
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar reserva
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservaId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!reservaId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar que la reserva existe y pertenece al usuario
    const reserva = await prisma.reserva.findUnique({
      where: { id_reserva: parseInt(reservaId) }
    });

    if (!reserva) {
      return NextResponse.json(
        { success: false, message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    if (reserva.id_usuario !== parseInt(userId)) {
      return NextResponse.json(
        { success: false, message: 'No tienes permiso para cancelar esta reserva' },
        { status: 403 }
      );
    }

    // Verificar que la reserva no haya comenzado
    const hoy = new Date();
    if (reserva.fecha_inicio <= hoy) {
      return NextResponse.json(
        { success: false, message: 'No se puede cancelar una reserva que ya comenzó' },
        { status: 400 }
      );
    }

    // Cancelar la reserva
    await prisma.reserva.update({
      where: { id_reserva: parseInt(reservaId) },
      data: {
        estado_reserva: 'cancelada'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reserva cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cancelar la reserva' },
      { status: 500 }
    );
  }
}