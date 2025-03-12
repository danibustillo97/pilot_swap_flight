// components/Navbar.tsx
"use client";
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Hook para detectar clics fuera de un elemento
function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: Event) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useOnClickOutside(notifRef, () => setShowNotifications(false));
  useOnClickOutside(profileRef, () => setShowProfile(false));

  // Función para determinar clases activas en los enlaces
  const navLinkClasses = (href: string) =>
    `text-white hover:text-gray-200 px-3 py-1 border-b-2 ${
      pathname === href ? 'border-white' : 'border-transparent'
    } transition-colors`;

  return (
    <nav className="bg-[#4a286f] px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center">
    
        <div className="flex-1">
          <div className="text-white text-2xl font-bold">ARAJET LOGO</div>
        </div>
    
        <div className="flex-1 flex justify-center space-x-6">
          <Link href="/swap-cases">
            <span className={navLinkClasses('/')}>Solicitudes</span>
          </Link>
          <Link href="/swap-request">
            <span className={navLinkClasses('/about')}>Nueva solicitud</span>
          </Link>
        </div>
 
        <div className="flex-1 flex justify-end items-center space-x-4">
     
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405C18.79 14.79 19 13.895 19 13V8a7 7 0 10-14 0v5c0 .895.21 1.79.405 2.595L5 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
                />
              </svg>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 transition ease-out duration-200">
                <div className="py-2">
                  <p className="px-4 text-gray-700 text-sm">Notificación 1</p>
                  <p className="px-4 text-gray-700 text-sm">Notificación 2</p>
                  <p className="px-4 text-gray-700 text-sm">Notificación 3</p>
                </div>
              </div>
            )}
          </div>
          {/* Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 focus:outline-none"
            >
              <span className="text-gray-800 font-semibold">U</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 transition ease-out duration-200">
                <div className="py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
