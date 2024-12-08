import React from "react";
// import styles from "./describtion.module.css";
import styles from "../../styles/describtion.module.css";
import { Button } from "@/components/ui/button";

export default function SaleDescribtionComponent() {
  return (
    <main className={styles.describtionContainer}>
      <div className={styles.describtionContent}>
        <h3>
          Unsere Leistungen für den <span className={styles.desktopHeadline}>Immobilienverkauf</span>
          <span className={styles.mobileHeadline}> Immobilien-verkauf</span>
        </h3>
        <ul className={styles.describtionList}>
          <li>
            <span className="font-bold">Immobilienbewertung: </span>
            Mit modernster Technologie ermitteln wir den optimalen Preis.{" "}
          </li>
          <li>
            <span className="font-bold">Exposé-Gestaltung: </span>
            Deine Immobilie wird in einem ansprechenden Layout präsentiert.{" "}
          </li>
          <li>
            <span className="font-bold">Inserat-Erstellung: </span>
            Wir erstellen eine professionelle Verkaufsanzeige für dich.
          </li>
          <li>
            <span className="font-bold">Plattformvermarktung: </span>
            Deine Anzeige erscheint auf den wichtigsten Portalen.
          </li>
          <li>
            <span className="font-bold">Interessentenfilter: </span>
            Wir leiten nur die passenden Anfragen an dich weiter.
          </li>
          <li>
            <span className="font-bold">Persönlicher Support: </span>
            Unser Team ist jederzeit für dich da.
          </li>
        </ul>
        <span>Alles, was du brauchst – in einem einzigen Paket.</span>
        <div className={styles.ButtonSection}>
          <span>genauere Informationen: </span>
          <Button>Unser Service</Button>
        </div>
      </div>
    </main>
  );
}
