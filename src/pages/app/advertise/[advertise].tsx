import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./advertise.module.css";
import globalstyle from "../globalApp.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Circle, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

type PortalStatus = {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  activationDate: string | null;
  expirationDate: string | null;
  errorNotification?: string | null;
  isPublished: boolean;
};

export default function PortalManagementPage() {
  const [realEstateId, setRealEstateId] = useState<string>("");
  const [portalStatuses, setPortalStatuses] = useState<PortalStatus[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<PortalStatus | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "INACTIVE" | null>(
    null
  );
  const [bulkStatus, setBulkStatus] = useState<"ACTIVE" | "INACTIVE" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter(); // Initialisieren des Routers

  const handleBulkAction = () => {
    const allActive =
      portalStatuses.length > 0 &&
      portalStatuses.every((portal) => portal.status === "ACTIVE");
    const desiredStatus: "ACTIVE" | "INACTIVE" = allActive
      ? "INACTIVE"
      : "ACTIVE";
    setBulkStatus(desiredStatus);
    setShowDialog(true);
  };

  const confirmStatusChange = () => {
    console.log("realEstateId:", realEstateId); // Debugging
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (bulkStatus) {
      // API-Anfrage zum Aktualisieren aller Portale
      axiosInstance
        .put(`/manage-portal/immo/${realEstateId}/`, { status: bulkStatus })
        .then((response) => {
          setSuccessMessage(
            `Die Portale werden ${
              bulkStatus === "ACTIVE" ? "aktiviert" : "deaktiviert"
            }. Dies kann einige Zeit in Anspruch nehmen.`
          );
          setShowSuccessDialog(true);
          setShowDialog(false);
        })
        .catch((error) => {
          console.error("Error updating portal statuses:", error);
          setError("Fehler beim Aktualisieren der Portal-Status.");
        })
        .finally(() => {
          setIsLoading(false);
          setBulkStatus(null);
        });
    }
  };

  useEffect(() => {
    const storedRealEstateId =
      sessionStorage.getItem("selectedRealEstateId") || "";
    console.log("storedRealEstateId:", storedRealEstateId); // Debugging
    setRealEstateId(storedRealEstateId);

    if (storedRealEstateId) {
      fetchPortalStatuses(storedRealEstateId);
    }
  }, []);

  const fetchPortalStatuses = (id: string) => {
    axiosInstance
      .get(`/real-estate/detail/${id}/?fields=portals`)
      .then((response) => {
        const fetchedPortals = response.data.portals.map((portal: any) => ({
          name: portal.portal,
          status: portal.status,
          activationDate: portal.last_exported,
          expirationDate: portal.advertised_until,
          errorNotification: portal.error_notification || null,
          isPublished: portal.is_published,
        }));
        setPortalStatuses(fetchedPortals);
      })
      .catch((error) => {
        console.error("Error fetching portal statuses:", error);
        setError("Fehler beim Abrufen der Portal-Status.");
      });
  };

  const getPortalImageProps = (portalName: string) => {
    switch (portalName) {
      case "Immo-Scout":
        return {
          src: "/images/app/portal/immo-scout.svg",
          width: 100,
          height: 60,
        };
      case "Kleinanzeigen":
        return {
          src: "/images/app/portal/kleinanzeigen.svg",
          width: 200,
          height: 34,
        };
      case "Immowelt":
        return {
          src: "/images/app/portal/immowelt.png",
          width: 180,
          height: 41,
        };
      default:
        return { src: "/images/app/portal/default.svg", width: 50, height: 50 }; // Fallback-Bild
    }
  };

  const renderStatusContent = (portal: PortalStatus) => {
    // Zuerst prüfen, ob eine Fehlermeldung vorhanden ist
    if (portal.errorNotification && portal.errorNotification.trim() !== "") {
      return (
        <div className={styles.errorContainer}>
          <AlertCircle className={styles.errorIcon} />
          <div>
            <p className={styles.statusTextSmall}>Error</p>
            <p
              className={styles.statusTextBase}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {portal.errorNotification}
            </p>
          </div>
        </div>
      );
    }

    if (!portal.isPublished) {
      return (
        <div className={styles.emptyContainer}>
          <Circle className={styles.statusIcon} />
          <div>
            <p className={styles.statusTextSmall}>Status</p>
            <p className={styles.statusTextBase}>Noch nicht veröffentlicht</p>
          </div>
        </div>
      );
    }

    if (portal.isPublished && portal.status === "INACTIVE") {
      return (
        <div className={styles.emptyContainer}>
          <Circle className={styles.statusIcon} />
          <div>
            <p className={styles.statusTextSmall}>Status</p>
            <p className={styles.statusTextBase}>Portal ist inaktiv</p>
          </div>
        </div>
      );
    }

    if (portal.isPublished && portal.status === "ACTIVE") {
      return (
        <div className={styles.statusContainer}>
          <CheckCircle2 className={styles.statusIcon} />
          <div>
            <p className={styles.statusTextSmall}>Status</p>
            <p className={styles.statusTextBase}>Erfolgreich online</p>
          </div>
        </div>
      );
    }

    return null;
  };

  // Berechnen Sie, ob alle Portale aktiv sind
  const allActive = useMemo(() => {
    return (
      portalStatuses?.length > 0 &&
      portalStatuses.every((portal) => portal.status === "ACTIVE")
    );
  }, [portalStatuses]);

  // Bestimmen Sie das Button-Label basierend auf dem Gesamtstatus
  const bulkButtonLabel = allActive ? "Alle Deaktivieren" : "Alle Aktivieren";

  return (
    <div className={globalstyle.appMainContainer}>
      <h2 className={styles.pageTitle}>Portalmanager</h2>

      {/* Ein einzelner Button für Bulk-Aktionen */}
      <div className={styles.buttonContainer}>
        <Button
          className={
            allActive ? styles.deactivateButton : styles.activateButton
          }
          onClick={handleBulkAction}
          disabled={isLoading}
        >
          {isLoading ? "Bitte warten..." : bulkButtonLabel}
        </Button>
      </div>

      {/* Fehlermeldung  */}
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      {/* Bedingtes Rendering basierend auf realEstateId */}
      {!realEstateId ? (
        <div>
          <div>Immobilien-ID nicht gefunden.</div>
        </div>
      ) : (
        <div className={styles.portalManagementContainer}>
          {portalStatuses?.map((portal) => (
            <Card key={portal.name} className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>
                  <Image
                    {...getPortalImageProps(portal.name)}
                    alt={portal.name}
                    className={styles.portalImage}
                  />
                  <div
                    className={`${styles.statusBadge} ${
                      portal.status === "ACTIVE"
                        ? styles.activeStatus
                        : styles.inactiveStatus
                    }`}
                  >
                    {portal.status}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.spaceY6}>
                  <div className={styles.timeArea}>
                    <div className={styles.flexItemsCenter}>
                      <Calendar className={styles.calendarIcon} />
                      <div>
                        <p className={styles.activationDateText}>
                          Aktivierungsdatum
                        </p>
                        <p className={styles.expirationDateText}>
                          {portal.activationDate
                            ? new Date(portal.activationDate).toLocaleString(
                                "de-DE",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )
                            : "Noch nicht Online"}
                        </p>
                      </div>
                    </div>
                    <div className={styles.flexItemsCenter}>
                      <Calendar className={styles.calendarIcon} />
                      <div>
                        <p className={styles.activationDateText}>
                          Bezahlt bis:
                        </p>
                        <p className={styles.expirationDateText}>
                          {portal.expirationDate
                            ? new Date(portal.expirationDate).toLocaleString(
                                "de-DE",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {renderStatusContent(portal)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bestätigungsdialog */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Status ändern</DialogTitle>
              <DialogDescription>
                Möchtest du{" "}
                {bulkStatus
                  ? `alle Inserate auf ${
                      bulkStatus === "ACTIVE" ? "Aktiv" : "Inaktiv"
                    } setzen?`
                  : `das Inserat wirklich auf ${
                      newStatus === "ACTIVE" ? "Aktiv" : "Inaktiv"
                    } setzen?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button
                className={styles.confirmButton}
                onClick={confirmStatusChange}
                disabled={isLoading}
              >
                {isLoading ? "Bitte warten..." : "Bestätigen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Erfolgsmeldungsdialog */}
      {showSuccessDialog && (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Vorgang gestartet</DialogTitle>
              <DialogDescription>{successMessage}</DialogDescription>
            </DialogHeader>
            <CardContent className={styles.loadingCenter}>
              <Loader2 className="h-20 w-20 animate-spin" />
            </CardContent>
            <DialogFooter>
              <Button
                className={styles.confirmButton}
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push(`/app/dashboard/${realEstateId}`);
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
