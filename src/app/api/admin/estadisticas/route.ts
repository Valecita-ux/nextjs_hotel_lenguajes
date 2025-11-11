// src/app/api/admin/estadisticas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || '30'; // días

    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - parseInt(periodo));

    // 1. Estadísticas generales
    const totalHabitaciones = await prisma.habitacion.count();
    const habitacionesDisponibles = await prisma.habitacion.count({
      where: { estado: 'disponible' }
    });
    const habitacionesReservadas = await prisma.habitacion.count({
      where: { estado: 'reservado' }
    });
    const habitacionesMantenimiento = await prisma.habitacion.count({
      where: { estado: 'mantenimiento' }
    });

    // 2. Reservas
    const totalReservas = await prisma.reserva.count();
    const reservasActivas = await prisma.reserva.count({
      where: {
        estado_reserva: 'confirmada',
        fecha_fin: { gte: new Date() }
      }
    });
    const reservasPeriodo = await prisma.reserva.count({
      where: {
        createdAt: { gte: fechaInicio }
      }
    });

    // 3. Ingresos
    const pagosCompletados = await prisma.pago.findMany({
      where: {
        estado_pago: 'completado',
        fecha_pago: { gte: fechaInicio }
      }
    });
    
    const ingresosPeriodo = pagosCompletados.reduce(
      (sum, pago) => sum + Number(pago.monto),
      0
    );

    const ingresosTotales = await prisma.pago.aggregate({
      where: { estado_pago: 'completado' },
      _sum: { monto: true }
    });

    // 4. Usuarios
    const totalUsuarios = await prisma.usuario.count();
    const usuariosClientes = await prisma.usuario.count({
      where: { rol: 'usuario' }
    });
    const usuariosOperadores = await prisma.usuario.count({
      where: { rol: 'operador' }
    });

    // 5. Gráfico: Ingresos por día (últimos 7 días)
    const ingresosPorDia = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      fecha.setHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      const pagos = await prisma.pago.findMany({
        where: {
          estado_pago: 'completado',
          fecha_pago: {
            gte: fecha,
            lte: fechaFin
          }
        }
      });

      const total = pagos.reduce((sum, p) => sum + Number(p.monto), 0);

      ingresosPorDia.push({
        fecha: fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
        ingresos: total
      });
    }

    // 6. Gráfico: Reservas por estado
    const reservasPorEstado = await prisma.reserva.groupBy({
      by: ['estado_reserva'],
      _count: true
    });

    // 7. Gráfico: Habitaciones por tipo
    const habitacionesPorTipo = await prisma.habitacion.groupBy({
      by: ['tipo'],
      _count: true
    });

    // 8. Top 5 habitaciones más reservadas
    const topHabitaciones = await prisma.reserva.groupBy({
      by: ['id_habitaciones'],
      _count: true,
      orderBy: {
        _count: {
          id_habitaciones: 'desc'
        }
      },
      take: 5
    });

    const topHabitacionesDetalle = await Promise.all(
      topHabitaciones.map(async (item) => {
        const habitacion = await prisma.habitacion.findUnique({
          where: { id_habitaciones: item.id_habitaciones }
        });
        return {
          numero: habitacion?.numero_habitaciones,
          tipo: habitacion?.tipo,
          reservas: item._count
        };
      })
    );

    // 9. Consultas pendientes
    const consultasPendientes = await prisma.consulta.count({
      where: { estado: 'pendiente' }
    });

    // 10. Tasa de ocupación
    const tasaOcupacion = totalHabitaciones > 0 
      ? ((habitacionesReservadas / totalHabitaciones) * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      estadisticas: {
        habitaciones: {
          total: totalHabitaciones,
          disponibles: habitacionesDisponibles,
          reservadas: habitacionesReservadas,
          mantenimiento: habitacionesMantenimiento,
          tasaOcupacion: parseFloat(tasaOcupacion as string)
        },
        reservas: {
          total: totalReservas,
          activas: reservasActivas,
          periodo: reservasPeriodo
        },
        ingresos: {
          totales: Number(ingresosTotales._sum.monto || 0),
          periodo: ingresosPeriodo
        },
        usuarios: {
          total: totalUsuarios,
          clientes: usuariosClientes,
          operadores: usuariosOperadores
        },
        consultas: {
          pendientes: consultasPendientes
        }
      },
      graficos: {
        ingresosPorDia,
        reservasPorEstado: reservasPorEstado.map(r => ({
          estado: r.estado_reserva,
          cantidad: r._count
        })),
        habitacionesPorTipo: habitacionesPorTipo.map(h => ({
          tipo: h.tipo,
          cantidad: h._count
        })),
        topHabitaciones: topHabitacionesDetalle
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}