import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServiceDocumentComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
            Du möchtest deine Immobilie{" "}
            <span className={styles.greenColor}>perfekt in Szene setzen</span>?{" "}
            <br />
            Wir helfen dir dabei.
          </h2>
          <span>
            Mit unserem leistungsstarken Floorplan-Editor und dem
            Exposé-Ersteller präsentieren Sie Ihre Immobilie von ihrer besten
            Seite. Erstellen Sie beeindruckende Grundrisse und ansprechende
            Exposés, die potenzielle Käufer oder Mieter auf den ersten Blick
            überzeugen. Überlassen Sie uns die Details, während Sie sich auf den
            erfolgreichen Abschluss konzentrieren.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Aussagekräftige Grundrisse</li>
              <li>Automatische Texterstellung durch KI</li>
              <li>Ansprechende Exposés</li>
            </ul>
          </span>
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/documentation.webp"
            alt="documentImage"
            width={900}
            height={800}
          />
        </div>
      </div>
    </main>
  );
}
