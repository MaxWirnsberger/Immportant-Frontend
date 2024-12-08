// ubit@Wks.at
// +43 662 8888 636

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/router";
import styles from "./message.module.css";
import globalstyle from "../../globalApp.module.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "owner" | "interested_party";
  message: string;
  timestamp: string;
}

interface Message {
  id: string;
  form_of_address: string | null;
  firstname: string;
  lastname: string;
  company: string | null;
  street: string | null;
  zip_code: string | null;
  location: string | null;
  tel: string | null;
  email: string | null;
  date: string;
  portal: string | null;
  is_read: boolean;
  is_favorite: boolean;
  category: "perfect" | "maybe" | "unattractive" | null;
  chat_messages: ChatMessage[];
}

export default function MessagePage() {
  const [realEstateId, setRealEstateId] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { messageId } = router.query;

  useEffect(() => {
    const storedRealEstateId =
      sessionStorage.getItem("selectedRealEstateId") || "";
    setRealEstateId(storedRealEstateId);
  }, []);

  useEffect(() => {
    if (messageId) {
      const fetchMessage = async () => {
        try {
          const response = await axiosInstance.get(
            `/feedback/message/${messageId}/`
          );
          const messageData: Message = response.data;

          if (!messageData.is_read) {
            await axiosInstance.post(`/feedback/mark-as-read/${messageId}/`);
            setMessage({ ...messageData, is_read: true });
          } else {
            setMessage(messageData);
          }

          // Chat-Nachrichten laden
          const chatResponse = await axiosInstance.get(
            `/feedback/message/${messageId}/chat/`
          );
          setChatMessages(chatResponse.data);
        } catch (err) {
          setError("Fehler beim Laden der Nachricht.");
        }
      };
      fetchMessage();
    }
  }, [messageId]);

  const handleToggleReadStatus = async () => {
    if (!message) {
      setError("Nachricht nicht geladen.");
      return;
    }
    try {
      const newReadStatus = !message.is_read;
      await axiosInstance.patch(`/feedback/message/${messageId}/update/`, {
        is_read: newReadStatus,
      });
      setMessage((prevMessage) =>
        prevMessage ? { ...prevMessage, is_read: newReadStatus } : null
      );
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Lesestatus:", err);
      setError("Fehler beim Aktualisieren des Lesestatus.");
    }
  };

  const handleCategoryChange = async (
    newCategory: "perfect" | "maybe" | "unattractive"
  ) => {
    if (!message) {
      setError("Nachricht nicht geladen.");
      return;
    }
    try {
      await axiosInstance.patch(`/feedback/message/${messageId}/update/`, {
        category: newCategory,
      });
      setMessage((prevMessage) =>
        prevMessage ? { ...prevMessage, category: newCategory } : null
      );
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Kategorie:", err);
      setError("Fehler beim Aktualisieren der Kategorie.");
    }
  };

  const handleInvite = async () => {
    if (!message) return;
    try {
      // Logik für das Versenden der Einladung (z.B. E-Mail senden)

      // Neue ChatMessage hinzufügen
      const response = await axiosInstance.post(
        `/feedback/message/${messageId}/chat/`,
        {
          sender: "owner",
          message: "Sie wurden zu einem Termin eingeladen.",
        }
      );
      setChatMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (err) {
      console.error("Fehler beim Senden der Einladung:", err);
    }
  };

  const handleReject = async () => {
    if (!message) return;
    try {
      // Logik für das Versenden der Absage (z.B. E-Mail senden)

      // Neue ChatMessage hinzufügen
      const response = await axiosInstance.post(
        `/feedback/message/${messageId}/chat/`,
        {
          sender: "owner",
          message: "Ihre Anfrage wurde leider abgelehnt.",
        }
      );
      setChatMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (err) {
      console.error("Fehler beim Senden der Absage:", err);
    }
  };

  if (!realEstateId) {
    return (
      <div className={globalstyle.appMainContainer}>
        <h2 className={styles.pageTitle}>Nachricht</h2>
        <div>
          <div>Immobilien-ID nicht gefunden.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={globalstyle.appMainContainer}>
        <h2 className={styles.pageTitle}>Nachricht</h2>
        <div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className={globalstyle.appMainContainer}>
        <h2 className={styles.pageTitle}>Nachricht</h2>
        <div>
          <div>Lade Nachricht...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={globalstyle.appMainContainer}>
      <h2 className={styles.pageTitle}>
        {message.firstname} {message.lastname}
      </h2>

      <Tabs defaultValue="interested">
        <TabsList className={styles.registerTabs}>
          <TabsTrigger value="interested">Interessent</TabsTrigger>
          <TabsTrigger value="messages">Nachrichten</TabsTrigger>
        </TabsList>

        <TabsContent value="interested">
          <div className={styles.messageContainer}>
            <div className={styles.actionButtons}>
              {/* Kategorie-Buttons */}
              <div>
                <p>Wie findest du die Anfrage?</p>
                <div className={styles.categoryButtons}>
                  <button
                    onClick={() => handleCategoryChange("perfect")}
                    className={`${styles.categoryButton} ${
                      message.category === "perfect" ? styles.active : ""
                    } ${styles.perfect}`}
                  >
                    Perfekt
                  </button>
                  <button
                    onClick={() => handleCategoryChange("maybe")}
                    className={`${styles.categoryButton} ${
                      message.category === "maybe" ? styles.active : ""
                    } ${styles.maybe}`}
                  >
                    Vielleicht
                  </button>
                  <button
                    onClick={() => handleCategoryChange("unattractive")}
                    className={`${styles.categoryButton} ${
                      message.category === "unattractive" ? styles.active : ""
                    } ${styles.unattractive}`}
                  >
                    Uninteressant
                  </button>
                </div>
              </div>
            </div>

            {/* Restlicher Inhalt */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Vorname:</Label>
                <Input value={message.firstname || ""} readOnly />
              </div>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Nachname:</Label>
                <Input value={message.lastname || ""} readOnly />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Adresse:</Label>
                <Input
                  value={`${message.street || ""}, ${message.zip_code || ""} ${
                    message.location || ""
                  }`}
                  readOnly
                />
              </div>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Firma:</Label>
                <Input value={message.company || ""} readOnly />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Email:</Label>
                <Input value={message.email || ""} readOnly />
              </div>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Telefon:</Label>
                <Input value={message.tel || ""} readOnly />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Portal:</Label>
                <Input value={message.portal || ""} readOnly />
              </div>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Datum:</Label>
                <Input
                  value={new Date(message.date).toLocaleString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  readOnly
                />
              </div>
            </div>
            <div className={`${styles.row} ${styles.paddingTop24}`}>
              <div className={styles.fieldGroup}>
                <button
                  className={styles.calenderButton}
                  onClick={handleInvite}
                >
                  <CalendarDays /> Interessent Einladen
                </button>
              </div>
              <div className={styles.fieldGroup}>
                <button
                  className={styles.messageDeleteButton}
                  onClick={handleReject}
                >
                  Absagen
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className={styles.messageContainer}>
            {/* Chat-Anzeige */}
            <div className={styles.chatContainer}>
              {chatMessages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={
                    chatMessage.sender === "owner"
                      ? styles.ownerMessage
                      : styles.interestedPartyMessage
                  }
                >
                  <p>{chatMessage.message}</p>
                  <span className={styles.timestamp}>
                    {new Date(chatMessage.timestamp).toLocaleString("de-DE")}
                  </span>
                </div>
              ))}
            </div>

            {/* Aktionen */}
            <div className={styles.actionButtons}>
              <button
                className={`${styles.is_readButton} ${
                  !message.is_read ? styles.active : ""
                }`}
                onClick={handleToggleReadStatus}
                title={
                  message.is_read
                    ? "Als ungelesen markieren"
                    : "Als gelesen markieren"
                }
              >
                {message.is_read
                  ? "Als Ungelesen markieren"
                  : "Als Gelesen markieren"}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
