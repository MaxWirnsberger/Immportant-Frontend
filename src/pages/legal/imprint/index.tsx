import React from "react";
import styles from "./imprint.module.css";
import dynamic from 'next/dynamic';
const ImprintNotice = dynamic(() => import('./imprint_notice'), { ssr: false });

export default function ImprintPage() {
  return (
    <main className={styles.imprintContainer}>
      <div className={styles.imprintContent}>
        <ImprintNotice />
      </div>
    </main>
  );
}