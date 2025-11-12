// src/app/api/admin/operadores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Se eliminó la importación de bcryptjs

// GET - Obtener todos los operadores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rol = searchParams.get('rol');

    // Construir filtros - operadores y administradores
    const where: any = {
      rol: {
        in: rol === 'todos' || !rol 
          ? ['operador', 'administrador'] 
          : [rol]
      }
    };

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reservas: true,
            comentarios: true,
            consultas: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Estadísticas
    const totalUsuarios = usuarios.length;
    const operadores = usuarios.filter(u => u.rol === 'operador').length;
    const administradores = usuarios.filter(u => u.rol === 'administrador').length;

    return NextResponse.json({
      success: true,
      usuarios,
      estadisticas: {
        total: totalUsuarios,
        operadores,
        administradores
      }
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo operador/administrador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, correo, contraseña, rol } = body;

    // Validaciones
    if (!nombre || !correo || !contraseña || !rol) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar rol
    const rolesValidos = ['operador', 'administrador'];
    if (!rolesValidos.includes(rol)) {
      return NextResponse.json(
        { success: false, message: 'Rol inválido. Debe ser "operador" o "administrador"' },
        { status: 400 }
      );
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { success: false, message: 'Formato de correo inválido' },
        { status: 400 }
      );
    }

    // Verificar que el correo no exista
    const existente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (existente) {
      return NextResponse.json(
        { success: false, message: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (contraseña.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // *** MODIFICADO: Guardar la contraseña sin encriptar ***
    // const hashedPassword = await bcrypt.hash(contraseña, 10); // Línea original de encriptación

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contraseña: contraseña, // Contraseña simple
        rol
      },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `${rol === 'operador' ? 'Operador' : 'Administrador'} creado exitosamente`,
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar operador/administrador
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_usuario, nombre, correo, contraseña, rol } = body;

    if (!id_usuario) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(id_usuario) }
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // No permitir editar usuarios con rol "usuario" (clientes)
    if (usuarioExistente.rol === 'usuario') {
      return NextResponse.json(
        { success: false, message: 'No se pueden editar usuarios clientes desde esta sección' },
        { status: 400 }
      );
    }

    // Si se cambia el correo, verificar que no exista
    if (correo && correo !== usuarioExistente.correo) {
      const correoExistente = await prisma.usuario.findUnique({
        where: { correo }
      });

      if (correoExistente) {
        return NextResponse.json(
          { success: false, message: 'El correo ya está registrado' },
          { status: 400 }
        );
      }

      // Validar formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return NextResponse.json(
          { success: false, message: 'Formato de correo inválido' },
          { status: 400 }
        );
      }
    }

    // Validar rol si se proporciona
    if (rol) {
      const rolesValidos = ['operador', 'administrador'];
      if (!rolesValidos.includes(rol)) {
        return NextResponse.json(
          { success: false, message: 'Rol inválido' },
          { status: 400 }
        );
      }
    }

    // Construir objeto de actualización
    const dataToUpdate: any = {};
    if (nombre) dataToUpdate.nombre = nombre;
    if (correo) dataToUpdate.correo = correo;
    if (rol) dataToUpdate.rol = rol;

    // Si se proporciona contraseña, guardarla sin encriptar
    if (contraseña) {
      if (contraseña.length < 6) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }
      // dataToUpdate.contraseña = await bcrypt.hash(contraseña, 10); // Línea original de encriptación
      dataToUpdate.contraseña = contraseña; // CAMBIO: Asignamos la contraseña simple
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario: parseInt(id_usuario) },
      data: dataToUpdate,
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar operador/administrador
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(id) },
      include: {
        reservas: {
          where: {
            estado_reserva: 'confirmada',
            fecha_fin: {
              gte: new Date()
            }
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

    // No permitir eliminar usuarios con rol "usuario" (clientes)
    if (usuario.rol === 'usuario') {
      return NextResponse.json(
        { success: false, message: 'No se pueden eliminar usuarios clientes desde esta sección' },
        { status: 400 }
      );
    }

    // Verificar que no tenga reservas activas (si fuera cliente)
    if (usuario.reservas.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No se puede eliminar un usuario con reservas activas' 
        },
        { status: 400 }
      );
    }

    // Eliminar usuario
    await prisma.usuario.delete({
      where: { id_usuario: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}