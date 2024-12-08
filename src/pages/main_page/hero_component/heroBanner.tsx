import Image from "next/image";
import styles from "./heroBanner.module.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.headline}>
          <h1>
            <span className={styles.greenHeadline}>VERMARKTE</span>
            <br />
            DEINE IMMOBILIE,
            <br />
            <span className={styles.greenHeadline}>OHNE MAKLER</span>
          </h1>
          <span>Die günstigste alternative zum Immobilienmakler</span>
          <div className={styles.buttonContent}>
            <div className={styles.CTAText}>
              <h3>
                Wir starten in Kürze. <br />
              </h3>
              <span>
                Schau dich schon jetzt um und entdecke, was dich bald bei uns
                erwartet.
              </span>
              <br />
              <span>
                Melde dich für unseren Newsletter an, und wir informieren dich,
                sobald es losgeht!
              </span>
            </div>
            <Link href={"/auth/contactMail/"}>
              <button className={styles.heroButton}>
                Jetzt anmelden! <ArrowRight className={styles.buttonArrow} />
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.heroBanner}>
          <Image
            src="/images/mainpage/header/header_dashboard.webp"
            alt="Hero Image"
            width={800}
            height={800}
            className={styles.heroImg}
          />
          <Image
            src="/images/mainpage/header/header_border.png"
            alt="Header Border"
            width={820}
            height={820}
            className={styles.heroBorder}
          />
        </div>
      </div>
    </section>
  );
}
