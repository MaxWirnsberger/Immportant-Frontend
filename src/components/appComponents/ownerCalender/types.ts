export type BackendBooking = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone_number: string | null;
  booked_at: string;
  reminder_sent: boolean;
  cancelled: boolean;
  token: string;
};

export type BackendSlot = {
  id: string;
  daily_availability: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_mass_viewing: boolean;
  bookings: BackendBooking[];
};

export type BackendAvailability = {
  id: string;
  property: string;
  date: string;
  start_time: string;
  end_time: string;
  appointment_length: number;
  max_bookings_per_slot: number;
  mass_viewings_enabled: boolean;
  cancellation_deadline_hours: number;
};

export type Booking = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phoneNumber: string | null;
  bookedAt: Date;
  reminderSent: boolean;
  cancelled: boolean;
  token: string;
};

export type Slot = {
  id: string;
  daily_availability: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_mass_viewing: boolean;
  bookings: Booking[];
};

export type Availability = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  appointment_length: number;
  max_bookings_per_slot: number;
  mass_viewings_enabled: boolean;
  cancellation_deadline_hours: number;
};

export type NewAvailabilityState = {
  date: string;
  startTime: string;
  endTime: string;
  appointmentLength: number;
  maxBookingsPerSlot: number;
  massViewingsEnabled: boolean;
  cancellationDeadlineHours: number;
};
