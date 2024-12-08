import React from "react";
import ContactBoxesComponent from "./contactComponents/contactBoxes/contactBoxes_component";
import ContactFormComponent from "./contactComponents/contactForm/contactForm_component";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.contactContainer}>
      <div className={styles.contactContent}>
        <div>
          <div>
            <h1 className={styles.contactheadline}>Konaktseite</h1>
            <p>Bei Fragen kannst du dich gerne bei uns melden</p>
          </div>
          <ContactBoxesComponent />
        </div>
        <div className={styles.contactFormContainer}>
          <ContactFormComponent />
        </div>
      </div>
    </main>
  );
}
