import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./calender.module.css";
import globalstyle from "../globalApp.module.css";

interface CalenderData {
}

export default function CalenderPage() {
  const [calenderData, setCalenderData] = useState<CalenderData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const realEstateId = sessionStorage.getItem("selectedRealEstateId") || "";

  useEffect(() => {
    const fetchCalenderData = async () => {
      try {
        const response = await axiosInstance.get(
          `/feedback/${realEstateId}/`
        );
        setCalenderData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden der Calender-Daten");
        setLoading(false);
      }
    };

    if (realEstateId) {
      fetchCalenderData();
    }
  }, [realEstateId]);

  if (loading) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.calenderContainer}>
          <div className={styles.calenderHeader}>
            <h2 className={styles.pageTitle}>Kalender</h2>
          </div>
          <div>Lade Daten...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.calenderContainer}>
          <div className={styles.calenderHeader}>
            <h2 className={styles.pageTitle}>Kalender</h2>
          </div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!calenderData) {
    return (
      <div className={globalstyle.appMainContainer}>
        <div className={styles.calenderContainer}>
          <div className={styles.calenderHeader}>
            <h2 className={styles.pageTitle}>Kalender</h2>
          </div>
          <div>Keine Daten verfügbar</div>
        </div>
      </div>
    );
  }

  return (
    <div className={globalstyle.appMainContainer}>
    </div>
  );
}
