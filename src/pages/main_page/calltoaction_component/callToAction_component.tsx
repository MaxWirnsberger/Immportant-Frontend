"use client";
import styles from "./callToAction.module.css";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToActionComponent() {
  return (
    <section className={styles.callToActionContainer}>
      <div className={styles.callToActionContent}>
        <div className={styles.callToActionIMG}>
          <Image
            src="/images/mainpage/calltoaction/laptopAndPhone2.webp"
            alt="Laptop and Phone"
            width={500}
            height={1000}
          />
        </div>
        <div className={styles.callToActoinText}>
          <Link href={"/auth/contactMail/"}>
          <button className={styles.callToActionButton}>
            Beim Newsletter anmelden{" "}
            <ArrowRight className={styles.buttonArrow} />
          </button>
          </Link>
          <span>
            Verkaufe oder Vermiete deine Immobilie mit den Tools der Profis.
            Einfach Anmelden und loselegen.
          </span>
        </div>
      </div>
    </section>
  );
}
