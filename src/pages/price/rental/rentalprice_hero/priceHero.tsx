import React from "react";
import Link from "next/link";
import Image from "next/image";
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
              <span className={styles.greenHeadline}>Vermietungspreise</span>
            </h1>
            <p>
              Mit Immportant ganz einfach Immobilien vermieten!
              <br />
              Mit Immportant präsentierst du deine Immobilie schnell und
              unkompliziert auf den führenden Plattformen für Mietwohnungen.
              Profitiere von unserem innovativen System, das dir hilft, Zeit und
              Kosten zu sparen und gleichzeitig maximale Sichtbarkeit zu
              erzielen. Alles, was du für eine erfolgreiche Vermietung
              benötigst, bieten wir dir – einfach, transparent und flexibel.
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
        <div className={styles.heroImgContainer}>
          <Image
            src="/images/price/rentalpriceImage.webp"
            alt="Rental Price Hero Image"
            width={854}
            height={432}
            className={styles.heroImg}
          />
        </div>
      </div>
    </main>
  );
}
