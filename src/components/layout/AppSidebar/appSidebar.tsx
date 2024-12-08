import Image from "next/image";
import styles from "./appSidebar.module.css";
import { usePathname } from "next/navigation";

import {
  LayoutPanelLeft,
  PencilRuler,
  ChartSpline,
  FolderOpen,
  FileText,
  Mail,
  HousePlus,
} from "lucide-react";
import Link from "next/link";
import { useSelectedRealEstate } from "@/contexts/selectedRealEstateContext";

export default function AppSidebarComponent() {
  const pathname = usePathname();
  const { selectedRealEstateId } = useSelectedRealEstate();

  // Prüfe, ob eine Immobilie ausgewählt ist
  const isRealEstateSelected = !!selectedRealEstateId;

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarImage}>
          <Image
            src="/images/app/sidebar/logo.webp"
            width={235}
            height={32}
            alt="Logo App Sidebar"
          />
        </div>
        <div className={styles.sidebarButton}>
          <Link href="/app/realEstates/">
            <button>Meine Immobilien</button>
          </Link>
        </div>
        <nav className={styles.sidebarNavContainer}>
          <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/dashboard/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/dashboard/")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <LayoutPanelLeft />
              Dashboard
            </Link>
          </div>
          <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/objectDetails/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/objectDetails")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <PencilRuler />
              Objektdetails
            </Link>
          </div>

          {/* <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/evaluation/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/evaluation")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <ChartSpline />
              Bewertung
            </Link>
          </div> */}
          {/* <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/documents/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/documents")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <FolderOpen />
              Dokumente
            </Link>
          </div> */}
          {/* <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/expose/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/expose")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <FileText />
              Exposé
            </Link>
          </div> */}
          <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/inquires/overview/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/inquire")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <div>
                <Mail />
              </div>
              Anfragen
            </Link>
          </div>
          <div className={styles.sidebarNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/advertise/${selectedRealEstateId}`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/advertise")
                  ? styles.active
                  : ""
              } ${!isRealEstateSelected ? styles.disabled : ""}`}
            >
              <div>
                <HousePlus />
              </div>
              Inserieren
            </Link>
          </div>
        </nav>
        <div className={styles.settingsButton}>
          <Link href={"/app/settings/"}>
            <button>Einstellungen</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
