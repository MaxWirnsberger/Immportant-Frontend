'use client'

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/router";
import styles from "./message.module.css";
import globalstyle from "../../globalApp.module.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

type Category = 'perfect' | 'maybe' | 'unattractive';

export default function MessagePage() {
  const [realEstateId, setRealEstateId] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { messageId } = router.query;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [invitationMessage, setInvitationMessage] = useState<string>("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [rejectMessage, setRejectMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("interested");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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

  useEffect(() => {
    if (activeTab === "messages") {
      scrollToBottom();
    }
  }, [activeTab, chatMessages]);

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

  const handleCategoryChange = async (newCategory: Category) => {
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

  const handleInvite = () => {
    setIsDialogOpen(true);
  };

  const sendInvitation = async () => {
    if (!message) {
      setError("Nachricht nicht geladen.");
      return;
    }

    if (!invitationMessage.trim()) {
      setError("Nachricht darf nicht leer sein.");
      return;
    }

    try {
      await axiosInstance.post(
        `/feedback/inquire/${message.id}/invite-calendar/`,
        {
          message: invitationMessage,
        }
      );

      const newChatMessage: ChatMessage = {
        id: Date.now().toString(), // Temporäre ID
        sender: "owner",
        message: invitationMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);
      setIsDialogOpen(false);
      setInvitationMessage("");
      setActiveTab("messages");
    } catch (err) {
      console.error("Fehler beim Senden der Einladung:", err);
      setError("Fehler beim Senden der Einladung.");
    }
  };

  const handleReject = () => {
    setIsRejectDialogOpen(true);
  };

  const sendRejection = async () => {
    if (!message) {
      setError("Nachricht nicht geladen.");
      return;
    }

    if (!rejectMessage.trim()) {
      setError("Nachricht darf nicht leer sein.");
      return;
    }

    try {
      await axiosInstance.post(`/feedback/inquire/${message.id}/reject/`, {
        message: rejectMessage,
      });

      const newChatMessage: ChatMessage = {
        id: Date.now().toString(), 
        sender: "owner",
        message: rejectMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);
      setIsRejectDialogOpen(false);
      setRejectMessage("");
      setActiveTab("messages");
    } catch (err) {
      console.error("Fehler beim Senden der Absage:", err);
      setError("Fehler beim Senden der Absage.");
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="interested"
      >
        <TabsList className={styles.registerTabs}>
          <TabsTrigger value="interested">Interessent</TabsTrigger>
          <TabsTrigger value="messages">Nachrichten</TabsTrigger>
        </TabsList>

        <TabsContent value="interested">
          <div className={styles.messageContainer}>
            <div className={styles.actionButtons}>
              <div className={styles.categorySection}>
                <p>Wie findest du die Anfrage?</p>
                <RadioGroup
                  value={message.category || "maybe"}
                  onValueChange={(value: string) => {
                    const category = value as Category;
                    handleCategoryChange(category);
                  }}
                  className={styles.radioGroup}
                >
                  <div className={styles.radioOption}>
                    <RadioGroupItem value="perfect" id="perfect" className="sr-only" />
                    <Label
                      htmlFor="perfect"
                      className={`${styles.radioLabel} ${
                        message.category === 'perfect'
                          ? styles.perfectActive
                          : styles.perfectInactive
                      }`}
                    >
                      Perfekt
                    </Label>
                  </div>
                  <div className={styles.radioOption}>
                    <RadioGroupItem value="maybe" id="maybe" className="sr-only" />
                    <Label
                      htmlFor="maybe"
                      className={`${styles.radioLabel} ${
                        message.category === 'maybe'
                          ? styles.maybeActive
                          : styles.maybeInactive
                      }`}
                    >
                      Vielleicht
                    </Label>
                  </div>
                  <div className={styles.radioOption}>
                    <RadioGroupItem value="unattractive" id="unattractive" className="sr-only" />
                    <Label
                      htmlFor="unattractive"
                      className={`${styles.radioLabel} ${
                        message.category === 'unattractive'
                          ? styles.unattractiveActive
                          : styles.unattractiveInactive
                      }`}
                    >
                      Uninteressant
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

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
            <div className={styles.chatContainer} ref={chatContainerRef}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kalender einladen</DialogTitle>
            <DialogDescription>
              Bitte verfasse eine Nachricht für die Einladung.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nachricht..."
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            className="mt-4"
          />
          <DialogFooter>
            <Button
              className={styles.calenderMessageButton}
              onClick={sendInvitation}
            >
              Senden
            </Button>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Absage senden</DialogTitle>
            <DialogDescription>
              Bitte verfasse eine Nachricht für die Absage.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nachricht..."
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
            className="mt-4"
          />
          <DialogFooter>
            <Button
              className={styles.rejectMessageButton}
              onClick={sendRejection}
            >
              Absagen
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
