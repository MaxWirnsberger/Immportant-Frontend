import styles from "./appFooter.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutPanelLeft, PencilRuler, HousePlus, Building2 } from "lucide-react";
import { useSelectedRealEstate } from "@/contexts/selectedRealEstateContext";

export default function AppFooterComponent() {
  const pathname = usePathname();
  const { selectedRealEstateId } = useSelectedRealEstate();
  const isRealEstateSelected = !!selectedRealEstateId;

  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <nav className={styles.footerNavContainer}>
          <div className={styles.footerNavContent}>
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
              <span>Dashboard</span>
            </Link>
          </div>
          <div className={styles.footerNavContent}>
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
              <span>Objektdetails</span>
            </Link>
          </div>
          <div className={styles.footerNavContent}>
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
              <HousePlus />
              <span>Inserieren</span>
            </Link>
          </div>
          <div className={styles.footerNavContent}>
            <Link
              href={
                isRealEstateSelected
                  ? `/app/realEstates/`
                  : "#"
              }
              className={`${styles.navLink} ${
                pathname && pathname.startsWith("/app/realEstate")
                  ? styles.active
                  : ""
              } `}
            >
              <Building2 />
              <span>Immobilien</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
