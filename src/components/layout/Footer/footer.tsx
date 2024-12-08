"use client";
import styles from "./footer.module.css";
import { Youtube , Instagram, Linkedin } from "lucide-react";

export default function FooterComponent() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className="text-center md:text-left">
          <h5 className="text-lg font-bold">Immportant</h5>
          <p>© 2024 Immportant GmbH. All rights reserved.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="/legal/imprint">Impressum</a>
          <a href="/legal/privacy">Datenschutz</a>
          <a href="/legal/agb">AGB</a>
          <a href="/contact">Kontakt</a>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://youtube.com"
            aria-label="Facebook"
            className={styles.icon}
          >
            <Youtube />
          </a>
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className={styles.icon}
          >
            <Instagram />
          </a>
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className={styles.icon}
          >
            <Linkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
