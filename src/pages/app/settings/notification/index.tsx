import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import globalstyle from "../../globalApp.module.css";
import style from "./notification.module.css"
import { Loader2 } from "lucide-react";

interface Notification {
  id: string;
  newsletter: boolean;
}

export default function NotificationPage() {
  const [notification, setNotification] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newsletterActive, setNewsletterActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await axiosInstance.get("/user/profile/");
        setNotification(response.data);
        setNewsletterActive(response.data.newsletter); // Set initial newsletter state
      } catch (err) {
        setError("Fehler beim Laden der Benachrichtigungen.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationSettings();
  }, []);

  const toggleNewsletter = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/", {
        newsletter: !newsletterActive,
      });
      setNewsletterActive(!newsletterActive);
    } catch (err) {
      setError("Fehler beim Aktualisieren der Newsletter-Einstellungen.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={globalstyle.appMainContainer}>
      <h2>Benachrichtigungen</h2>

      <div className={style.notificationContainer}>
        <h3>Newsletter</h3>
        {loading ? (
          <Loader2 className="spinner" />
        ) : (
          <div className="flex items-center space-x-2">
            <Switch
              id="newsletter-switch"
              checked={newsletterActive}
              onCheckedChange={toggleNewsletter}
            />
            <Label htmlFor="newsletter-switch">
              {newsletterActive ? "Newsletter aktiv" : "Newsletter inaktiv"}
            </Label>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
}
