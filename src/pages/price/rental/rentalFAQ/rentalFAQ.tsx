import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import styles from "../../styles/priceFAQ.module.css";

export default function RentalFAQComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>FAQ - Häufig gestellte Fragen zur Vermietung</h1>

      <Accordion type="single" collapsible className={styles.accordion}>
        <AccordionItem value="item-1" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Welche Leistungen sind in den 890 € enthalten?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            In den 890 € sind alle Leistungen für die Vermarktung deiner Immobilie zur Vermietung enthalten. Wir beraten dich zu den benötigten Dokumenten und zeigen dir, wie du die Fotos am besten erstellst. Wir bearbeiten die Bilder professionell, erstellen ein ansprechendes Exposé und veröffentlichen dein Inserat auf allen wichtigen Immobilienportalen. Zusätzlich kannst du unser Tool nutzen und hast einen persönlichen Ansprechpartner.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Fallen zusätzliche Kosten an?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Nein, es gibt keine versteckten Kosten. Die 890 € decken alle unsere Dienstleistungen für die Vermietung ab. Für Mieter fällt keine Provision an.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie lange dauert es, bis ein Mieter gefunden wird?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Die Dauer hängt von verschiedenen Faktoren ab, wie Lage, Zustand und Mietpreis deiner Immobilie. Unser Ziel ist es, so schnell wie möglich einen passenden Mieter für dich zu finden.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Was passiert, nachdem ein Mieter gefunden wurde?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Sobald wir einen geeigneten Mieter gefunden haben, ist unsere Hauptdienstleistung abgeschlossen. Wir können dich aber weiterhin beraten und unterstützen. Gemeinsam mit dem Mieter besprechen wir die nächsten Schritte. Bei Bedarf können wir dir bei der Erstellung des Mietvertrags behilflich sein.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Unterstützt ihr mich bei den Besichtigungen?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Du führst die Besichtigungen selbst durch. Für die Terminkoordination kannst du unser Tool nutzen, das dir hilft, die Termine effizient zu verwalten und den Überblick zu behalten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie finde ich den optimalen Mietpreis für meine Immobilie?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Wir verwenden ein professionelles Bewertungstool, um den optimalen Mietpreis zu ermitteln. Zusätzlich stimmen wir uns direkt mit dir ab, um gemeinsam den passenden Mietpreis festzulegen.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Unterstützt ihr mich bei der Auswahl des Mieters?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Ja, wir helfen dir bei der Vorauswahl von potenziellen Mietern, indem wir Bonitätsprüfungen und Hintergrundchecks durchführen. Letztendlich entscheidest du, wer dein neuer Mieter wird.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie läuft die Bezahlung ab?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Die Kosten von 890 € entstehen vor dem Inserieren deiner Immobilie. Gerne können wir uns aber abstimmen, falls du alternative Lösungen bevorzugst.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Was passiert, wenn ich den Vermietungsprozess abbrechen möchte?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Du kannst den Prozess jederzeit abbrechen. In diesem Fall stellen wir dir nur die bis dahin erbrachten Leistungen in Rechnung.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie starte ich den Vermietungsprozess mit euch?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Kontaktiere uns einfach über unser Kontaktformular oder telefonisch. Wir besprechen gemeinsam die nächsten Schritte und beginnen mit der Vermarktung deiner Immobilie zur Vermietung.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
