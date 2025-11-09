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
      reservasActivas,
      consultasPendientes,
      pagosPendientes
    ] = await Promise.all([
      // Total de habitaciones
      prisma.habitacion.count(),
      
      // Habitaciones disponibles
      prisma.habitacion.count({
        where: { estado: 'disponible' }
      }),
      
      // Reservas activas (confirmadas con check-in hoy o futuro)
      prisma.reserva.count({
        where: {
          estado_reserva: 'confirmada',
          fecha_inicio: { gte: hoy }
        }
      }),
      
      // Consultas pendientes
      prisma.consulta.count({
        where: { estado: 'pendiente' }
      }),
      
      // Pagos pendientes
      prisma.pago.count({
        where: { estado_pago: 'pendiente' }
      })
    ]);

    return NextResponse.json({
      success: true,
      estadisticas: {
        totalHabitaciones,
        habitacionesDisponibles,
        reservasActivas,
        consultasPendientes,
        pagosPendientes
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