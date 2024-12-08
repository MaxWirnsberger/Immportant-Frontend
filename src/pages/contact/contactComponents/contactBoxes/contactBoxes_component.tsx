import React from "react";
import styles from "./contactBoxes.module.css";

export default function ContactBoxesComponent() {
  return (
    <section className={styles.contactBoxesContainer}>
      <div className={styles.contactBoxesContent}>
        <div className={styles.contactBoxes}>
            <h3 className={styles.boxHeadline}>Telefon</h3>
            <div>
                <p className={styles.boxUnderHeadline}>Mobile - AT</p>
                <span><a href="tel:+436606162416">+43 660 616 24 16</a></span>
            </div>
            {/* <div>
                <p className={styles.boxUnderHeadline}>Mobile - DE</p>
                <span><a href="tel:">+49 660 XXX XX XX</a></span>
            </div> */}
        </div>
        <div className={styles.contactBoxes}>
            <h3 className={styles.boxHeadline}>Email</h3>
            <div>
                <p className={styles.boxUnderHeadline}>Office Mail</p>
                <span><a href="mailto:office@immportant.com">office@immportant.com</a></span>
            </div>
            {/* <div>
                <p className={styles.boxUnderHeadline}>Report Mail</p>
                <span><a href="mailto:report@immportant.com">report@immportant.com</a></span>
            </div> */}
        </div>
      </div>
    </section>
  );
}