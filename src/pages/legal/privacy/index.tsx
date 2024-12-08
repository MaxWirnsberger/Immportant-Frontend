import React from "react";
import styles from "./privacy.module.css";

export default function PrivacyPage() {
  return (
    <main className={styles.privacyContainer}>
      <div className={styles.privacyContent}>
        <h1>Datenschutzhinweis</h1>
        <p>
          Das Unternehmen befindet sich noch in Gründung.
          <br /> Da noch keine Geschäftstätigkeit aufgenommen wurde, sind die
          Datenschutzhinweise noch nicht aufgelistet.
          <br /> Diese werden jedoch noch nachgereicht.
        </p>
      </div>
    </main>
  );
}