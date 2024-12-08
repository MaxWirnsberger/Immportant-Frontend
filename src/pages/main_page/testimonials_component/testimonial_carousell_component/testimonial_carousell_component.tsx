import Image from "next/image";
import styles from "./testimonial_carousell.module.css";

export default function TestimonialCarousellComponent() {
  return (
    <main className={styles.testimonialContainer}>
      <div className={styles.testimonialTextReview}>
        <span>
          Immportant hat mein Leben verändert! Ich konnte mein Haus ohne einen
          Makler verkaufen, was mir eine Menge Geld gespart hat. Die
          Transaktionen waren schnell und sicher. Ich kann diese Webseite jedem
          empfehlen, der eine Immobilie stressfrei und effizient verkaufen
          möchte! <br /><br />
        </span>
        <span className="font-bold">
          Max Mustermann
          <br />
        </span>
        <span>Verkäufe</span>
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
