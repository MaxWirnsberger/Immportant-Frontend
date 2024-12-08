import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServiceAPIComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/plattform.webp"
            alt="PlattformImage"
            width={900}
            height={800}
          />
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
            Du möchtest auf verschiedenen{" "}
            <span className={styles.greenColor}>Plattformen</span> deine
            Immobilie inserieren? <br />
            Wir machen es dir leicht.
          </h2>
          <span>
            Mit unserer Plattform kannst du dein Exposé auf mehreren
            Immobilien-Websites gleichzeitig präsentieren. Wähle einfach die
            gewünschten Plattformen aus und wir übernehmen den Rest.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Mehrere Plattformen zur Auswahl</li>
              <li>Einfache und schnelle Integration</li>
              <li>Maximale Sichtbarkeit für deine Immobilie</li>
            </ul>
          </span>
        </div>
      </div>
    </main>
  );
}
