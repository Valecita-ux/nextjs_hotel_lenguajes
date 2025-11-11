// src/app/api/operador/pagos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los pagos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    // Construir filtros
    const where: any = {};

    if (estado && estado !== 'todos') {
      where.estado_pago = estado;
    }

    const pagos = await prisma.pago.findMany({
      where,
      include: {
        reserva: {
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
                tipo: true
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
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    });

    // Calcular estadísticas
    const totalPagos = pagos.length;
    const pagosPendientes = pagos.filter(p => p.estado_pago === 'pendiente').length;
    const pagosCompletados = pagos.filter(p => p.estado_pago === 'completado').length;
    const ingresoTotal = pagos
      .filter(p => p.estado_pago === 'completado')
      .reduce((sum, p) => sum + Number(p.monto), 0);

    return NextResponse.json({
      success: true,
      pagos,
      estadisticas: {
        totalPagos,
        pagosPendientes,
        pagosCompletados,
        ingresoTotal
      }
    });

  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener pagos' },
      { status: 500 }
    );
  }
}

// PATCH - Procesar pago
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_pago, estado_pago, metodo_pago } = body;

    if (!id_pago || !estado_pago) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar estados
    const estadosValidos = ['pendiente', 'completado', 'fallido'];
    if (!estadosValidos.includes(estado_pago)) {
      return NextResponse.json(
        { success: false, message: 'Estado de pago inválido' },
        { status: 400 }
      );
    }

    // Generar número de transacción si se completa el pago
    const numero_transaccion = estado_pago === 'completado' 
      ? `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      : null;

    // Actualizar pago
    const pago = await prisma.pago.update({
      where: { id_pago: parseInt(id_pago) },
      data: {
        estado_pago,
        metodo_pago: metodo_pago || 'pendiente',
        numero_transaccion,
        fecha_pago: estado_pago === 'completado' ? new Date() : undefined
      },
      include: {
        reserva: {
          include: {
            usuario: true,
            habitacion: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pago actualizado correctamente',
      pago
    });

  } catch (error) {
    console.error('Error al procesar pago:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar pago' },
      { status: 500 }
    );
  }
}