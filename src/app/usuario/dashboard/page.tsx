'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Bed = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 17h20"></path>
    <path d="M6 8V4"></path>
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const Flower = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c-1.1 0-2-.9-2-2v-2.17c-1.17-.41-2.2-1.09-3.07-1.97l-1.53.88c-.95.55-2.17.22-2.72-.73-.55-.95-.22-2.17.73-2.72l1.53-.88c-.29-.96-.46-1.96-.46-3 0-1.04.17-2.04.46-3l-1.53-.88c-.95-.55-1.28-1.77-.73-2.72.55-.95 1.77-1.28 2.72-.73l1.53.88c.87-.88 1.9-1.56 3.07-1.97V2c0-1.1.9-2 2-2s2 .9 2 2v2.17c1.17.41 2.2 1.09 3.07 1.97l1.53-.88c.95-.55 2.17-.22 2.72.73.55.95.22 2.17-.73 2.72l-1.53.88c.29.96.46 1.96.46 3 0 1.04-.17 2.04-.46 3l1.53.88c.95.55 1.28 1.77.73 2.72-.55.95-1.77 1.28-2.72.73l-1.53-.88c-.87.88-1.9 1.56-3.07 1.97V20c0 1.1-.9 2-2 2zm0-8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function UsuarioDashboard() {
  const [user, setUser] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Hero Carousel Images
  const heroImages = [
    {
      url: '/images/fondo-hotel.jpeg',
      title: 'Bienvenido al paraíso',
      description: 'Experimenta lujo y tranquilidad en cada rincón'
    },
    {
      url: '/images/fondo-hotel2.jpeg',
      title: 'Elegancia oriental',
      description: 'Donde la tradición se encuentra con el confort moderno'
    },
    {
      url: '/images/fondo-hotel3.jpeg',
      title: 'Tu refugio perfecto',
      description: 'Momentos inolvidables te esperan'
    },
    {
      url: '/images/fondo-hotel4.jpeg',
      title: 'Experiencias únicas',
      description: 'Descubre un nuevo nivel de hospitalidad'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const featuredRooms = [
    {
      id: 1,
      name: 'Suite Garden View',
      type: 'Suite de lujo',
      price: 15000,
      image: '/images/habitacion-hotel.jpeg',
      description: 'Suite elegante con vista al jardín zen'
    },
    {
      id: 2,
      name: 'Deluxe Room',
      type: 'Habitación doble',
      price: 8000,
      image: '/images/habitacion-hotel2.jpeg',
      description: 'Habitación espaciosa con diseño contemporáneo'
    },
    {
      id: 3,
      name: 'Premium Suite',
      type: 'Suite premium',
      price: 12000,
      image: '/images/habitacion-hotel3.jpeg',
      description: 'Suite con jacuzzi y balcón privado'
    }
  ];

  const services = [
    {
      name: 'Restaurante',
      description: 'Gastronomía internacional de alto nivel',
      image: '/images/restaurante-hotel.jpeg',
      icon: '🍽️'
    },
    {
      name: 'Spa & Wellness',
      description: 'Tratamientos orientales y terapias relajantes',
      image: '/images/spa-hotel.jpeg',
      icon: '🌸'
    },
    {
      name: 'Piscina',
      description: 'Piscina infinity con vista panorámica',
      image: '/images/piscina-hotel.jpeg',
      icon: '🏊'
    },
    {
      name: 'Gastronomía',
      description: 'Experiencias culinarias únicas',
      image: '/images/comida-hotel.jpeg',
      icon: '🍱'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Botón flotante de reserva (móvil) */}
      <Link
        href="/usuario/habitaciones"
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gradient-to-r from-rose-primary to-rose-accent text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse"
      >
        <Calendar className="w-5 h-5" />
        <span className="font-cormorant font-bold">Reservar</span>
      </Link>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-primary via-rose-secondary to-rose-accent p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <Flower className="w-12 h-12 text-gold" />
            <div>
              <h1 className="font-playfair text-3xl font-bold">
                Bienvenido, {user?.nombre || 'Usuario'}
              </h1>
              <p className="font-inter text-white/80 mt-1">
                Disfruta de tu experiencia en The Rose Garden Hotel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-rose-light rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-light rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-rose-primary" />
            </div>
            <span className="font-playfair text-3xl font-bold text-rose-primary">0</span>
          </div>
          <h3 className="font-cormorant text-lg font-semibold text-gray-800 mb-1">Reservas Activas</h3>
          <p className="font-inter text-sm text-gray-500">Próximas estadías programadas</p>
        </div>

        <div className="bg-white border border-rose-light rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-light rounded-lg flex items-center justify-center">
              <Bed className="w-6 h-6 text-rose-primary" />
            </div>
            <span className="font-playfair text-3xl font-bold text-rose-primary">0</span>
          </div>
          <h3 className="font-cormorant text-lg font-semibold text-gray-800 mb-1">Noches Reservadas</h3>
          <p className="font-inter text-sm text-gray-500">Total de noches este año</p>
        </div>

        <div className="bg-white border border-rose-light rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-light rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-rose-primary" />
            </div>
            <span className="font-playfair text-3xl font-bold text-gold">★★★★★</span>
          </div>
          <h3 className="font-cormorant text-lg font-semibold text-gray-800 mb-1">Miembro Gold</h3>
          <p className="font-inter text-sm text-gray-500">Nivel de membresía actual</p>
        </div>
      </div>

      {/* Featured Rooms */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-gray-800">Habitaciones Destacadas</h2>
            <p className="font-inter text-gray-500 mt-1">Descubre nuestras suites más populares</p>
          </div>
          <Link 
            href="/usuario/habitaciones"
            className="flex items-center space-x-2 text-rose-primary hover:text-rose-accent font-cormorant font-semibold transition-colors"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRooms.map((room) => (
            <div key={room.id} className="group bg-white border border-rose-light rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="font-cormorant font-semibold text-rose-primary">${room.price.toLocaleString()}</span>
                  <span className="font-inter text-xs text-gray-600">/noche</span>
                </div>
              </div>
              <div className="p-5">
                <span className="font-inter text-xs text-rose-accent uppercase tracking-wide">{room.type}</span>
                <h3 className="font-playfair text-xl font-bold text-gray-800 mt-1 mb-2">{room.name}</h3>
                <p className="font-inter text-sm text-gray-600 mb-4">{room.description}</p>
                <button className="w-full bg-gradient-to-r from-rose-primary to-rose-accent text-white py-2 rounded-lg font-cormorant font-semibold hover:shadow-lg transition-shadow">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-gray-800">Nuestros Servicios</h2>
            <p className="font-inter text-gray-500 mt-1">Experiencias únicas para tu estadía</p>
          </div>
          <Link 
            href="/usuario/servicios"
            className="flex items-center space-x-2 text-rose-primary hover:text-rose-accent font-cormorant font-semibold transition-colors"
          >
            <span>Ver más</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl bg-white border border-rose-light hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <h3 className="font-playfair text-lg font-bold">{service.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="font-inter text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-primary to-rose-accent p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <Flower className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-playfair text-3xl font-bold mb-3">¿Listo para tu próxima experiencia?</h2>
          <p className="font-inter text-white/90 mb-6">
            Reserva ahora y disfruta de descuentos exclusivos para miembros
          </p>
          <Link 
            href="/usuario/habitaciones"
            className="inline-flex items-center space-x-2 bg-white text-rose-primary px-8 py-3 rounded-lg font-cormorant font-semibold hover:bg-gold hover:text-white transition-all duration-300"
          >
            <span>Reservar Ahora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}