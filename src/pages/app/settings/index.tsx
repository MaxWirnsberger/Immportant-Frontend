import React from "react";
import { useRouter } from "next/router"; // Importiere den Router
import styles from "./settings.module.css";
import globalstyle from "../globalApp.module.css";

export default function SettingPage() {
  const router = useRouter(); // Initialisiere den Router

  // Funktionen für die Navigation
  const navigateToProfile = () => router.push("settings/profile/");
  const navigateToInvoices = () => router.push("settings/invoice/");
  const navigateToNotifications = () =>
    router.push("settings/notification/");

  return (
    <main className={globalstyle.appMainContainer}>
      <h2>Einstellungen</h2>
      <div className={styles.buttonsContainer}>
        <button className={styles.button} onClick={navigateToProfile}>
          Benutzerprofil
        </button>
        <button className={styles.button} onClick={navigateToInvoices}>
          Rechnungen
        </button>
        <button className={styles.button} onClick={navigateToNotifications}>
          Benachrichtigungen und Kommunikation
        </button>
      </div>
    </main>
  );
}
