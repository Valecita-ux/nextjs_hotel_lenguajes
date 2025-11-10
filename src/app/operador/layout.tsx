// src/app/operador/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Bed, Calendar, MessageSquare, LogOut, Menu, X, 
  Users, Star, DollarSing
} from '@/components/icons/Icons';

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function OperadorLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verificar que sea operador
      if (parsedUser.rol !== 'operador') {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/operador/dashboard' },
    { id: 'habitaciones', label: 'Habitaciones', icon: Bed, href: '/operador/habitaciones' },
    { id: 'reservas', label: 'Reservas', icon: Calendar, href: '/operador/reservas' },
    { id: 'pagos', label: 'Pagos', icon: DollarSign, href: '/operador/pagos' },
    { id: 'consultas', label: 'Consultas', icon: MessageSquare, href: '/operador/consultas' }
  ];

  const isActive = (href: string) => pathname === href;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OP';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="h-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"></div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:w-64' : 'lg:w-20'
        } rounded-r-3xl fixed left-0 top-3 bottom-0 z-40`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-white/20">
          <div className={`flex ${isExpanded ? 'flex-row' : 'flex-col'} items-center space-x-3 transition-all duration-300`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-2 border-2 border-white/30">
              <Star className="w-full h-full text-white" />
            </div>
            {isExpanded && (
              <div className="opacity-0 animate-fade-in">
                <p className="font-playfair text-lg font-bold text-white">Panel Operador</p>
                <p className="font-inter text-xs text-white/80">Gestión del Hotel</p>
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
                    ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={!isExpanded ? label : undefined}
              >
                <Icon className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'}`} />
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
        <div className="p-4 border-t border-white/20 space-y-3">
          <div className={`flex items-center ${isExpanded ? 'px-3' : 'justify-center'} transition-all duration-300`}>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold flex-shrink-0 font-playfair border-2 border-white/30">
              {getInitials(user?.nombre)}
            </div>
            {isExpanded && (
              <div className="ml-3 opacity-0 animate-fade-in overflow-hidden">
                <p className="font-cormorant text-sm font-semibold text-white truncate">{user?.nombre || 'Operador'}</p>
                <p className="font-inter text-xs text-white/70 truncate">Operador</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-3 text-white/70 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200 group relative ${
              !isExpanded && 'justify-center'
            }`}
            title={!isExpanded ? 'Cerrar sesión' : undefined}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'}`} />
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
      <div className="lg:hidden fixed top-3 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md z-50 mx-4 rounded-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center p-2">
              <Star className="w-full h-full text-white" />
            </div>
            <div>
              <p className="font-playfair text-base font-bold text-white">Panel Operador</p>
              <p className="font-inter text-xs text-white/80">Gestión del Hotel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-white hover:bg-white/20"
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
          <div className="fixed left-0 top-20 bottom-0 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg rounded-r-3xl" onClick={(e) => e.stopPropagation()}>
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
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-inter font-medium">{label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex items-center px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold font-playfair">
                    {getInitials(user?.nombre)}
                  </div>
                  <div className="ml-3">
                    <p className="font-cormorant text-sm font-semibold text-white">{user?.nombre || 'Operador'}</p>
                    <p className="font-inter text-xs text-white/70">Operador</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-white/70 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
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