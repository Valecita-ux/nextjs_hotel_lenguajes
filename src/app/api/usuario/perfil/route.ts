// src/app/api/usuario/perfil/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener datos del perfil
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

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(userId) },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true,
        _count: {
          select: {
            reservas: true,
            consultas: true,
            comentarios: true
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener estadísticas adicionales
    const reservasConfirmadas = await prisma.reserva.count({
      where: {
        id_usuario: parseInt(userId),
        estado_reserva: 'confirmada'
      }
    });

    const consultasRespondidas = await prisma.consulta.count({
      where: {
        id_usuario: parseInt(userId),
        estado: 'respondido'
      }
    });

    return NextResponse.json({
      success: true,
      usuario: {
        ...usuario,
        estadisticas: {
          totalReservas: usuario._count.reservas,
          reservasActivas: reservasConfirmadas,
          totalConsultas: usuario._count.consultas,
          consultasRespondidas,
          totalComentarios: usuario._count.comentarios
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar perfil
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nombre, correo } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Usuario no especificado' },
        { status: 400 }
      );
    }

    // Validar datos
    if (!nombre || nombre.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'El nombre debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (!correo || !correo.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe en otro usuario
    const emailExistente = await prisma.usuario.findFirst({
      where: {
        correo: correo,
        NOT: {
          id_usuario: parseInt(userId)
        }
      }
    });

    if (emailExistente) {
      return NextResponse.json(
        { success: false, message: 'Este email ya está registrado por otro usuario' },
        { status: 409 }
      );
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario: parseInt(userId) },
      data: {
        nombre: nombre.trim(),
        correo: correo.trim()
      },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}

// PATCH - Cambiar contraseña
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contraseñaActual, contraseñaNueva } = body;

    if (!userId || !contraseñaActual || !contraseñaNueva) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud de la nueva contraseña
    if (contraseñaNueva.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(userId) }
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar contraseña actual (sin hash por ahora)
    if (usuario.contraseña !== contraseñaActual) {
      return NextResponse.json(
        { success: false, message: 'La contraseña actual es incorrecta' },
        { status: 401 }
      );
    }

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id_usuario: parseInt(userId) },
      data: {
        contraseña: contraseñaNueva
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cambiar la contraseña' },
      { status: 500 }
    );
  }
}