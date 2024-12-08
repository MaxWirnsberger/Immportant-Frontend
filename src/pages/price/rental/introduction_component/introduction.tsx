import React from "react";
import styles from "../../styles/introduction.module.css";

export default function SaleIntroductionComponent() {
  return (
    <main className={styles.introductionContainer}>
      <div className={styles.introductionContent}>
        <h2>Vermiete deine Immobilie kostengünstig.</h2>
        <h3>Starte jetzt durch</h3>
        <p>
          etzt ist der perfekte Zeitpunkt, deine Immobilie zu vermieten. Mit
          Immportant kannst du deine Mietanzeige auf den führenden
          Immobilienportalen platzieren – schnell und kosteneffizient. Wir
          übernehmen die komplette Inserierung für dich und sorgen dafür, dass
          deine Immobilie die maximale Sichtbarkeit erhält. Vom ansprechenden
          Exposé über die optimale Mietpreisbewertung bis hin zur gezielten
          Weiterleitung der passenden Anfragen – wir kümmern uns um alles.
          Entdecke, wie einfach der Vermietungsprozess sein kann und lass deine
          Immobilie in voller Pracht erstrahlen!
        </p>
      </div>
    </main>
  );
}
