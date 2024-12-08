import React from "react";
import Image from "next/image";
import styles from "../../service.module.css";

export default function ServiceStepsComponent() {
  return (
    <main className={styles.serviceElementContainer}>
      <div className={styles.serviceElementContent}>
        <div className={`${styles.halfSpace} ${styles.serviceText}`}>
          <h2>
            Du bist unsicher, wie der{" "}
            <span className={styles.greenColor}>Verkaufsprozess</span> abläuft?{" "}
            <br />
            Wir führen dich durch jeden Schritt.
          </h2>
          <span>
            Nutze unsere umfassende Schritt-für-Schritt Anleitung, um sicher und
            effizient deine Immobilie zu verkaufen oder zu vermieten. Wir bieten
            klare Anweisungen und hilfreiche Tipps, damit du jeden Schritt des
            Prozesses souverän meisterst.
          </span>
          <span>
            <ul className={styles.customList}>
              <li>Detaillierte Prozessbeschreibungen</li>
              <li>Hilfreiche Tipps und Tricks</li>
              <li>Anpassbar an individuelle Bedürfnisse</li>
            </ul>
          </span>
        </div>
        <div className={`${styles.halfSpace} ${styles.serviceImg}`}>
          <Image
            src="/images/service/process.webp"
            alt="processImage"
            width={900}
            height={800}
          />
        </div>
      </div>
    </main>
  );
}
