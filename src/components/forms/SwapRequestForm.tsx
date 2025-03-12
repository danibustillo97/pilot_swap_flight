// components/forms/SwapRequestForm.tsx

"use client";
import React, { useState } from 'react';

export interface FormData {
  pilotRequesterId: string;
  pilotSwapId: string;
  flightNumber: string;
  flightDate: string;
  routeIATA: string;
}

const SwapRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pilotRequesterId: '',
    pilotSwapId: '',
    flightNumber: '',
    flightDate: '',
    routeIATA: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación: todos los campos deben estar completos.
    for (const key in formData) {
      if (!formData[key as keyof FormData]) {
        setError('Por favor, complete todos los campos.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la llamada a tu API para crear el caso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Solicitud enviada correctamente.');
      setFormData({
        pilotRequesterId: '',
        pilotSwapId: '',
        flightNumber: '',
        flightDate: '',
        routeIATA: '',
      });
      // En un flujo real, aquí dispararías la creación del "caso"
    } catch (err) {
      setError('Error al enviar la solicitud.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#4a286f] mb-8">
          Solicitud de Cambio de Asignación
        </h1>

        {error && (
          <div className="mb-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-center text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección de Datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pilotRequesterId" className="block text-sm font-medium text-gray-700">
                ID Piloto Solicitante
              </label>
              <input
                type="text"
                name="pilotRequesterId"
                id="pilotRequesterId"
                value={formData.pilotRequesterId}
                onChange={handleChange}
                placeholder="Ej: 12345"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#4a286f] focus:ring focus:ring-[#4a286f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="pilotSwapId" className="block text-sm font-medium text-gray-700">
                ID Piloto de Cambio
              </label>
              <input
                type="text"
                name="pilotSwapId"
                id="pilotSwapId"
                value={formData.pilotSwapId}
                onChange={handleChange}
                placeholder="Ej: 67890"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#4a286f] focus:ring focus:ring-[#4a286f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700">
                Número de Vuelo
              </label>
              <input
                type="text"
                name="flightNumber"
                id="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                placeholder="Ej: AA123"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#4a286f] focus:ring focus:ring-[#4a286f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="flightDate" className="block text-sm font-medium text-gray-700">
                Fecha del Vuelo
              </label>
              <input
                type="date"
                name="flightDate"
                id="flightDate"
                value={formData.flightDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#4a286f] focus:ring focus:ring-[#4a286f] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="routeIATA" className="block text-sm font-medium text-gray-700">
              Código IATA de la Ruta (Ej: SDQ-KIN-SDQ)
            </label>
            <input
              type="text"
              name="routeIATA"
              id="routeIATA"
              value={formData.routeIATA}
              onChange={handleChange}
              placeholder="Ej: SDQ-KIN-SDQ"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#4a286f] focus:ring focus:ring-[#4a286f] focus:outline-none"
              required
            />
          </div>

          {/* Sección de Proceso de Aprobación */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Proceso de Aprobación</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-semibold">1.</span> Se envía la solicitud al piloto de cambio.
              </li>
              <li>
                <span className="font-semibold">2.</span> Tras su aprobación, se reenvía a{' '}
                <span className="font-mono">Chiefpilotoffice@arajet.com</span>.
              </li>
              <li>
                <span className="font-semibold">3.</span> IOCC revisa y aprueba la solicitud.
              </li>
              <li>
                <span className="font-semibold">4.</span> Se realiza el cambio en AIMS y se cierra el ticket.
              </li>
            </ul>
          </div>

          {/* Sección de Limitaciones */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Limitaciones</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>- Máximo 5 solicitudes por piloto por mes.</li>
              <li>- Cada solicitud cuenta para ambos pilotos involucrados.</li>
              <li>- No se permitirán más de 20 cambios en 6 meses consecutivos.</li>
            </ul>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="mr-4 rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#4a286f] px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#3a1e5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a286f]"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestForm;
