import Image from "next/image";
import styles from "./testimonial_carousell.module.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TestimonialCarousellComponent() {
  return (
    <main className={styles.testimonialContainer}>
      <div className={styles.testimonialTextReview}>
        <span>
          <p>
            Wir stehen kurz vor dem Start und suchen Nutzer:innen, die als Erste
            ihre Erfahrungen mit unserer Lösung teilen möchten. Deine Meinung
            zählt und kann anderen zeigen, wie unser Produkt den Unterschied
            macht.
          </p>
          <br />
          <h3 className="font-bold">Was bringt es dir?</h3>
          <ul className={styles.spezielleListe}>
            <li>Du wirst als erstes Testimonial Teil unserer Geschichte.</li>
            <li>
              Deine Erfahrungen werden auf unserer Website und in unseren
              Materialien präsentiert.
            </li>
            <li>Als Dankeschön gibt es eine exklusive Überraschung!</li>
          </ul>
          <br />
        </span>
        <span className="font-bold">
          Neugierig?
          <br />
        </span>
        <span>
          Dann melde dich bei uns und werde Teil des Anfangs: <br />
          <Link href={"/auth/contactMail/"}>
            <div className={styles.callToActionButton}>
              Hier anmelden
              <ArrowRight className={styles.buttonArrow} />
            </div>
          </Link>
          <br />
          Wir freuen uns, dich dabei zu haben!
        </span>
      </div>
      <div className={styles.testimonialImgesReview}>
        <Image
          src="/images/mainpage/testimonials/testimonial_img2.png"
          alt="Testimonial Image"
          width={500}
          height={500}
        />
        <Image
          src="/images/mainpage/testimonials/testimonial_border.png"
          alt="Testimonial Image"
          width={500}
          height={500}
          className={styles.testimonialImgReviewBorder}
        />
        <Image
          src="/images/mainpage/testimonials/house_img.png"
          alt="Testimonial Image"
          width={100}
          height={120}
          className={styles.testimonialImgReviewIcon}
        />
      </div>
    </main>
  );
}
