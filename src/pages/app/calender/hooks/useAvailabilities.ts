// pages/app/calender/hooks/useAvailabilities.ts
import { useState } from "react";
import { Availability, BackendAvailability } from "@/components/appComponents/ownerCalender/types";
import axiosInstance from "@/lib/axiosInstance";

export function useAvailabilities(realEstateId: string) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchAvailabilities() {
    try {
      const response = await axiosInstance.get<BackendAvailability[]>(
        `/appointments/properties/${realEstateId}/availabilities/`
      );
      setAvailabilities(response.data);
      const datesWithAvailability = response.data.map((a) => a.date);
      setAvailableDates([...new Set(datesWithAvailability)]);
      setError(null);
    } catch (err: any) {
      setError("Fehler beim Laden der Verfügbarkeiten.");
    }
  }

  async function addAvailability(data: Omit<BackendAvailability, "id" | "property">) {
    const response = await axiosInstance.post<BackendAvailability>(
      `/appointments/properties/${realEstateId}/availabilities/`,
      data
    );
    setAvailabilities((prev) => [...prev, response.data]);
    setAvailableDates((prev) => [...prev, response.data.date]);
  }

  async function updateAvailability(id: string, data: Partial<BackendAvailability>) {
    const response = await axiosInstance.put<BackendAvailability>(
      `/appointments/properties/${realEstateId}/availabilities/${id}/`,
      data
    );
    setAvailabilities((prev) =>
      prev.map((a) => (a.id === id ? response.data : a))
    );

    // Datum aktualisieren, falls es sich geändert hat
    const oldAvailability = availabilities.find((a) => a.id === id);
    if (oldAvailability && response.data.date !== oldAvailability.date) {
      setAvailableDates((prev) => [
        ...prev.filter((d) => d !== oldAvailability.date),
        response.data.date,
      ]);
    }
  }

  async function deleteAvailability(id: string) {
    const deletedAvailability = availabilities.find((a) => a.id === id);
    await axiosInstance.delete(
      `/appointments/properties/${realEstateId}/availabilities/${id}/`
    );
    setAvailabilities((prev) => prev.filter((a) => a.id !== id));
    if (deletedAvailability) {
      const exists = availabilities.some(
        (a) => a.date === deletedAvailability.date && a.id !== id
      );
      if (!exists) {
        setAvailableDates((prev) =>
          prev.filter((date) => date !== deletedAvailability.date)
        );
      }
    }
  }

  return {
    availabilities,
    availableDates,
    error,
    fetchAvailabilities,
    addAvailability,
    updateAvailability,
    deleteAvailability,
    setError,
  };
}
