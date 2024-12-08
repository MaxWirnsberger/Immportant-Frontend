import React from "react";
// import styles from "./introduction.module.css";
import styles from "../../styles/introduction.module.css"

export default function SaleIntroductionComponent() {
  return (
    <main className={styles.introductionContainer}>
      <div className={styles.introductionContent}>
        <h2>Verkaufe deine Immobilie kostengünstig.</h2>
        <h3>Starte jetzt durch</h3>
        <p>
          Jetzt ist der perfekte Zeitpunkt, deine Immobilie zu verkaufen. Mit
          Immportant kannst du deine Verkaufsanzeige auf den bedeutendsten
          Immobilienportalen platzieren – schnell und kosteneffizient. Wir
          übernehmen die komplette Inserierung für dich und sorgen dafür, dass
          deine Immobilie die maximale Sichtbarkeit erhält. Vom professionellen
          Exposé über die optimale Preisbewertung bis hin zur gezielten
          Weiterleitung der passenden Anfragen – wir kümmern uns um alles.
          Entdecke, wie einfach der Verkaufsprozess sein kann und lass deine
          Immobilie in voller Pracht erstrahlen!
        </p>
      </div>
    </main>
  );
}
