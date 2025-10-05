import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear usuarios
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin Hotel',
      correo: 'admin@hotel.com',
      contraseña: 'admin123', // En producción usar bcrypt
      rol: 'administrador'
    }
  })

  const operador = await prisma.usuario.create({
    data: {
      nombre: 'Juan Operador',
      correo: 'operador@hotel.com',
      contraseña: 'oper123',
      rol: 'operador'
    }
  })

  const usuario = await prisma.usuario.create({
    data: {
      nombre: 'María Cliente',
      correo: 'maria@email.com',
      contraseña: 'user123',
      rol: 'usuario'
    }
  })

  // Crear habitaciones
  await prisma.habitacion.createMany({
    data: [
      {
        numero_habitaciones: '101',
        tipo: 'simple',
        descripcion: 'Habitación simple con vista al jardín',
        precio: 5000.00,
        cantidad_personas: 1,
        estado: 'disponible'
      },
      {
        numero_habitaciones: '201',
        tipo: 'doble',
        descripcion: 'Habitación doble con balcón',
        precio: 8000.00,
        cantidad_personas: 2,
        estado: 'disponible'
      },
      {
        numero_habitaciones: '301',
        tipo: 'suite',
        descripcion: 'Suite de lujo con jacuzzi',
        precio: 15000.00,
        cantidad_personas: 4,
        estado: 'disponible'
      }
    ]
  })

  // Crear servicios
  await prisma.servicio.createMany({
    data: [
      { nombre_servicio: 'WiFi Premium', descripcion: 'Internet de alta velocidad', precio_servicio: 500.00 },
      { nombre_servicio: 'Estacionamiento', descripcion: 'Plaza de estacionamiento cubierta', precio_servicio: 800.00 },
      { nombre_servicio: 'Transfer aeropuerto', descripcion: 'Traslado desde/hacia aeropuerto', precio_servicio: 2000.00 }
    ]
  })

  // Crear items del restaurante
  await prisma.restaurante.createMany({
    data: [
      { nombre_plato: 'Desayuno continental', categoria: 'desayuno', descripcion: 'Café, medialunas, jugo', precio: 1500.00, tiempo_preparacion: 15 },
      { nombre_plato: 'Almuerzo ejecutivo', categoria: 'almuerzo', descripcion: 'Entrada, plato principal, postre', precio: 3500.00, tiempo_preparacion: 30 },
      { nombre_plato: 'Cena romántica', categoria: 'cena', descripcion: 'Menú especial para dos personas', precio: 8000.00, tiempo_preparacion: 45 }
    ]
  })

  // Crear tratamientos de spa
  await prisma.spa.createMany({
    data: [
      { nombre_tratamiento: 'Masaje relajante', descripcion: '60 minutos de masajes', costo_tramamiento: 4000.00 },
      { nombre_tratamiento: 'Facial rejuvenecedor', descripcion: 'Tratamiento facial completo', costo_tramamiento: 3500.00 }
    ]
  })

  // Crear actividades deportivas
  await prisma.actividadDeportiva.createMany({
    data: [
      { nombre_actividad: 'Tenis', descripcion: 'Cancha de tenis por 1 hora', costo_actividad: 1500.00 },
      { nombre_actividad: 'Gimnasio', descripcion: 'Acceso al gimnasio', costo_actividad: 800.00 },
      { nombre_actividad: 'Piscina VIP', descripcion: 'Área exclusiva de piscina', costo_actividad: 2000.00, costo_adicional: 500.00 }
    ]
  })

  // Crear paquetes turísticos
  await prisma.paqueteTuristico.createMany({
    data: [
      { nombre_paquete: 'City Tour', descripcion: 'Recorrido por la ciudad', costo: 5000.00 },
      { nombre_paquete: 'Aventura extrema', descripcion: 'Parapente + rafting', costo: 12000.00 },
      { nombre_paquete: 'Relax total', descripcion: '3 tratamientos de spa + yoga', costo: 8500.00 }
    ]
  })

  console.log('✅ Base de datos poblada exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })