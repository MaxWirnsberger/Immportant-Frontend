import React from "react";
import styles from "./agb.module.css";

export default function AGBPage() {
  return (
    <main className={styles.agbContainer}>
      <div className={styles.agbContent}>
        <h1>AGB</h1>
        <p>
          Das Unternehmen befindet sich noch in Gründung.
          <br /> Da noch keine Geschäftstätigkeit aufgenommen wurde, sind die
          AGBs noch nicht aufgelistet.
          <br /> Diese werden jedoch noch nachgereicht.
        </p>
      </div>
    </main>
  );
}
