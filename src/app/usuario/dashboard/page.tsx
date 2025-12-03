'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// === SVG Icons === (Mismos iconos)
const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Droplet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
  </svg>
);

const Dumbbell = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6.5 6.5l11 11"></path>
    <path d="M21 21l-1-1"></path>
    <path d="M3 3l1 1"></path>
    <path d="M18 22l-4-4-4 4"></path>
    <path d="M2 6l4 4 4-4"></path>
  </svg>
);

const Coffee = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

const Wifi = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const Utensils = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
  </svg>
);

const Flower = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c-1.1 0-2-.9-2-2v-2.17c-1.17-.41-2.2-1.09-3.07-1.97l-1.53.88c-.95.55-2.17.22-2.72-.73-.55-.95-.22-2.17.73-2.72l1.53-.88c-.29-.96-.46-1.96-.46-3 0-1.04.17-2.04.46-3l-1.53-.88c-.95-.55-1.28-1.77-.73-2.72.55-.95 1.77-1.28 2.72-.73l1.53.88c.87-.88 1.9-1.56 3.07-1.97V2c0-1.1.9-2 2-2s2 .9 2 2v2.17c1.17.41 2.2 1.09 3.07 1.97l1.53-.88c.95-.55 2.17-.22 2.72.73.55.95.22 2.17-.73 2.72l-1.53.88c.29.96.46 1.96.46 3 0 1.04-.17 2.04-.46 3l1.53.88c.95.55 1.28 1.77.73 2.72-.55.95-1.77 1.28-2.72.73l-1.53-.88c-.87.88-1.9 1.56-3.07 1.97V20c0 1.1-.9 2-2 2zm0-8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
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
      subtitle: 'Experimenta lujo y tranquilidad'
    },
    {
      url: '/images/fondo-hotel2.jpeg',
      title: 'Elegancia oriental',
      subtitle: 'Donde la tradición se encuentra con el confort'
    },
    {
      url: '/images/fondo-hotel3.jpeg',
      title: 'Tu refugio perfecto',
      subtitle: 'Momentos inolvidables te esperan'
    },
    {
      url: '/images/fondo-hotel4.jpeg',
      title: 'Experiencias únicas',
      subtitle: 'Descubre un nuevo nivel de hospitalidad'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

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

  const amenities = [
    { icon: Droplet, name: 'Piscina Infinity', color: 'text-blue-500' },
    { icon: Dumbbell, name: 'Gimnasio & Yoga', color: 'text-rose-primary' },
    { icon: Coffee, name: 'Spa & Wellness', color: 'text-rose-accent' },
    { icon: Wifi, name: 'WiFi de Alta Velocidad', color: 'text-gold' },
    { icon: Utensils, name: 'Restaurante Gourmet', color: 'text-rose-secondary' },
    { icon: Flower, name: 'Jardín Zen', color: 'text-green-500' },
  ];

  return (
    // CAMBIO: Fondo principal a un gris muy claro para el dashboard
    <div className="space-y-0 bg-gray-50 min-h-screen"> 
      
      {/* 1. Hero Carousel */}
      <div className="relative h-[650px] md:h-[800px] overflow-hidden group">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
            {/* Mantenemos el overlay oscuro para que el texto resalte sobre la imagen */}
            <div className="absolute inset-0 bg-black/70"></div> 
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="max-w-5xl space-y-6">
            <Flower className="w-20 h-20 text-[#D4AF37] mx-auto animate-pulse" />
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              The Rose Garden Hotel
            </h1>
            <div className="w-40 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
            <p className="font-cormorant text-2xl md:text-4xl text-white/95 italic drop-shadow-lg">
              {heroImages[currentSlide].title}
            </p>
            <p className="font-inter text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              {heroImages[currentSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide ? 'w-8 h-3 bg-[#D4AF37]' : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Welcome Section */}
      {/* CAMBIO: Fondo a blanco/claro y texto a oscuro */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 bg-white text-gray-800"> 
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="font-inter text-[#7B1D26] uppercase tracking-wider text-sm font-semibold px-6 py-2 bg-[#CA99AB]/20 rounded-full border-2 border-[#CA99AB]/30">
              Raising Comfort to the Highest Level
            </span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mt-6 mb-6">
            Welcome to The Rose Garden Hotel
          </h2>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37] rounded-full"></div>
            <Flower className="w-8 h-8 text-[#7B1D26]" />
            <div className="w-16 h-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent rounded-full"></div>
          </div>
          <p className="font-inter text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Nuestro hotel es la elección perfecta para visitantes que buscan una combinación de encanto y una posición conveniente desde donde explorar los alrededores. Las habitaciones están dispuestas en el primer, segundo y tercer piso. Disfrute de nuestra terraza encantadora o solárium disponible para el uso de huéspedes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-16">
          <div className="space-y-6">
            <img src="/images/hotel.jpeg" alt="Hotel" className="rounded-2xl shadow-xl w-full h-96 object-cover" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/piscina-hotel.jpeg" alt="Piscina" className="rounded-xl shadow-lg h-44 w-full object-cover" />
              <img src="/images/spa-hotel.jpeg" alt="Spa" className="rounded-xl shadow-lg h-44 w-full object-cover" />
            </div>
            <Link
              href="/usuario/habitaciones"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white px-8 py-4 rounded-lg font-cormorant font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Explorar Más</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Featured Rooms */}
      {/* CAMBIO: Fondo a un gris muy claro */}
      

      {/* 4. Amenities (REVERTIDA: Volvemos al degradado original con texto blanco) */}
      <div className="py-16 bg-gradient-to-br from-[#7B1D26] via-[#895A49] to-[#CA99AB] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold mb-4">Nuestras Amenidades</h2>
            <p className="font-inter text-white/90 text-lg">Todo lo que necesitas para una estadía perfecta</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
                  {/* Íconos en Dorado para destacar */}
                  <Icon className="w-12 h-12 mx-auto mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform" /> 
                  <p className="font-cormorant font-semibold text-white">{amenity.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. CTA Final */}
      {/* CAMBIO: Fondo a blanco/claro y texto a oscuro */}
      <div className="py-20 bg-white"> 
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Flower className="w-16 h-16 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ¿Listo para tu próxima experiencia?
          </h2>
          <p className="font-inter text-gray-600 text-lg mb-8">
            Reserva ahora y disfruta de descuentos exclusivos para miembros
          </p>
          <Link
            href="/usuario/habitaciones"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] hover:from-[#D4AF37] hover:to-[#895A49] text-white px-10 py-5 rounded-full font-cormorant font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            <Calendar className="w-6 h-6" />
            <span>Reservar Ahora</span>
          </Link>
        </div>
      </div>
    </div>
  );
}