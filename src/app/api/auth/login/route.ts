import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar que vengan los datos
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { correo: email }
    })

    // Verificar si existe el usuario
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar contraseña (por ahora sin hash, después implementamos bcrypt)
    if (user.contraseña !== password) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Determinar ruta de redirección según rol
    let redirectPath = '/dashboard'
    if (user.rol === 'administrador') {
      redirectPath = '/admin/dashboard'
    } else if (user.rol === 'operador') {
      redirectPath = '/operador/dashboard'
    } else {
      redirectPath = '/usuario/dashboard'
    }

    // Login exitoso
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.correo,
        rol: user.rol
      },
      redirectPath
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    )
  }
}