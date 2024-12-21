import { useRouter } from "next/router";
import React from "react";
import styles from "./thankyou.module.css";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  const router = useRouter();
  const { type } = router.query;

  const getMessage = () => {
    switch (type) {
      case "contact":
        return (
          <>
            Wir haben deine Kontaktanfrage erhalten und
            <br />
            melden uns so rasch als möglich.
          </>
        );
      case "register":
        return (
          <>
            Vielen Dank für deine Newsletter Anmeldung.
            <br />
            <br />
            Wenn du bereits jetzt fragen hast
            <br />
            kontaktiere uns unter{" "}
            <a
              href="mailto:office@immportant.com"
              className={styles.ThankYouLink}
            >
              office@immportant.com
            </a>
          </>
        );
      case "booking":
        return (
          <>
            Vielen Dank für deine Buchung. 
            Wir haben dir eine E-Mailbestätigung gesandt
            <br />
            <br />
            Wenn du bereits jetzt fragen hast
            <br />
            kontaktiere uns unter{" "}
            <a
              href="mailto:office@immportant.com"
              className={styles.ThankYouLink}
            >
              office@immportant.com
            </a>
          </>
        );
        case "cancel":
          return (
            <> 
              Wir haben dir deine Stornierung an den Eigentümer gesandt
              <br />
              <br />
              Wenn du fragen hast
              <br />
              kontaktiere uns unter{" "}
              <a
                href="mailto:office@immportant.com"
                className={styles.ThankYouLink}
              >
                office@immportant.com
              </a>
            </>
          );
      default:
        return "Vielen Dank für deine Aktion.";
    }
  };

  const handleButtonClick = () => {
    router.push("/");
  };

  return (
    <main className={styles.ThankYouContainer}>
      <h1>
        THANK <br />
        <span className={styles.greenHeadline}>YOU</span>
      </h1>
      <span>{getMessage()}</span>

      <Button className={styles.ThanksButton} onClick={handleButtonClick}>
        Zurück zur Homepage
      </Button>
    </main>
  );
}
