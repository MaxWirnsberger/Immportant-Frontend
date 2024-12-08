import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import styles from "../../styles/priceFAQ.module.css";

export default function SalesFAQComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>FAQ - Häufig gestellte Fragen</h1>

      <Accordion type="single" collapsible className={styles.accordion}>
        <AccordionItem value="item-1" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Welche Leistungen sind in den 1.750 € enthalten?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            In den 1.750 € sind alle Leistungen für die Vermarktung deiner
            Immobilie enthalten. Wir stimmen uns mit dir ab, welche Dokumente
            benötigt werden und wie du die Fotos am besten erstellst. Wir
            bearbeiten die Bilder professionell, erstellen ein ansprechendes
            Exposé, veröffentlichen dein Inserat auf allen wichtigen
            Immobilienportalen und bearbeiten die Anfragen potenzieller Käufer.
            Zusätzlich kannst du unser Tool nutzen und hast einen persönlichen
            Ansprechpartner.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Fallen zusätzliche Kosten an?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Nein, es gibt keine versteckten Kosten. Die 1.750 € decken alle
            beschriebenen Dienstleistungen, bis wir den richtigen Käufer
            gefunden haben, ab. Außerdem zahlen die Käufer bei uns keine
            Provision.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie lange dauert es, bis ein Käufer gefunden wird?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Die Dauer hängt von verschiedenen Faktoren ab, wie Lage, Zustand und
            Preis deiner Immobilie. Unser Ziel ist es, so schnell wie möglich
            einen passenden Käufer für dich zu finden.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Was passiert, nachdem ein Käufer gefunden wurde?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Sobald wir einen geeigneten Käufer gefunden haben, ist unsere
            Hauptdienstleistung abgeschlossen. Wir können dich aber weiterhin
            beraten und unterstützen. In Zusammenarbeit mit dem Käufer
            besprechen wir die nächsten Schritte. Anschließend kontaktieren wir
            unsere Partner für die Vertragserstellung und die notarielle
            Abwicklung.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Unterstützt ihr mich bei den Besichtigungen?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Du führst die Besichtigungen selbst durch. Für die
            Terminkoordination nutzt du unser Tool, das dir hilft, die Termine
            effizient zu verwalten und den Überblick zu behalten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie kann ich sicher sein, dass meine Immobilie zum besten Preis
            verkauft wird?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Wir verwenden ein Immobilienbewertungstool, das auch von Banken
            genutzt wird, um den optimalen Verkaufspreis zu ermitteln.
            Zusätzlich stimmen wir uns direkt mit dir ab, um gemeinsam den
            perfekten Verkaufspreis zu finden.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Unterstützt ihr mich bei der Beschaffung aller notwendigen
            Unterlagen?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Absolut. Wir helfen dir bei der Zusammenstellung aller
            erforderlichen Dokumente und stehen dir mit Rat und Tat zur Seite.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie läuft die Bezahlung ab?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Die Kosten von 1.750 € entstehen vor dem Inserieren deiner
            Immobilie. Gerne können wir uns aber abstimmen, falls du alternative
            Lösungen bevorzugst.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Was passiert, wenn ich den Verkauf abbrechen möchte?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Du kannst den Verkaufsprozess jederzeit abbrechen. In diesem Fall
            stellen wir dir nur die bis dahin erbrachten Leistungen in Rechnung.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            Wie starte ich den Verkaufsprozess mit euch?
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            Kontaktiere uns einfach über unser Kontaktformular oder telefonisch.
            Wir besprechen gemeinsam die nächsten Schritte und beginnen mit der
            Vermarktung deiner Immobilie.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
