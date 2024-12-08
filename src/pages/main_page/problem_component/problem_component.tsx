import Image from "next/image";
import styles from "./problem.module.css";

export default function ProblemComponent() {
  return (
    <section className={styles.problemContainer}>
      <div className={styles.problemContent}>
        <div>
          <span>Das Problem</span>
          <h2 className={styles.problemHeadline}>
            Du hast beim Verkauf oder Vermietung deiner Immobilie keine Lust
            auf:
          </h2>
        </div>
        <div className={styles.problemBoxes}>
          <div className={styles.problemElement}>
            <div className={styles.problemBox}>
              <Image
                src="/images/mainpage/problem/time.png"
                alt="Hero Image"
                width={60}
                height={60}
              />
            </div>
            <span>
              Zeit- und Arbeitsaufwand <br /> für die Vermarktung
            </span>
          </div>

          <div className={styles.problemElement}>
            <div className={styles.problemBox}>
              <Image
                src="/images/mainpage/problem/money-bag.png"
                alt="Hero Image"
                width={60}
                height={60}
              />
            </div>
            <span>
              hohe Kosten <br /> für Makler
            </span>
          </div>

          <div className={styles.problemElement}>
            <div className={styles.problemBox}>
              <Image
                src="/images/mainpage/problem/questionmark.png"
                alt="Hero Image"
                width={60}
                height={60}
              />
            </div>
            <span>
              Mangel an <br /> Fachwissen
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
