import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, password } = await request.json()

    // Validar que vengan los datos
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'El formato del email no es válido' },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Este email ya está registrado' },
        { status: 409 }
      )
    }

    // Crear nuevo usuario (siempre con rol 'usuario' para registros públicos)
    const newUser = await prisma.usuario.create({
      data: {
        nombre: nombre,
        correo: email,
        contraseña: password, // Después implementaremos hash con bcrypt
        rol: 'usuario' // Los clientes siempre se registran como 'usuario'
      }
    })

    // Registro exitoso
    return NextResponse.json({
      success: true,
      message: 'Registro exitoso',
      user: {
        id: newUser.id_usuario,
        nombre: newUser.nombre,
        email: newUser.correo,
        rol: newUser.rol
      }
    })

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    )
  }
}