import { useState, useRef, useEffect } from "react";
import styles from "./appHeader.module.css";
import Link from "next/link";
import { Mail, CircleUser } from "lucide-react";
import { useSelectedRealEstate } from "@/contexts/selectedRealEstateContext";
import { useUser } from "@/contexts/userContext";
import Image from "next/image";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosInstance";

export default function AppHeaderComponent() {
  const { selectedRealEstateId } = useSelectedRealEstate();
  const { user } = useUser();
  const router = useRouter();

  const userName = user
    ? `${user.firstname} ${user.lastname}`
    : "Unbekannter Benutzer";

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Funktion zum Schließen des Dropdowns bei Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      const targetElement = event.target as Element;

      if (
        targetElement &&
        !dropdownRef.current.contains(targetElement) &&
        !targetElement.closest(`.${styles.userContent}`)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.headerContent}>
      <div className={styles.imageContent}>
        <Image
          src="/images/app/sidebar/logo.webp"
          width={235}
          height={32}
          alt="Logo App Sidebar"
        />
      </div>
      <div className={styles.iconSection}>
        {selectedRealEstateId && (
          <div className={styles.iconButton}>
            <Link href={`/app/inquires/overview/${selectedRealEstateId}`}>
              <Mail />
            </Link>
          </div>
        )}
        <div
          className={styles.userContent}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <CircleUser />
          <div className={styles.userName}>{userName}</div>
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownMenu} ref={dropdownRef}>
            <Link href="/app/settings/" className={styles.dropdownItem}>
              Einstellungen
            </Link>
            <div
              className={`${styles.dropdownItem} ${styles.redText}`}
              onClick={async () => {
                try {
                  // Sende eine POST-Anfrage an /user/logout/
                  await axiosInstance.post("/user/logout/");
                } catch (error) {
                  console.error("Fehler beim Abmelden:", error);
                  // Optionale Fehlerbehandlung
                } finally {
                  // Entferne den Token und leite zur Login-Seite weiter
                  localStorage.removeItem("authToken");
                  router.push("/auth/login/");
                }
              }}
            >
              Ausloggen
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
