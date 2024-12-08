import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./serviceHero.module.css";
import { ArrowRight } from "lucide-react";

export default function ServiceHeroComponent() {
  return (
    <main className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.headline}>
          <div>
            <h1>
              Unser <span className={styles.greenHeadline}>Service</span>
            </h1>
            <p>
              Immportant ist das digitalste und kostengünstigste Tool für die
              selbständigen Immobilienvermittlung im deutschsprachigen Bereich!
            </p>
          </div>
          <Link href={"/auth/register/"}>
            <button className={styles.heroButton}>
              Jetzt Immobilie vermarkten{" "}
              <ArrowRight className={styles.buttonArrow} />
            </button>
          </Link>
        </div>
        <div>
          <Image
            src="/images/service/heroBorder.webp"
            alt="Service Hero Image"
            width={900}
            height={800}
            className={styles.heroImg}
          />
        </div>
      </div>
    </main>
  );
}
