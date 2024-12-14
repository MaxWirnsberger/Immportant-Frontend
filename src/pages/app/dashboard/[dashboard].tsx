import React, { useEffect, useState } from "react";
import { GraphCard } from "@/components/appComponents/dashboard/graphCard/GraphCard";
import { PortaleCard } from "@/components/appComponents/dashboard/portalCard/PortaleCard";
import { InquiriesCard } from "@/components/appComponents/dashboard/inquiriesCard/InquiriesCard";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./dashboard.module.css";
import globalstyle from "../globalApp.module.css";

interface DashboardData {
  total_inquiries: number;
  unread_inquiries: number;
  inquiries_per_portal: {
    [key: string]: number;
  };
  inquiries_last_14_days: {
    date: string;
    Immowelt: number;
    Immo_Scout: number;
    Kleinanzeigen: number;
    Gesamt: number;
  }[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const realEstateId = sessionStorage.getItem("selectedRealEstateId") || "";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          `/feedback/dashboard/${realEstateId}/`
        );
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden der Dashboard-Daten");
        setLoading(false);
      }
    };

    if (realEstateId) {
      fetchDashboardData();
    }
  }, [realEstateId]);

  if (loading) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
          </div>
          <div>Lade Daten...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
          </div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
          </div>
          <div>Keine Daten verfügbar</div>
        </div>
      </div>
    );
  }

  return (
    <div className={globalstyle.appMainContainer}>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h2 className={styles.pageTitle}>Dashboard</h2>
        </div>
        <div className={styles.gridContainer}>
          <GraphCard data={dashboardData.inquiries_last_14_days} />
          <PortaleCard realEstateId={realEstateId} />
        </div>
        <InquiriesCard realEstateId={realEstateId} />
      </div>
    </div>
  );
}
