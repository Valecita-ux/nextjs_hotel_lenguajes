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
      servicios_seleccionados = [],
      spa_seleccionados = [],
      actividades_seleccionadas = [],
      paquetes_seleccionados = [],
      restaurante_seleccionado = []
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
    let desglose: any = {
      precio_habitacion: precioHabitacion * dias,
      dias: dias
    };

    // Calcular precio de servicios adicionales
    if (servicios_seleccionados.length > 0) {
      const serviciosIds = servicios_seleccionados.map((s: any) => s.id_servicio);
      const servicios = await prisma.servicio.findMany({
        where: { id_servicio: { in: serviciosIds } }
      });

      const precio_servicios = servicios_seleccionados.reduce((total: number, item: any) => {
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
      desglose.precio_servicios = precio_servicios;
    }

    // Calcular precio de spa
    if (spa_seleccionados.length > 0) {
      const spaIds = spa_seleccionados.map((s: any) => s.id_spa);
      const spas = await prisma.spa.findMany({
        where: { id_spa: { in: spaIds } }
      });

      const precio_spa = spa_seleccionados.reduce((total: number, item: any) => {
        const spa = spas.find(s => s.id_spa === item.id_spa);
        if (spa) {
          const precio = typeof spa.costo_tramamiento === 'string' 
            ? parseFloat(spa.costo_tramamiento) 
            : Number(spa.costo_tramamiento);
          return total + precio;
        }
        return total;
      }, 0);

      precio_total += precio_spa;
      desglose.precio_spa = precio_spa;
    }

    // Calcular precio de actividades
    if (actividades_seleccionadas.length > 0) {
      const actividadesIds = actividades_seleccionadas.map((a: any) => a.id_actividad);
      const actividades = await prisma.actividadDeportiva.findMany({
        where: { id_actividad: { in: actividadesIds } }
      });

      const precio_actividades = actividades_seleccionadas.reduce((total: number, item: any) => {
        const actividad = actividades.find(a => a.id_actividad === item.id_actividad);
        if (actividad) {
          const precio = typeof actividad.costo_actividad === 'string' 
            ? parseFloat(actividad.costo_actividad) 
            : Number(actividad.costo_actividad);
          return total + precio;
        }
        return total;
      }, 0);

      precio_total += precio_actividades;
      desglose.precio_actividades = precio_actividades;
    }

    // Calcular precio de paquetes
    if (paquetes_seleccionados.length > 0) {
      const paquetesIds = paquetes_seleccionados.map((p: any) => p.id_paquete);
      const paquetes = await prisma.paqueteTuristico.findMany({
        where: { id_paquete: { in: paquetesIds } }
      });

      const precio_paquetes = paquetes_seleccionados.reduce((total: number, item: any) => {
        const paquete = paquetes.find(p => p.id_paquete === item.id_paquete);
        if (paquete) {
          const precio = typeof paquete.costo === 'string' 
            ? parseFloat(paquete.costo) 
            : Number(paquete.costo);
          return total + precio;
        }
        return total;
      }, 0);

      precio_total += precio_paquetes;
      desglose.precio_paquetes = precio_paquetes;
    }

    // Calcular precio de restaurante
    if (restaurante_seleccionado.length > 0) {
      const restauranteIds = restaurante_seleccionado.map((r: any) => r.id_restaurante);
      const platos = await prisma.restaurante.findMany({
        where: { id_restaurante: { in: restauranteIds } }
      });

      const precio_restaurante = restaurante_seleccionado.reduce((total: number, item: any) => {
        const plato = platos.find(p => p.id_restaurante === item.id_restaurante);
        if (plato) {
          const precio = typeof plato.precio === 'string' 
            ? parseFloat(plato.precio) 
            : Number(plato.precio);
          return total + (precio * item.cantidad);
        }
        return total;
      }, 0);

      precio_total += precio_restaurante;
      desglose.precio_restaurante = precio_restaurante;
    }

    // Crear la reserva con todos los servicios en una transacción
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

      // Agregar servicios hotel
      if (servicios_seleccionados.length > 0) {
        await tx.reservaXServicio.createMany({
          data: servicios_seleccionados.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_servicio: item.id_servicio,
            cantidad: item.cantidad
          }))
        });
      }

      // Agregar spa
      if (spa_seleccionados.length > 0) {
        await tx.reservaXSpa.createMany({
          data: spa_seleccionados.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_spa: item.id_spa,
            fecha_servicio: new Date(item.fecha_servicio)
          }))
        });
      }

      // Agregar actividades
      if (actividades_seleccionadas.length > 0) {
        await tx.reservaXActividad.createMany({
          data: actividades_seleccionadas.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_actividad: item.id_actividad,
            fecha_actividad: new Date(item.fecha_actividad)
          }))
        });
      }

      // Agregar paquetes
      if (paquetes_seleccionados.length > 0) {
        await tx.reservaXPaqueteTuristico.createMany({
          data: paquetes_seleccionados.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_paquete: item.id_paquete
          }))
        });
      }

      // Agregar restaurante
      if (restaurante_seleccionado.length > 0) {
        await tx.reservaXRestaurante.createMany({
          data: restaurante_seleccionado.map((item: any) => ({
            id_reserva: reserva.id_reserva,
            id_restaurante: item.id_restaurante,
            cantidad: item.cantidad,
            fecha_consumo: new Date(item.fecha_consumo),
            horario_solicitado: item.horario_solicitado || null,
            observaciones: item.observaciones || null
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
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Reserva creada exitosamente',
      reserva: nuevaReserva,
      desglose
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

    const hoy = new Date();
    if (reserva.fecha_inicio <= hoy) {
      return NextResponse.json(
        { success: false, message: 'No se puede cancelar una reserva que ya comenzó' },
        { status: 400 }
      );
    }

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