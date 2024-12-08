import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import styles from "./compareComponent.module.css";

const ComparisonItem = ({
  title,
  logo,
  features,
  color,
  isHighlighted = false,
}: {
  title?: string;
  logo?: string;
  features: { text: string; available: boolean }[];
  color: string;
  isHighlighted?: boolean;
}) => (
  <Card
    className={`${styles.card} ${isHighlighted ? styles.cardHighlighted : ""}`}
  >
    <CardHeader
      style={{ backgroundColor: color }}
      className={styles.cardHeader}
    >
      {logo ? (
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Logo" width={300} height={40} className={styles.logo} />
        </div>
      ) : (
        <CardTitle className={styles.cardTitle}>{title}</CardTitle>
      )}
    </CardHeader>
    <CardContent className={styles.cardContent}>
      <ul className={styles.featureList}>
        {features.map((feature, index) => (
          <li key={index} className={styles.featureItem}>
            {feature.available ? (
              <CheckCircle
                className={`${styles.icon} ${styles.iconAvailable}`}
              />
            ) : (
              <XCircle
                className={`${styles.icon} ${styles.iconNotAvailable}`}
              />
            )}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function CompareComponent() {
  const privateFeatures = [
    { text: "Volle Kontrolle über den Verkaufsprozess", available: true },
    { text: "Keine Maklerprovision", available: true },
    { text: "Geringe Kosten für Inserate", available: true },
    { text: "Direkter Kontakt zu Interessenten", available: true },
    { text: "Zeitaufwändig", available: false },
    { text: "Begrenzte Reichweite", available: false },
    {
      text: "Keine professionelle Unterstützung bei der Exposé-Erstellung",
      available: false,
    },
    { text: "Hoher organisatorischer Aufwand", available: false },
    { text: "Fehlende rechtliche Absicherung", available: false },
  ];

  const agentFeatures = [
    { text: "Professionelle Vermarktung", available: true },
    { text: "Große Reichweite", available: true },
    { text: "Erfahrung in Preisverhandlungen", available: true },
    {
      text: "Unterstützung bei Besichtigungen und Vertragsabschluss",
      available: true,
    },
    { text: "Persönlicher Ansprechpartner", available: true },
    { text: "Hohe Maklerprovision", available: false },
    { text: "Weniger Kontrolle über den Verkaufsprozess", available: false },
    { text: "Langwierige Vertragsbindungen", available: false },
  ];

  const yourProductFeatures = [
    { text: "Professionelle Vermarktung", available: true },
    { text: "Große Reichweite", available: true },
    { text: "Kostengünstig", available: true },
    { text: "Zeitsparend", available: true },
    { text: "Volle Kontrolle über den Verkaufsprozess", available: true },
    {
      text: "Exposé-Erstellung und Grundriss-Aufbereitung inklusive",
      available: true,
    },
    { text: "Anonymisierte Interessentenkommunikation", available: true },
    { text: "Keine Besichtigungen", available: false },
  ];

  return (
    <div className={styles.container}>
      <ComparisonItem
        title="Private Vermarktung"
        features={privateFeatures}
        color="#00015e"
      />
      <ComparisonItem
        logo="/images/service/compareLogo.webp"
        features={yourProductFeatures}
        color="#2cf599"
        isHighlighted={true}
      />
      <ComparisonItem
        title="Immobilienmakler"
        features={agentFeatures}
        color="#00015e"
      />
    </div>
  );
}
