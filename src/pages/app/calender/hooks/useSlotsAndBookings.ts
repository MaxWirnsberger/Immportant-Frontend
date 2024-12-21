// pages/app/calender/hooks/useSlotsAndBookings.ts
import { useState } from "react";
import { Slot, BackendSlot } from "@/components/appComponents/ownerCalender/types";
import axiosInstance from "@/lib/axiosInstance";

export function useSlotsAndBookings(realEstateId: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchSlotsByDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    try {
      const response = await axiosInstance.get<BackendSlot[]>(
        `/appointments/properties/${realEstateId}/slots/`,
        { params: { year, month, day } }
      );

      const mappedSlots: Slot[] = response.data.map((slot) => ({
        ...slot,
        bookings: slot.bookings.map((b) => ({
          id: b.id,
          firstname: b.firstname,
          lastname: b.lastname,
          email: b.email,
          phoneNumber: b.phone_number,
          bookedAt: new Date(b.booked_at),
          reminderSent: b.reminder_sent,
          cancelled: b.cancelled,
          token: b.token,
        })),
      }));

      setSlots(mappedSlots);
      setError(null);
    } catch (err) {
      setError("Fehler beim Laden der Slots.");
    }
  }

  async function cancelBooking(bookingId: string) {
    await axiosInstance.delete(
      `/appointments/properties/${realEstateId}/bookings/${bookingId}/cancel/`
    );
    setSlots((prevSlots) =>
      prevSlots.map((slot) => ({
        ...slot,
        bookings: slot.bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, cancelled: true } : booking
        ),
      }))
    );
  }

  async function deleteSlot(slotId: string) {
    await axiosInstance.delete(
      `/appointments/properties/${realEstateId}/slots/${slotId}/`
    );
    setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));
  }

  return {
    slots,
    error,
    fetchSlotsByDate,
    cancelBooking,
    deleteSlot,
    setError,
  };
}
