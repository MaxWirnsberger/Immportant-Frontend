// import React from "react";
// import Link from "next/link";
// import styles from "./imprint.module.css";

// export default function ImprintPage() {
//   return (
//     <main className={styles.imprintContainer}>
//       <div className={styles.imprintContent}>
//         <h1>Impressum</h1>
//         <p className={styles.imprintSpacer}>
//           Informationen über den Diensteanbieter.
//         </p>
//         <p>Immportant</p>
//         <p className={styles.imprintSpacer}>
//           Fliederweg 4, <br />
//           5301 Eugendorf, <br />
//           Österreich
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Tel.:</strong> +436606162416
//           <br />
//           <strong>E-Mail:</strong>{" "}
//           <a href="mailto:office@immportant.com">office@immportant.com</a>
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Firmenbuchnummer:</strong> Noch nicht gegründet
//           <br />
//           <strong>Firmenbuchgericht:</strong> Noch nicht gegründet
//           <br />
//           <strong>Firmensitz:</strong> Noch nicht gegründet
//           <br />
//           <strong>Unternehmensgegenstand:</strong> Dienstleistungen in der
//           automatischen Datenverarbeitung und Informationstechnik
//           <br />
//           <strong>UID-Nummer:</strong> Noch nicht gegründet
//           <br />
//           <strong>GLN (Global Location Number):</strong> Noch nicht gegründet
//           <br />
//           <strong>GISA (Gewerbeinformationssystem Austria):</strong> Noch nicht
//           gegründet
//           <br />
//           <strong>Mitglied bei:</strong> Noch nicht gegründet
//           <br />
//           <strong>Berufsrecht:</strong> Noch nicht gegründet
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Aufsichtsbehörde/Gewerbebehörde:</strong> Noch nicht gegründet
//           <br />
//           <strong>Webseite:</strong> Noch nicht gegründet
//           <br />
//           <strong>Anschrift</strong>
//           <br />
//           Noch nicht gegründet
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Berufsbezeichnung:</strong> Dienstleistungen in der
//           automatischen Datenverarbeitung und Informationstechnik
//           <br />
//           <strong>Verleihungsstaat:</strong> Österreich
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Persönlich haftende Gesellschafter (Komplementär):</strong>{" "}
//           Maximilian Wirnsberger
//           <br />
//           <strong>Geschäftsführer:</strong> Maximilian Wirnsberger
//         </p>
//         <p className={styles.imprintSpacer}>
//           <strong>Datenschutz Vertretungsberechtigter:</strong> Maximilian
//           Wirnsberger
//           <br />
//           <strong>E-Mail der Datenschutzstelle:</strong>{" "}
//           <a href="mailto:office@immportant.com">office@immportant.com</a>
//           <br />
//           <strong>Tel.:</strong> +436606162416
//           <br />
//           <strong>Impressum der Datenschutzstelle:</strong>{" "}
//           <a
//             href="https://www.immportant.at/impressum/"
//             target="_blank"
//             rel="noopener"
//           >
//             https://www.immportant.at/impressum/
//           </a>
//           <br />
//           <p style={{ marginTop: "20px" }}>
//             <strong>Kontakt:</strong>
//             <br />
//             <span style={{ paddingLeft: "16px", display: "block" }}>
//               Immportant GmbH
//               <br />
//               Fliederweg 4, 5301 Eugendorf,
//               <br />
//               Österreich
//             </span>
//           </p>
//         </p>
//         <h2 style={{ fontSize: "30px", lineHeight: "1.5", fontWeight: "bold" }}>
//           EU-Streitschlichtung
//         </h2>
//         <p className={styles.imprintSpacer}>
//           Gemäß Verordnung über Online-Streitbeilegung in
//           Verbraucherangelegenheiten (ODR-Verordnung) möchten wir Sie über die
//           Online-Streitbeilegungsplattform (OS-Plattform) informieren.
//           <br />
//           Verbraucher haben die Möglichkeit, Beschwerden an die Online
//           Streitbeilegungsplattform der Europäischen Kommission unter{" "}
//           <a>
//             https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&amp;lng=DE
//           </a>{" "}
//           zu richten. Die dafür notwendigen Kontaktdaten finden Sie oberhalb in
//           unserem Impressum.
//         </p>
//         <p className={styles.imprintSpacer}>
//           Wir möchten Sie jedoch darauf hinweisen, dass wir nicht bereit oder
//           verpflichtet sind, an Streitbeilegungsverfahren vor einer
//           Verbraucherschlichtungsstelle teilzunehmen.
//         </p>
//         <h2 style={{ fontSize: "30px", lineHeight: "1.5", fontWeight: "bold" }}>
//           Haftung für Inhalte dieser Website
//         </h2>
//         <p className={styles.imprintSpacer}>
//           Wir entwickeln die Inhalte dieser Website ständig weiter und bemühen
//           uns korrekte und aktuelle Informationen bereitzustellen. Leider können
//           wir keine Haftung für die Korrektheit aller Inhalte auf dieser Website
//           übernehmen, speziell für jene, die seitens Dritter bereitgestellt
//           wurden. Als Diensteanbieter sind wir nicht verpflichtet, die von Ihnen
//           übermittelten oder gespeicherten Informationen zu überwachen oder nach
//           Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
//         </p>
//         <p className={styles.imprintSpacer}>
//           Unsere Verpflichtungen zur Entfernung von Informationen oder zur
//           Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
//           aufgrund von gerichtlichen oder behördlichen Anordnungen bleiben auch
//           im Falle unserer Nichtverantwortlichkeit davon unberührt.
//         </p>
//         <p className={styles.imprintSpacer}>
//           Sollten Ihnen problematische oder rechtswidrige Inhalte auffallen,
//           bitte wir Sie uns umgehend zu kontaktieren, damit wir die
//           rechtswidrigen Inhalte entfernen können. Sie finden die Kontaktdaten
//           im Impressum.
//         </p>
//         <p>Alle Texte sind urheberrechtlich geschützt.</p>
//         <p className={styles.imprintSpacer}>
//           Quelle: Erstellt mit dem{" "}
//           <a
//             href="https://www.adsimple.at/impressum-generator/"
//             title="Impressum Generator Österreich von AdSimple"
//           >
//             Impressum Generator
//           </a>{" "}
//           von AdSimple
//         </p>
//       </div>
//     </main>
//   );
// }


import React from "react";
import Link from "next/link";
import styles from "./imprint.module.css";

export default function ImprintPage() {
  return (
    <div className={styles.imprintContainer}>
      <div className={styles.imprintContent}>
        <h1 className={styles.imprintSpacer}>Impressum</h1>
        <p className={styles.imprintSpacer}>Informationen über den Diensteanbieter.</p>
        <p className={styles.imprintSpacer}>Maximilian Wirnsberger</p>
        <p className={styles.imprintSpacer}>
          Eichetstraße 40, Stiege 1 Tür 1,<br />
          5071 Wals-Siezenheim,<br />
          Österreich
        </p>
        <p className={styles.imprintSpacer}>
          <strong>Tel.:</strong> +43 660 6162416<br />
          <strong>E-Mail:</strong>{" "}
          <a href="mailto:office@immportant.com">office@immportant.com</a>
        </p>

        <h2
          id="eu-streitschlichtung"
          className={`${styles.imprintSpacer} ${styles.imprintSubheading}`}
        >
          EU-Streitschlichtung
        </h2>
        <p className={styles.imprintSpacer}>
          Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung)
          möchten wir dich über die Online-Streitbeilegungsplattform (OS-Plattform) informieren.<br />
          Verbraucher haben die Möglichkeit, Beschwerden an die Online Streitbeilegungsplattform der
          Europäischen Kommission unter{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE
          </a>{" "}
          zu richten. Die dafür notwendigen Kontaktdaten findest du oberhalb in unserem Impressum.
        </p>
        <p className={styles.imprintSpacer}>
          Wir möchten dich jedoch darauf hinweisen, dass wir nicht bereit oder verpflichtet sind, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
        <p className={styles.imprintSpacer}>Alle Texte sind urheberrechtlich geschützt.</p>
      </div>
    </div>
  );
}
