'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// === SVG Icons === (Mismos iconos)
const Home = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
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

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* La forma del globo de diálogo cuadrado con el pico */}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogOut = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Menu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// === Componente Principal ===
export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home, href: '/usuario/dashboard' },
    { id: 'habitaciones', label: 'Habitaciones', icon: Bed, href: '/usuario/habitaciones' },
    { id: 'reservas', label: 'Mis Reservas', icon: Calendar, href: '/usuario/reservas' },
    { id: 'consultas', label: 'Consultas', icon: MessageSquare, href: '/usuario/consultas' },
    { id: 'servicios', label: 'Servicios', icon: Star, href: '/usuario/servicios' },
    { id: 'perfil', label: 'Mi Perfil', icon: User, href: '/usuario/perfil' },
  ];

  const isActive = (href: string) => pathname === href;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    // CAMBIO: Fondo principal a un gris muy claro o blanco
    <div className="min-h-screen bg-gray-50"> 
      
      {/* Top Bar - Marco Superior */}
      <div className="h-3 bg-gradient-to-r from-[#7B1D26] via-[#CA99AB] to-[#D4AF37]"></div>

      {/* Desktop Sidebar */}
      <aside
        // CAMBIO: Fondo claro para el sidebar
        className={`hidden lg:flex lg:flex-col bg-white text-gray-800 shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:w-64' : 'lg:w-20'
        } rounded-r-3xl fixed left-0 top-3 bottom-0 z-40`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className={`flex ${isExpanded ? 'flex-row' : 'flex-col'} items-center space-x-3 transition-all duration-300`}>
            <div className="w-12 h-12 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center p-2 border-2 border-[#D4AF37]/50">
              <img 
                src="/images/logo-hotel.png" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            {isExpanded && (
              <div className="opacity-0 animate-fade-in">
                <p className="font-playfair text-lg font-bold text-gray-800">The Rose Garden</p>
                <p className="font-cormorant text-xs text-[#CA99AB] italic">Hotel & Spa</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
          {menuItems.map(({ id, label, icon: Icon, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={id}
                href={href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white shadow-lg' // Fondo colorido para activo
                    : 'text-gray-600 hover:bg-gray-100' // Colores de inactivo/hover adaptados al claro
                }`}
                title={!isExpanded ? label : undefined}
              >
                <Icon className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'} ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#7B1D26]'}`} />
                {isExpanded && (
                  <span className="ml-3 font-inter font-medium whitespace-nowrap opacity-0 animate-fade-in">
                    {label}
                  </span>
                )}
                
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Usuario y Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className={`flex items-center ${isExpanded ? 'px-3' : 'justify-center'} transition-all duration-300`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B1D26] to-[#D4AF37] flex items-center justify-center text-white font-bold flex-shrink-0 font-playfair">
              {getInitials(user?.nombre || 'Usuario')}
            </div>
            {isExpanded && (
              <div className="ml-3 opacity-0 animate-fade-in overflow-hidden">
                <p className="font-cormorant text-sm font-semibold text-gray-800 truncate">{user?.nombre || 'Usuario'}</p>
                <p className="font-inter text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group relative ${
              !isExpanded && 'justify-center'
            }`}
            title={!isExpanded ? 'Cerrar sesión' : undefined}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'} text-gray-500 group-hover:text-red-600`} />
            {isExpanded && (
              <span className="ml-3 font-inter font-medium opacity-0 animate-fade-in">Cerrar sesión</span>
            )}
            
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-3 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200 mx-4 rounded-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7B1D26] to-[#CA99AB] rounded-full flex items-center justify-center p-2">
              <img src="/images/logo-hotel.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-playfair text-base font-bold text-gray-800">The Rose Garden</p>
              <p className="font-cormorant text-xs text-[#CA99AB] italic">Hotel & Spa</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-[#7B1D26] hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed left-0 top-20 bottom-0 w-64 bg-white text-gray-800 shadow-lg rounded-r-3xl" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-2">
              {menuItems.map(({ id, label, icon: Icon, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-[#7B1D26] to-[#CA99AB] text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-inter font-medium">{label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B1D26] to-[#D4AF37] flex items-center justify-center text-white font-bold font-playfair">
                    {getInitials(user?.nombre || 'Usuario')}
                  </div>
                  <div className="ml-3">
                    <p className="font-cormorant text-sm font-semibold text-gray-800">{user?.nombre || 'Usuario'}</p>
                    <p className="font-inter text-xs text-gray-500">{user?.email || ''}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-inter font-medium">Cerrar sesión</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`bg-gray-50 min-h-screen transition-all duration-300 ${isExpanded ? 'lg:ml-64' : 'lg:ml-20'} pt-3`}>
        <div className="max-w-full">
          {children}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}