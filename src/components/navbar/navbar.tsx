import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
              <span className="mx-2 text-gray-400">|</span>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/swap-cases"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Gestionar casos
              </Link>
              <Link
                href="/swap-request"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Crear Caso
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* Botón de notificaciones */}
            <button
              type="button"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Ver notificaciones</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            {/* Menú de usuario */}
            <div className="ml-3 relative">
              <button
                type="button"
                className="bg-white flex text-sm rounded-full focus:outline-none"
              >
                <span className="sr-only">Abrir menú de usuario</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="/profile.jpg"
                  alt="Perfil de usuario"
                />
              </button>
              {/* Dropdown del usuario */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
