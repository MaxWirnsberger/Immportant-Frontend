import React from "react";
import styles from "../../styles/salesPackage.module.css";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Immobilienbewertung mit modernen Tools",
  "Dokumenten-Checkliste",
  "Anleitung zur Bildererstellung",
  "Bildbearbeitung",
  "Grundriss Erstellung",
  "Expose-Erstellung",
  "Statistiken und Reportings",
  "Veröffentlichung auf allen wichtigen Portalen",
  "Unterstützung während des gesamten Verkaufsprozesses",
  "Persönlicher Ansprechpartner",
  "6 Monate lang gültig",
];

export default function RentalPackageComponent() {
  return (
    <div className={styles.packageComponent}>
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Unser Vermietungspaket</h2>
        <p>Einzigartiger Immobilienvermietung zum festen Preis</p>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.price}>890 €</div>
        <ul className={styles.featuresList}>
          {features.map((feature) => (
            <li key={feature} className={styles.featureItem}>
              <Check className={styles.featureItemIcon} />
              <span className={styles.featureItemText}>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={styles.buttonComponent}>
          <Button>Jetzt Vermietung anfragen</Button>
        </div>

        <p className={styles.disclaimer}>
          (gültig für Wohnimmobilien bis 250m² Gesamtfläche, andere Immobilien
          auf Anfrage).
        </p>
      </div>
    </div>
    </div>
  );
}
