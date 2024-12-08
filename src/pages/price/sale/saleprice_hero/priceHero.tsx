import React from "react";
import Link from "next/link";
import Image from "next/image";
// import styles from "./priceHero.module.css";
import styles from "../../styles/priceHero.module.css";
import { ArrowRight } from "lucide-react";

export default function SalePriceHeroComponent() {
  return (
    <main className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.headline}>
          <div>
            <h1>
              Unsere{" "}
              <span className={styles.greenHeadline}>Verkaufspreise</span>
            </h1>
            <p>
              Immobilien verkaufen leicht gemacht – mit Immportant!
              <br />
              Mit Immportant präsentieren Sie Ihre Immobilie schnell und mühelos
              auf den führenden Immobilienplattformen. Nutzen Sie unser
              innovatives System, um Zeit und Kosten zu sparen und dabei
              maximale Sichtbarkeit zu erreichen. Alles, was Sie für einen
              erfolgreichen Verkauf benötigen, erhalten Sie bei uns – einfach,
              transparent und flexibel.
            </p>
          </div>
          <div>
            <Link href="/auth/register">
              <button className={styles.heroButton}>
                Jetzt Immobilie vermarkten{" "}
                <ArrowRight className={styles.buttonArrow} />
              </button>
            </Link>
          </div>
        </div>
        <div>
          <Image
            src="/images/price/salespriceImage.webp"
            alt="Sales Price Hero Image"
            width={854}
            height={432}
            className={styles.heroImg}
          />
        </div>
      </div>
    </main>
  );
}
