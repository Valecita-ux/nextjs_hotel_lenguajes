import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional, comenta si no quieres borrar)
  await prisma.comentario.deleteMany();
  await prisma.reservaXServicio.deleteMany();
  await prisma.reservaXActividad.deleteMany();
  await prisma.reservaXSpa.deleteMany();
  await prisma.reservaXPaqueteTuristico.deleteMany();
  await prisma.reservaXRestaurante.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.consulta.deleteMany();
  await prisma.habitacion.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.actividadDeportiva.deleteMany();
  await prisma.spa.deleteMany();
  await prisma.paqueteTuristico.deleteMany();
  await prisma.restaurante.deleteMany();
  await prisma.usuario.deleteMany();

  // ===== CREAR USUARIOS =====
  console.log('👤 Creando usuarios...');
  
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin Hotel',
      correo: 'admin@hotel.com',
      contraseña: 'admin123',
      rol: 'administrador'
    }
  });

  const operador = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Operador',
      correo: 'operador@hotel.com',
      contraseña: 'oper123',
      rol: 'operador'
    }
  });

  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'María González',
      correo: 'maria@gmail.com',
      contraseña: 'maria123',
      rol: 'usuario'
    }
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      correo: 'juan@gmail.com',
      contraseña: 'juan123',
      rol: 'usuario'
    }
  });

  // ===== CREAR HABITACIONES =====
  console.log('🏨 Creando habitaciones...');

  const habitaciones = await Promise.all([
    // Habitaciones Simples
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '101',
        tipo: 'simple',
        descripcion: 'Habitación simple acogedora con vista al jardín. Incluye cama individual, escritorio y baño privado.',
        precio: 5000,
        estado: 'disponible',
        cantidad_personas: 1
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '102',
        tipo: 'simple',
        descripcion: 'Habitación simple con decoración minimalista y todas las comodidades básicas.',
        precio: 5000,
        estado: 'disponible',
        cantidad_personas: 1
      }
    }),

    // Habitaciones Dobles
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '201',
        tipo: 'doble',
        descripcion: 'Habitación doble espaciosa con dos camas matrimoniales, TV LED 42" y minibar.',
        precio: 8000,
        estado: 'disponible',
        cantidad_personas: 2
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '202',
        tipo: 'doble',
        descripcion: 'Habitación doble con balcón privado, vista panorámica y baño con ducha de lluvia.',
        precio: 8500,
        estado: 'disponible',
        cantidad_personas: 2
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '203',
        tipo: 'doble',
        descripcion: 'Habitación doble deluxe con diseño contemporáneo y área de trabajo.',
        precio: 8000,
        estado: 'reservado',
        cantidad_personas: 2
      }
    }),

    // Suites
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '301',
        tipo: 'suite',
        descripcion: 'Suite Garden View con vista al jardín zen, sala de estar separada y jacuzzi privado.',
        precio: 15000,
        estado: 'disponible',
        cantidad_personas: 3
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '302',
        tipo: 'suite',
        descripcion: 'Suite Premium con dormitorio king size, living amplio, minibar premium y terraza privada.',
        precio: 18000,
        estado: 'disponible',
        cantidad_personas: 4
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '303',
        tipo: 'suite',
        descripcion: 'Suite Presidencial con dos dormitorios, comedor, cocina equipada y vista panorámica.',
        precio: 25000,
        estado: 'disponible',
        cantidad_personas: 5
      }
    }),

    // Habitaciones Deluxe
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '401',
        tipo: 'deluxe',
        descripcion: 'Habitación Deluxe con cama king size, bañera de hidromasaje y balcón con vista al lago.',
        precio: 12000,
        estado: 'disponible',
        cantidad_personas: 2
      }
    }),
    prisma.habitacion.create({
      data: {
        numero_habitaciones: '402',
        tipo: 'deluxe',
        descripcion: 'Habitación Deluxe Superior con decoración oriental, espacio de meditación y té premium.',
        precio: 13000,
        estado: 'mantenimiento',
        cantidad_personas: 2
      }
    })
  ]);

  // ===== CREAR SERVICIOS =====
  console.log('🛎️ Creando servicios...');

  await Promise.all([
    prisma.servicio.create({
      data: {
        nombre_servicio: 'Desayuno Continental',
        descripcion: 'Buffet de desayuno con opciones internacionales',
        precio_servicio: 800
      }
    }),
    prisma.servicio.create({
      data: {
        nombre_servicio: 'Servicio a la Habitación 24h',
        descripcion: 'Room service disponible las 24 horas',
        precio_servicio: 500
      }
    }),
    prisma.servicio.create({
      data: {
        nombre_servicio: 'Transfer Aeropuerto',
        descripcion: 'Transporte privado desde/hacia el aeropuerto',
        precio_servicio: 2000
      }
    }),
    prisma.servicio.create({
      data: {
        nombre_servicio: 'Late Check-out',
        descripcion: 'Salida tardía hasta las 18:00hs',
        precio_servicio: 1500
      }
    }),
    prisma.servicio.create({
      data: {
        nombre_servicio: 'Lavandería Express',
        descripcion: 'Servicio de lavandería en menos de 24hs',
        precio_servicio: 1000
      }
    })
  ]);

  // ===== CREAR ACTIVIDADES DEPORTIVAS =====
  console.log('⚽ Creando actividades deportivas...');

  await Promise.all([
    prisma.actividadDeportiva.create({
      data: {
        nombre_actividad: 'Clase de Yoga',
        descripcion: 'Sesión de yoga al amanecer en el jardín zen',
        costo_actividad: 1500,
        costo_adicional: 500
      }
    }),
    prisma.actividadDeportiva.create({
      data: {
        nombre_actividad: 'Gimnasio Premium',
        descripcion: 'Acceso al gimnasio con instructor personal',
        costo_actividad: 2000,
        costo_adicional: 800
      }
    }),
    prisma.actividadDeportiva.create({
      data: {
        nombre_actividad: 'Natación Guiada',
        descripcion: 'Clase de natación en piscina infinity',
        costo_actividad: 1800
      }
    }),
    prisma.actividadDeportiva.create({
      data: {
        nombre_actividad: 'Trekking Guiado',
        descripcion: 'Caminata por senderos naturales con guía',
        costo_actividad: 2500
      }
    })
  ]);

  // ===== CREAR TRATAMIENTOS SPA =====
  console.log('💆 Creando tratamientos de spa...');

  await Promise.all([
    prisma.spa.create({
      data: {
        nombre_tratamiento: 'Masaje Relajante',
        descripcion: 'Masaje de cuerpo completo con aceites aromáticos (60 min)',
        costo_tramamiento: 3500
      }
    }),
    prisma.spa.create({
      data: {
        nombre_tratamiento: 'Masaje de Piedras Calientes',
        descripcion: 'Terapia con piedras volcánicas para aliviar tensiones (90 min)',
        costo_tramamiento: 5000
      }
    }),
    prisma.spa.create({
      data: {
        nombre_tratamiento: 'Tratamiento Facial Premium',
        descripcion: 'Limpieza profunda, exfoliación y mascarilla nutritiva (75 min)',
        costo_tramamiento: 4000
      }
    }),
    prisma.spa.create({
      data: {
        nombre_tratamiento: 'Reflexología',
        descripcion: 'Masaje terapéutico de pies y manos (45 min)',
        costo_tramamiento: 2500
      }
    }),
    prisma.spa.create({
      data: {
        nombre_tratamiento: 'Día de Spa Completo',
        descripcion: 'Paquete todo incluido: masaje, facial, sauna y jacuzzi (4 horas)',
        costo_tramamiento: 8500
      }
    })
  ]);

  // ===== CREAR PAQUETES TURÍSTICOS =====
  console.log('🎫 Creando paquetes turísticos...');

  await Promise.all([
    prisma.paqueteTuristico.create({
      data: {
        nombre_paquete: 'Tour Ciudad + Almuerzo',
        descripcion: 'Recorrido por los puntos turísticos principales con almuerzo incluido',
        costo: 4500
      }
    }),
    prisma.paqueteTuristico.create({
      data: {
        nombre_paquete: 'Aventura en las Montañas',
        descripcion: 'Trekking, rappel y almuerzo campestre',
        costo: 6000
      }
    }),
    prisma.paqueteTuristico.create({
      data: {
        nombre_paquete: 'Tour de Vinos',
        descripcion: 'Visita a bodegas locales con degustación',
        costo: 7500
      }
    }),
    prisma.paqueteTuristico.create({
      data: {
        nombre_paquete: 'Día en el Lago',
        descripcion: 'Excursión al lago con kayak y pesca deportiva',
        costo: 5500
      }
    })
  ]);

  // ===== CREAR MENÚ RESTAURANTE =====
  console.log('🍽️ Creando menú del restaurante...');

  await Promise.all([
    // Desayunos
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Desayuno Continental',
        descripcion: 'Café, jugo, medialunas, tostadas con mermelada',
        categoria: 'desayuno',
        precio: 1200,
        disponible: true,
        tiempo_preparacion: 15
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Desayuno Americano',
        descripcion: 'Huevos revueltos, bacon, pancakes, café y jugo',
        categoria: 'desayuno',
        precio: 1800,
        disponible: true,
        tiempo_preparacion: 20
      }
    }),

    // Almuerzos
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Sushi Variado (16 piezas)',
        descripcion: 'Selección de makis, nigiris y sashimi premium',
        categoria: 'almuerzo',
        precio: 3500,
        disponible: true,
        tiempo_preparacion: 30,
        ingredientes_especiales: 'Pescado fresco, alga nori, arroz sushi'
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Lomo a la Pimienta',
        descripcion: 'Lomo de res con salsa de pimienta negra, papas gratinadas',
        categoria: 'almuerzo',
        precio: 4200,
        disponible: true,
        tiempo_preparacion: 35
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Ensalada Caesar con Pollo',
        descripcion: 'Lechuga romana, pollo grillado, croutones, aderezo caesar',
        categoria: 'almuerzo',
        precio: 2200,
        disponible: true,
        tiempo_preparacion: 15
      }
    }),

    // Cenas
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Parrillada para Dos',
        descripcion: 'Selección de carnes premium con guarniciones',
        categoria: 'cena',
        precio: 6500,
        disponible: true,
        tiempo_preparacion: 40
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Risotto de Hongos',
        descripcion: 'Risotto cremoso con hongos portobello y trufa',
        categoria: 'cena',
        precio: 3200,
        disponible: true,
        tiempo_preparacion: 25,
        ingredientes_especiales: 'Hongos portobello, trufa, parmesano'
      }
    }),

    // Bebidas
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Vino Malbec Premium',
        descripcion: 'Botella de vino tinto argentino reserva',
        categoria: 'bebida',
        precio: 2800,
        disponible: true,
        tiempo_preparacion: 5
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Smoothie de Frutas Tropicales',
        descripcion: 'Batido natural de mango, piña y maracuyá',
        categoria: 'bebida',
        precio: 800,
        disponible: true,
        tiempo_preparacion: 5
      }
    }),
    prisma.restaurante.create({
      data: {
        nombre_plato: 'Café Gourmet',
        descripcion: 'Café de grano selecto preparado en cafetera italiana',
        categoria: 'bebida',
        precio: 600,
        disponible: true,
        tiempo_preparacion: 5
      }
    })
  ]);

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`- ${await prisma.usuario.count()} usuarios creados`);
  console.log(`- ${await prisma.habitacion.count()} habitaciones creadas`);
  console.log(`- ${await prisma.servicio.count()} servicios creados`);
  console.log(`- ${await prisma.actividadDeportiva.count()} actividades deportivas creadas`);
  console.log(`- ${await prisma.spa.count()} tratamientos de spa creados`);
  console.log(`- ${await prisma.paqueteTuristico.count()} paquetes turísticos creados`);
  console.log(`- ${await prisma.restaurante.count()} platos del restaurante creados`);
  console.log('\n🔑 Usuarios de prueba:');
  console.log('Admin: admin@hotel.com / admin123');
  console.log('Operador: operador@hotel.com / oper123');
  console.log('Usuario: maria@gmail.com / maria123');
  console.log('Usuario: juan@gmail.com / juan123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });