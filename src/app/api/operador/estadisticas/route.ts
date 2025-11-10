// src/app/api/operador/estadisticas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Obtener estadísticas en paralelo
    const [
      totalHabitaciones,
      habitacionesDisponibles,
      habitacionesReservadas,
      habitacionesMantenimiento,
      todasReservas,
      reservasConfirmadas,
      reservasHoy,
      consultasTotal,
      consultasPendientes,
      consultasRespondidas,
      pagosTotal,
      pagosPendientes,
      pagosCompletados
    ] = await Promise.all([
      // Total de habitaciones
      prisma.habitacion.count(),
      
      // Habitaciones por estado
      prisma.habitacion.count({
        where: { estado: 'disponible' }
      }),
      prisma.habitacion.count({
        where: { estado: 'reservado' }
      }),
      prisma.habitacion.count({
        where: { estado: 'mantenimiento' }
      }),
      
      // Reservas
      prisma.reserva.count(),
      prisma.reserva.count({
        where: { estado_reserva: 'confirmada' }
      }),
      prisma.reserva.count({
        where: {
          estado_reserva: 'confirmada',
          AND: [
            { fecha_inicio: { lte: hoy } },
            { fecha_fin: { gte: hoy } }
          ]
        }
      }),
      
      // Consultas
      prisma.consulta.count(),
      prisma.consulta.count({
        where: { estado: 'pendiente' }
      }),
      prisma.consulta.count({
        where: { estado: 'respondido' }
      }),
      
      // Pagos
      prisma.pago.count(),
      prisma.pago.count({
        where: { estado_pago: 'pendiente' }
      }),
      prisma.pago.count({
        where: { estado_pago: 'completado' }
      })
    ]);

    // Log para debug
    console.log('📊 Estadísticas del operador:', {
      totalHabitaciones,
      habitacionesDisponibles,
      reservasConfirmadas,
      consultasPendientes,
      pagosPendientes
    });

    return NextResponse.json({
      success: true,
      estadisticas: {
        // Habitaciones
        totalHabitaciones,
        habitacionesDisponibles,
        habitacionesReservadas,
        habitacionesMantenimiento,
        
        // Reservas
        totalReservas: todasReservas,
        reservasActivas: reservasConfirmadas, // Cambiado: todas las confirmadas
        reservasHoy,
        
        // Consultas
        totalConsultas: consultasTotal,
        consultasPendientes,
        consultasRespondidas,
        
        // Pagos
        totalPagos: pagosTotal,
        pagosPendientes,
        pagosCompletados
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas', error: String(error) },
      { status: 500 }
    );
  }
}