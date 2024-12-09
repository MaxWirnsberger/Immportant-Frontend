import Image from "next/image";
import styles from "./solution.module.css";

export default function SolutionComponent() {
  return (
    <section className={styles.solutionContainer}>
      <div className={styles.solutionContent}>
        <div className={styles.solutionImages}>
          <Image
            src="/images/mainpage/solution/solution_img3.webp"
            alt="SolutionImage"
            width={770}
            height={520}
            className={styles.solutionImg}
          />
        </div>
        <div className={styles.solutionText}>
          <span>Die Lösung</span>
          <h2 className={styles.solutionHeadline}>
            Vermarkte deine Immobilie <br />
            so einfach wie noch nie
          </h2>
          <span>
            <strong>Hohe Maklerkosten?</strong> Nicht mit uns! <br />
            <strong>Mangel an Fachwissen?</strong> Wir unterstützen dich
            professionell. <br />
            <strong>Zeitintensiver Vermarktungsprozess?</strong> Wir machen es
            effizient. <br />
            <br />
            Befreie dich von den typischen Problemen beim Immobilienverkauf oder
            bei der Vermietung. Mit Immportant wird alles einfacher, schneller
            und kostengünstiger. Erlebe selbst, wie unkompliziert es sein kann!
          </span>
        </div>
      </div>
    </section>
  );
}
