// src/app/api/consultas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener consultas del usuario
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

    const consultas = await prisma.consulta.findMany({
      where: {
        id_usuario: parseInt(userId)
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
        fecha_consulta: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      consultas
    });

  } catch (error) {
    console.error('Error al obtener consultas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener consultas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva consulta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_usuario, asunto, mensaje } = body;

    // Validaciones
    if (!id_usuario || !asunto || !mensaje) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud del asunto
    if (asunto.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'El asunto debe tener al menos 5 caracteres' },
        { status: 400 }
      );
    }

    // Validar longitud del mensaje
    if (mensaje.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'El mensaje debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(id_usuario) }
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear la consulta
    const nuevaConsulta = await prisma.consulta.create({
      data: {
        id_usuario: parseInt(id_usuario),
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
        estado: 'pendiente'
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Consulta enviada exitosamente',
      consulta: nuevaConsulta
    });

  } catch (error) {
    console.error('Error al crear consulta:', error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar la consulta' },
      { status: 500 }
    );
  }
}