import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServiceInterestedComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
            Effektive <span className={styles.greenColor}>Kommunikation</span>{" "}
            mit Interessenten? <br />
            Wir machen es möglich.
          </h2>
          <span>
            Nutze unser integriertes CRM-System, um nahtlos und anonym mit
            potenziellen Käufern oder Mietern zu kommunizieren. Verwalte
            Anfragen, Termine und Nachrichten bequem und zentral.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Du musst nicht deine E-Mailadresse angeben</li>
              <li>Zentralle Kommunikation über alle Plattformen</li>
              <li>
                Pssst.... noch ein kleines Geheimnis. Wir entwickeln auch eine
                App, um die Kommunikation mobil zu machen.
              </li>
            </ul>
          </span>
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/communication.webp"
            alt="communicationImage"
            width={900}
            height={800}
          />
        </div>
      </div>
    </main>
  );
}
