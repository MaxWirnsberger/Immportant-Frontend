import React from "react";
import styles from "./privacy.module.css";
import dynamic from 'next/dynamic';
const PrivacyNotice = dynamic(() => import('./privacy_notice'), { ssr: false });

export default function PrivacyPage() {
  return (
    <main className={styles.privacyContainer}>
      <div className={styles.privacyContent}>
        <PrivacyNotice />
      </div>
    </main>
  );
}