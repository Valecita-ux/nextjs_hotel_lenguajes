// src/app/api/servicios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los servicios en paralelo
    const [
      servicios,
      spa,
      actividadesDeportivas,
      paquetesTuristicos,
      restaurante
    ] = await Promise.all([
      prisma.servicio.findMany({
        orderBy: { nombre_servicio: 'asc' }
      }),
      prisma.spa.findMany({
        orderBy: { nombre_tratamiento: 'asc' }
      }),
      prisma.actividadDeportiva.findMany({
        orderBy: { nombre_actividad: 'asc' }
      }),
      prisma.paqueteTuristico.findMany({
        orderBy: { nombre_paquete: 'asc' }
      }),
      prisma.restaurante.findMany({
        where: { disponible: true },
        orderBy: [
          { categoria: 'asc' },
          { nombre_plato: 'asc' }
        ]
      })
    ]);

    // Agrupar restaurante por categoría
    const restaurantePorCategoria = {
      desayuno: restaurante.filter(p => p.categoria === 'desayuno'),
      almuerzo: restaurante.filter(p => p.categoria === 'almuerzo'),
      cena: restaurante.filter(p => p.categoria === 'cena'),
      bebida: restaurante.filter(p => p.categoria === 'bebida')
    };

    return NextResponse.json({
      success: true,
      data: {
        servicios,
        spa,
        actividadesDeportivas,
        paquetesTuristicos,
        restaurante: restaurantePorCategoria
      }
    });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}