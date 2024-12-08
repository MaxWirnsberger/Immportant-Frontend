import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServicePriceComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/price.webp"
            alt="PriceImage"
            width={900}
            height={800}
          />
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
            Du weißt nicht, wie viel deine <span className={styles.greenColor}>Immobilie wert</span> ist? <br />
            Wir sagen es dir.
          </h2>
          <span>
            Ermitteln Sie den Wert Ihrer Immobilie präzise und zuverlässig mit
            unserer modernen Immobilienbewertung. Erhalten Sie umfassende
            Analysen, detaillierte Berichte und fundierte Empfehlungen, um
            fundierte Entscheidungen zu treffen und den bestmöglichen Preis zu
            erzielen.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Präzise Wertermittlung</li>
              <li>Fundierte Empfehlungen</li>
              <li>Werte kommen aus dem Markt</li>
            </ul>
          </span>
        </div>
      </div>
    </main>
  );
}
