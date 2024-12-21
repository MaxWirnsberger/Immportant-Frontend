"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosInstance";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from "./booking.module.css";

/** Typdefinition für das Booking-Objekt */
interface Booking {
  id: string;
  slot: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

export default function BookingDetailPage() {
  const router = useRouter();
  // Im Pages Router: bookingId und token über router.query
  const { bookingId, token } = router.query as {
    bookingId?: string;
    token?: string;
  };

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  // userMessage, das per DELETE an den Server geschickt wird
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!bookingId || !token) {
      setError("Buchungs-ID oder Token fehlen");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        // Wir nutzen axiosInstance
        const response = await axiosInstance.get(
          `/appointments/public/bookings/${bookingId}/?token=${token}`
        );
        setBooking(response.data);
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.detail || "Fehler beim Laden der Buchung");
        } else {
          setError(err.message || "Unbekannter Fehler beim Laden");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [router.isReady, bookingId, token]);

  // Stornierung
  const handleCancelBooking = async () => {
    if (!bookingId || !token) {
      setError("Buchungs-ID oder Token fehlen");
      return;
    }

    try {
      await axiosInstance
        .delete(`/appointments/public/bookings/${bookingId}/?token=${token}`, {
          data: {
            userMessage,
          },
        })
        .then(() => router.push("/thankyou?type=cancel"));
      setBooking(null);
      setCancelDialogOpen(false);
    } catch (err: any) {
      if (err.response) {
        setError(
          "Fehler: " +
            (err.response.data.detail || JSON.stringify(err.response.data))
        );
      } else {
        setError("Fehler: " + err.message);
      }
    }
  };

  // Lade-Zustand
  if (loading) {
    return (
      <div className={styles.bookingContainer}>
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Buchung</CardTitle>
            <CardDescription>Lade Daten...</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fehleranzeige
  if (error) {
    return (
      <div className={styles.bookingContainer}>
        <Alert variant="destructive" className="w-full max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Falls booking null ist: z. B. storniert oder nicht gefunden
  if (!booking) {
    return (
      <div className={styles.bookingContainer}>
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Buchung</CardTitle>
            <CardDescription>
              Keine Buchung vorhanden (ggf. storniert).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Buchung {booking.slot.date}</CardTitle>
          <CardDescription>Details Ihres gebuchten Termins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Calendar className="mr-2" />
            <span>
              <strong>Datum:</strong> {booking.slot.date}
            </span>
          </div>
          <div className="flex items-center mb-4">
            <Clock className="mr-2" />
            <span>
              <strong>Uhrzeit:</strong> {booking.slot.start_time} -{" "}
              {booking.slot.end_time}
            </span>
          </div>
          <div>
            <label htmlFor="message" className="block font-semibold mb-1">
              Nachricht an den Eigentümer (optional):
            </label>
            <textarea
              id="message"
              //   type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Beispiel: Ich muss leider absagen ..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Termin stornieren</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Termin stornieren</DialogTitle>
                <DialogDescription>
                  Sind Sie sicher, dass Sie diesen Termin stornieren möchten?
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(false)}
                >
                  Abbrechen
                </Button>
                <Button variant="destructive" onClick={handleCancelBooking}>
                  Stornieren
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
