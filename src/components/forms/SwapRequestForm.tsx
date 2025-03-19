"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type PilotData = {
  Name: string;
  id: number;
  Position: string;
  Position_Description: string;
  Id_Aims: number;
  Email: string;
  IATA_Code: string;
};

type FlightData = {
  Arr: string;
  date: string;
  STA: string;
  Reg: string;
  Dep: string;
  Flt: number;
  STD: string;
};

const SwapRequestForm = () => {
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [step, setStep] = useState(1);
  const [requestingPilotData, setRequestingPilotData] = useState<PilotData | null>(null);
  const [targetPilotData, setTargetPilotData] = useState<PilotData | null>(null);
  const [flightList, setFlightList] = useState<FlightData[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingRequesting, setIsSearchingRequesting] = useState(false);
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  const steps = ["Pilotos", "Vuelo", "Confirmar"];

  const fetchPilotData = async (pilotId: string, type: "requesting" | "target") => {
    if (!pilotId) return;
    if (type === "requesting") {
      setIsSearchingRequesting(true);
    } else {
      setIsSearchingTarget(true);
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/cases/pilot=${pilotId}`);
      if (type === "requesting") {
        setRequestingPilotData(response.data as PilotData);
      } else {
        setTargetPilotData(response.data as PilotData);
      }
    } catch (error) {
      console.error("Error fetching pilot data", error);
    } finally {
      if (type === "requesting") {
        setIsSearchingRequesting(false);
      } else {
        setIsSearchingTarget(false);
      }
    }
  };

  const fetchFlightData = async (date: string) => {
    console.log("Fecha recibida:", date);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/flights/date=${date}`);
      const flights = Array.isArray(response.data) ? response.data : [response.data];
      setFlightList(flights as FlightData[]);
    } catch (error) {
      console.error("Error fetching flight data", error);
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const onSubmit = async (data: any) => {
    if (window.confirm("¿Estás seguro de los datos a enviar?")) {
      try {
        setIsSubmitting(true);

        const payload = {
          request_id: crypto.randomUUID(),
          requesting_pilot_name: requestingPilotData?.Name,
          requesting_pilot_position: requestingPilotData?.Position,
          requesting_pilot_email: requestingPilotData?.Email,
          target_pilot_name: targetPilotData?.Name,
          target_pilot_position: targetPilotData?.Position,
          target_pilot_email: targetPilotData?.Email,
          flight_code: "DM",
          flight_number: selectedFlight?.Flt,
          departure_airport: selectedFlight?.Dep,
          arrival_airport: selectedFlight?.Arr,
          flight_date: selectedFlight?.date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "0",
        };

        await axios.post(`http://127.0.0.1:8000/api/cases/cases_save`, payload);
        alert("Solicitud enviada con éxito");
        reset();
        setRequestingPilotData(null);
        setTargetPilotData(null);
        setFlightList([]);
        setSelectedFlight(null);
        setStep(1);
      } catch (error) {
        console.error("Error submitting swap request", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border-gray-200 border">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Solicitud de Cambio de Vuelo ✈️
      </h2>
      <div className="flex justify-between mb-6">
        {steps.map((label, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              if (index + 1 < step) setStep(index + 1);
            }}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold ${step > index + 1
                  ? "bg-green-500"
                  : step === index + 1
                    ? "bg-[#3c215a]"
                    : "bg-gray-300"
                }`}
            >
              {step > index + 1 ? "✓" : index + 1}
            </div>
            <p className="text-sm mt-1 text-gray-600">{label}</p>
          </div>
        ))}
      </div>
      {step === 1 && (
        <div className="space-y-6">
          {/* Piloto Solicitante */}
          <div>
            <label className="block font-medium text-gray-700">
              ID Piloto Solicitante:
            </label>
            <div className="flex">
              <input
                type="text"
                {...register("requestingPilotId")}
                placeholder="Ingresa ID"
                className={`border border-gray-300 p-3 w-full rounded-l-lg focus:ring-2 focus:ring-[#3c215a]`}
              />
              {watch("requestingPilotId") && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("requestingPilotId", "");
                    setRequestingPilotData(null);
                  }}
                  className="border border-gray-300 px-2 py-1 text-xs bg-red-500 text-white focus:ring-2 focus:ring-red-300"
                >
                  X
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  fetchPilotData(watch("requestingPilotId"), "requesting")
                }
                disabled={!watch("requestingPilotId") || isSearchingRequesting}
                className={`py-3 px-4 rounded-r-lg text-white ${(!watch("requestingPilotId") || isSearchingRequesting)
                    ? "bg-gray-400"
                    : "bg-[#3c215a] hover:bg-[#3c215a]"
                  }`}
              >
                {isSearchingRequesting ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
            {requestingPilotData && (
              <div className="bg-gray-100 p-4 rounded-lg mt-2">
                <p className="font-semibold text-gray-700">
                  Nombre: {requestingPilotData.Name}
                </p>
                <p className="text-gray-600">
                  Rango: {requestingPilotData.Position}
                </p>
                <p className="text-gray-600">
                  Email: {requestingPilotData.Email}
                </p>
              </div>
            )}
          </div>
          {/* Piloto Receptor */}
          <div>
            <label className="block font-medium text-gray-700">
              ID Piloto Receptor:
            </label>
            <div className="flex">
              <input
                type="text"
                {...register("targetPilotId")}
                placeholder="Ingresa ID"
                disabled={!requestingPilotData}
                className="border border-gray-300 p-3 w-full rounded-l-lg focus:ring-2 focus:ring-[#3c215a] disabled:bg-gray-200"
              />
              {watch("targetPilotId") && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("targetPilotId", "");
                    setTargetPilotData(null);
                  }}
                  className="border border-gray-300 px-2 py-1 text-xs bg-red-500 text-white focus:ring-2 focus:ring-red-300"
                >
                  X
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  fetchPilotData(watch("targetPilotId"), "target")
                }
                disabled={!requestingPilotData || !watch("targetPilotId") || isSearchingTarget}
                className={`py-3 px-4 rounded-r-lg text-white ${(!watch("targetPilotId") || isSearchingTarget || !requestingPilotData)
                    ? "bg-gray-400"
                    : "bg-[#3c215a] hover:bg-[#3c215a]"
                  }`}
              >
                {isSearchingTarget ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
            {targetPilotData && (
              <div className="bg-gray-100 p-4 rounded-lg mt-2">
                <p className="font-semibold text-gray-700">
                  Nombre: {targetPilotData.Name}
                </p>
                <p className="text-gray-600">
                  Rango: {targetPilotData.Position}
                </p>
                <p className="text-gray-600">
                  Email: {targetPilotData.Email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleNextStep}
            disabled={!(requestingPilotData && targetPilotData)}
            className={`w-full py-3 rounded-lg transition duration-200 text-white ${!(requestingPilotData && targetPilotData)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3c215a] hover:bg-[#3c215a]"
              }`}
          >
            Siguiente
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <label className="block font-medium text-gray-700">
            Fecha del Vuelo:
          </label>
          <input
            type="date"
            {...register("flightDate")}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#3c215a]"
          />
          <button
            type="button"
            onClick={() => fetchFlightData(watch("flightDate"))}
            disabled={!watch("flightDate")}
            className={`w-full py-3 rounded-lg transition duration-200 text-white ${!watch("flightDate")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3c215a] hover:bg-[#3c215a]"
              }`}
          >
            Buscar Vuelo
          </button>
          {flightList.length > 0 && (
            <div className="space-y-4">
              <label className="block font-medium text-gray-700">
                Seleccione un vuelo:
              </label>
              <select
                onChange={(e) => {
                  const index = e.target.value;
                  if (index !== "") {
                    setSelectedFlight(flightList[parseInt(index)]);
                  } else {
                    setSelectedFlight(null);
                  }
                }}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#3c215a]"
              >
                <option value="">Seleccione un vuelo</option>
                {flightList.map((flight, index) => (
                  <option key={index} value={index}>
                    {`DM - ${flight.Flt} (${flight.Dep} - ${flight.Arr})`}
                  </option>
                ))}
              </select>
              {selectedFlight && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-semibold text-gray-600">
                    Número de Vuelo: <span className="font-bold">DM-</span>
                    {selectedFlight.Flt}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Ruta:</span> {selectedFlight.Dep} - {selectedFlight.Arr}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Fecha:</span> {selectedFlight.date}
                  </p>
                </div>
              )}
              {selectedFlight && (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-lg transition duration-200 text-white bg-[#3c215a] hover:bg-[#3c215a]"
                >
                  Siguiente
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition duration-200"
          >
            Anterior
          </button>
        </div>
      )}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Resumen de Solicitud</h3>
            <div>
              <p className="font-semibold text-gray-700">Piloto Solicitante:</p>
              {requestingPilotData ? (
                <p className="text-gray-600">
                  {requestingPilotData.Name} - {requestingPilotData.Position}
                </p>
              ) : (
                <p className="text-gray-600">No seleccionado</p>
              )}
            </div>
            <div className="mt-2">
              <p className="font-semibold text-gray-700">Piloto Receptor:</p>
              {targetPilotData ? (
                <p className="text-gray-600">
                  {targetPilotData.Name} - {targetPilotData.Position}
                </p>
              ) : (
                <p className="text-gray-600">No seleccionado</p>
              )}
            </div>
            <div className="mt-2">
              <p className="font-semibold text-gray-700">Información de Vuelo:</p>
              {selectedFlight ? (
                <>
                  <p className="text-gray-600">Vuelo: DM - {selectedFlight.Flt}</p>
                  <p className="text-gray-600">
                    Ruta: {selectedFlight.Dep} - {selectedFlight.Arr}
                  </p>
                  <p className="text-gray-600">Fecha: {selectedFlight.date}</p>
                </>
              ) : (
                <p className="text-gray-600">No seleccionado</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Enviando..." : "Enviar Solicitud ✅"}
          </button>
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition duration-200"
          >
            Anterior
          </button>
        </form>
      )}
    </div>
  );
};

export default SwapRequestForm;
