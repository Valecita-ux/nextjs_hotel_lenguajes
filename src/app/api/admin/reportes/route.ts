// src/app/api/admin/reportes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaInicio = searchParams.get('fecha_inicio');
    const fechaFin = searchParams.get('fecha_fin');
    const tipo = searchParams.get('tipo'); // 'habitacion', 'usuario', 'periodo'

    // Construir filtros de fecha
    const whereReserva: any = {};
    const wherePago: any = { estado_pago: 'completado' };

    if (fechaInicio && fechaFin) {
      whereReserva.createdAt = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin)
      };
      wherePago.fecha_pago = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin)
      };
    }

    // 1. Reporte de Ingresos por Método de Pago
    const ingresosPorMetodo = await prisma.pago.groupBy({
      by: ['metodo_pago'],
      where: wherePago,
      _sum: {
        monto: true
      },
      _count: true
    });

    // 2. Reporte de Reservas por Tipo de Habitación
    const reservasPorTipo = await prisma.reserva.groupBy({
      by: ['id_habitaciones'],
      where: whereReserva,
      _count: true
    });

    const reservasPorTipoDetalle = await Promise.all(
      reservasPorTipo.map(async (item) => {
        const habitacion = await prisma.habitacion.findUnique({
          where: { id_habitaciones: item.id_habitaciones }
        });
        return {
          tipo: habitacion?.tipo || 'desconocido',
          cantidad: item._count
        };
      })
    );

    // Agrupar por tipo
    const tiposAgrupados = reservasPorTipoDetalle.reduce((acc: any, item) => {
      if (!acc[item.tipo]) {
        acc[item.tipo] = 0;
      }
      acc[item.tipo] += item.cantidad;
      return acc;
    }, {});

    const reservasPorTipoFinal = Object.entries(tiposAgrupados).map(([tipo, cantidad]) => ({
      tipo,
      cantidad
    }));

    // 3. Top 10 Clientes (más reservas)
    const topClientes = await prisma.reserva.groupBy({
      by: ['id_usuario'],
      where: whereReserva,
      _count: true,
      orderBy: {
        _count: {
          id_usuario: 'desc'
        }
      },
      take: 10
    });

    const topClientesDetalle = await Promise.all(
      topClientes.map(async (item) => {
        const usuario = await prisma.usuario.findUnique({
          where: { id_usuario: item.id_usuario },
          select: {
            nombre: true,
            correo: true
          }
        });

        // Calcular total gastado
        const pagos = await prisma.pago.findMany({
          where: {
            reserva: {
              id_usuario: item.id_usuario
            },
            estado_pago: 'completado',
            ...(fechaInicio && fechaFin ? {
              fecha_pago: {
                gte: new Date(fechaInicio),
                lte: new Date(fechaFin)
              }
            } : {})
          }
        });

        const totalGastado = pagos.reduce((sum, p) => sum + Number(p.monto), 0);

        return {
          nombre: usuario?.nombre || 'Usuario desconocido',
          correo: usuario?.correo || '',
          reservas: item._count,
          totalGastado
        };
      })
    );

    // 4. Ocupación promedio por mes (últimos 6 meses)
    const ocupacionPorMes = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const mes = fecha.getMonth();
      const anio = fecha.getFullYear();

      const primerDia = new Date(anio, mes, 1);
      const ultimoDia = new Date(anio, mes + 1, 0);

      const reservas = await prisma.reserva.findMany({
        where: {
          OR: [
            {
              fecha_inicio: {
                gte: primerDia,
                lte: ultimoDia
              }
            },
            {
              fecha_fin: {
                gte: primerDia,
                lte: ultimoDia
              }
            },
            {
              AND: [
                { fecha_inicio: { lte: primerDia } },
                { fecha_fin: { gte: ultimoDia } }
              ]
            }
          ],
          estado_reserva: 'confirmada'
        }
      });

      const totalHabitaciones = await prisma.habitacion.count();
      const diasMes = ultimoDia.getDate();
      const tasaOcupacion = totalHabitaciones > 0
        ? (reservas.length / (totalHabitaciones * diasMes)) * 100 * diasMes
        : 0;

      ocupacionPorMes.push({
        mes: fecha.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }),
        ocupacion: Math.min(tasaOcupacion, 100).toFixed(1)
      });
    }

    // 5. Servicios más solicitados
    const serviciosMasSolicitados = await prisma.reservaXServicio.groupBy({
      by: ['id_servicio'],
      _sum: {
        cantidad: true
      },
      _count: true,
      orderBy: {
        _count: {
          id_servicio: 'desc'
        }
      },
      take: 5
    });

    const serviciosDetalle = await Promise.all(
      serviciosMasSolicitados.map(async (item) => {
        const servicio = await prisma.servicio.findUnique({
          where: { id_servicio: item.id_servicio }
        });
        return {
          nombre: servicio?.nombre_servicio || 'Servicio desconocido',
          cantidad: item._sum.cantidad || 0,
          veces: item._count
        };
      })
    );

    // 6. Actividades más reservadas
    const actividadesMasReservadas = await prisma.reservaXActividad.groupBy({
      by: ['id_actividad'],
      _count: true,
      orderBy: {
        _count: {
          id_actividad: 'desc'
        }
      },
      take: 5
    });

    const actividadesDetalle = await Promise.all(
      actividadesMasReservadas.map(async (item) => {
        const actividad = await prisma.actividadDeportiva.findUnique({
          where: { id_actividad: item.id_actividad }
        });
        return {
          nombre: actividad?.nombre_actividad || 'Actividad desconocida',
          reservas: item._count
        };
      })
    );

    // 7. Duración promedio de estadías
    const reservasConDuracion = await prisma.reserva.findMany({
      where: whereReserva,
      select: {
        fecha_inicio: true,
        fecha_fin: true
      }
    });

    const duraciones = reservasConDuracion.map(r => {
      const inicio = new Date(r.fecha_inicio);
      const fin = new Date(r.fecha_fin);
      return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    });

    const duracionPromedio = duraciones.length > 0
      ? (duraciones.reduce((sum, d) => sum + d, 0) / duraciones.length).toFixed(1)
      : 0;

    // 8. Tasa de cancelación
    const totalReservas = await prisma.reserva.count({ where: whereReserva });
    const reservasCanceladas = await prisma.reserva.count({
      where: {
        ...whereReserva,
        estado_reserva: 'cancelada'
      }
    });

    const tasaCancelacion = totalReservas > 0
      ? ((reservasCanceladas / totalReservas) * 100).toFixed(1)
      : 0;

    // 9. Ingresos totales del periodo
    const ingresosTotales = ingresosPorMetodo.reduce(
      (sum, item) => sum + Number(item._sum.monto || 0),
      0
    );

    // 10. Promedio de ingresos por reserva
    const promedioIngresosPorReserva = totalReservas > 0
      ? (ingresosTotales / totalReservas).toFixed(2)
      : 0;

    return NextResponse.json({
      success: true,
      reportes: {
        ingresosPorMetodo: ingresosPorMetodo.map(item => ({
          metodo: item.metodo_pago,
          ingresos: Number(item._sum.monto || 0),
          cantidad: item._count
        })),
        reservasPorTipo: reservasPorTipoFinal,
        topClientes: topClientesDetalle,
        ocupacionPorMes,
        serviciosMasSolicitados: serviciosDetalle,
        actividadesMasReservadas: actividadesDetalle,
        metricas: {
          duracionPromedio: parseFloat(duracionPromedio as string),
          tasaCancelacion: parseFloat(tasaCancelacion as string),
          ingresosTotales,
          promedioIngresosPorReserva: parseFloat(promedioIngresosPorReserva as string),
          totalReservas,
          reservasCanceladas
        }
      }
    });

  } catch (error) {
    console.error('Error al generar reportes:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar reportes' },
      { status: 500 }
    );
  }
}