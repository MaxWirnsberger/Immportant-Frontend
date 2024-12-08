import React, { useEffect, useState } from "react";
import styles from "./inquire.module.css";
import globalstyle from "../../globalApp.module.css";
import DataTableComponent from "@/components/appComponents/inquires/DataTableComponent/dataTableComponent";
import { InquiriesCard } from "@/components/appComponents/inquires/DataTableComponent/InquiriesCard";
import { useMediaQuery } from "react-responsive";



export default function Inquires() {
  const [realEstateId, setRealEstateId] = useState<string>("");

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    const storedRealEstateId =
      sessionStorage.getItem("selectedRealEstateId") || "";
    setRealEstateId(storedRealEstateId);
  }, []);

  if (!realEstateId) {
    return <div>Immobilien-ID nicht gefunden.</div>;
  }

  return (
    <div className={globalstyle.appMainContainer}>
      <h2 className={styles.pageTitle}>Anfragen</h2>
      <div className="pt-16">
        {isMobile ? (
          <InquiriesCard realEstateId={realEstateId} />
        ) : (
          <DataTableComponent realEstateId={realEstateId} />
        )}
      </div>
    </div>
  );
}
