import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServiceCalenderComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/calender.webp"
            alt="PriceImage"
            width={900}
            height={800}
          />
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
          Schwierigkeiten,{" "}
            <span className={styles.greenColor}>Besichtigungstermine</span> zu verwalten?{" "}
            <br />
            Wir machen es dir einfach.
          </h2>
          <span>
            Unsere Kalender-Integration hilft Ihnen dabei, Besichtigungstermine
            mühelos zu planen und zu koordinieren. Behalten Sie stets den
            Überblick über alle Anfragen und vermeiden Sie
            Terminüberschneidungen.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Eintragen, wann du in der Immobilie bist</li>
              <li>Der Interessent trägt sich einfach in die freien Termine ein.</li>
              <li>Erinnerungsfunktion für dich und den Interessent</li>
            </ul>
          </span>
        </div>
      </div>
    </main>
  );
}
