import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import styles from "@/pages/app/dashboard/dashboard.module.css";
import { Loader2 } from "lucide-react";

interface Portal {
  portal: string;
  modus: string;
  status: string;
  last_exported: string | null;
  immoscout_pubish_id: string | null;
}

interface PortaleCardProps {
  realEstateId: string;
}

const portalImages: Record<
  string,
  { src: string; width: number; height: number }
> = {
  Immowelt: {
    src: "/images/app/dashboard/immowelt.png",
    width: 120,
    height: 30,
  },
  "Immo-Scout": {
    src: "/images/app/dashboard/immo-scout.svg",
    width: 100,
    height: 60,
  },
  Kleinanzeigen: {
    src: "/images/app/dashboard/kleinanzeigen.svg",
    width: 130,
    height: 65,
  },
};

export function PortaleCard({ realEstateId }: PortaleCardProps) {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [portalInquiries, setPortalInquiries] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortalsAndInquiries = async () => {
      try {
        // Portale abrufen
        const portalsResponse = await axiosInstance.get(
          `/real-estate/detail/${realEstateId}/?fields=portals`
        );
        setPortals(portalsResponse.data.portals);

        // Anfragen pro Portal abrufen
        const dashboardResponse = await axiosInstance.get(
          `/feedback/dashboard/${realEstateId}/`
        );
        setPortalInquiries(dashboardResponse.data.inquiries_per_portal);

        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden der Daten");
        setLoading(false);
      }
    };

    fetchPortalsAndInquiries();
  }, [realEstateId]);

  if (loading) {
    return (
      <Card className={styles.standardTextColor}>
        <CardHeader>
          <CardTitle>Portale</CardTitle>
        </CardHeader>
        <CardContent className={styles.loadingCenter}>
          <Loader2 className="h-20 w-20 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.standardTextColor}>
        <CardHeader>
          <CardTitle>Portale</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.standardTextColor}>
      <CardHeader>
        <CardTitle>Portale</CardTitle>
      </CardHeader>
      <CardContent className={styles.portalElements}>
        <div>
          <div className={styles.flexBetween}>
            {portals.map((portal) => {
              const imageInfo = portalImages[portal.portal];

              if (!imageInfo) {
                return null;
              }

              const statusClass =
                portal.status === "ACTIVE"
                  ? styles.activeBackground
                  : styles.inactiveBackground;

              const inquiryCount = portalInquiries[portal.portal] || 0;

              return (
                <div key={portal.portal} className={`${styles.portalFields}`}>
                  <div className={styles.textBold}>{inquiryCount}</div>
                  <div className={styles.textGray}>Anfragen</div>
                  <Image
                    src={imageInfo.src}
                    alt={portal.portal}
                    width={imageInfo.width}
                    height={imageInfo.height}
                  />
                  <div className={`${styles.portalStatusText} ${statusClass}`}>
                    {portal.status === "ACTIVE" ? "Aktiv" : "Inaktiv"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
