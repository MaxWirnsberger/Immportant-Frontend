import React, { useState } from "react";
import styles from "./priceTable.module.css"; 

const SalePricingPlans = [
  {
    title: "Einfach Inserieren und verwalten",
    price: "ab 85 €",
    description: "Inseriere deine Immobilie auf mehreren Plattformen",
    features: ["Inserieren", "Laufzeit 4 Wochen"],
    buttonText: "Mehr erfahren",
    isHighlighted: false,
  },
  {
    title: "Nutze die Tools der Profi",
    price: "500 €",
    description: "Nutze die Tools der Profis",
    features: [
      "Inserieren auf allen Plattformen (Immowelt, Immonet.de, ImmoScout24, Kleinanzeigen)",
      "Grundriss erstellen",
      "Automatisierte Exposé Erstellung",
      "Terminverwaltung mit Interessenten",
    ],
    buttonText: "Mehr erfahren",
    isHighlighted: false,
  },
  {
    title: "Schulung für den perfekten Verkauf",
    price: "1.000 €",
    description: "Lerne von A bis Z, wie du deine Immobilie verkaufst",
    features: [
      "Inserieren auf allen Plattformen (Immowelt, Immonet.de, ImmoScout24, Kleinanzeigen)",
      "Grundriss erstellen",
      "Automatisierte Exposé Erstellung",
      "Terminverwaltung mit Interessenten",
      "Schulungsvideos für die perfekte Vermarktung deiner Immobilie",
      "Erläuterungsvideos, für alles was du wissen musst",
    ],
    buttonText: "Mehr erfahren",
    isHighlighted: true,
  },
];

const rentPricingPlans = [
  {
    title: "Einfach Inserieren und verwalten",
    price: "ab 45 €",
    description: "Inseriere deine Immobilie auf mehreren Plattformen",
    features: ["Inserieren", "Laufzeit 4 Wochen"],
    buttonText: "Mehr erfahren",
    isHighlighted: false,
  },
  {
    title: "Nutze die Tools der Profi",
    price: "300 €",
    description: "Nutze die Tools der Profis",
    features: [
      "Inserieren auf allen Plattformen (Immowelt, Immonet.de, ImmoScout24, Kleinanzeigen)",
      "Grundriss erstellen",
      "Automatisierte Exposé Erstellung",
      "Terminverwaltung mit Interessenten",
    ],
    buttonText: "Mehr erfahren",
    isHighlighted: false,
  },
  {
    title: "Schulung für die perfekte Vermietung",
    price: "750 €",
    description: "Lerne von A bis Z, wie du deine Immobilie vermietest",
    features: [
      "Inserieren auf allen Plattformen (Immowelt, Immonet.de, ImmoScout24, Kleinanzeigen)",
      "Grundriss erstellen",
      "Automatisierte Exposé Erstellung",
      "Terminverwaltung mit Interessenten",
      "Schulungsvideos für die perfekte Vermarktung deiner Immobilie",
      "Erläuterungsvideos, für alles was du wissen musst",
    ],
    buttonText: "Mehr erfahren",
    isHighlighted: true,
  },
];

interface SaleTableProps {
  defaultTab?: "sale" | "rental";
}

const SaleTable: React.FC<SaleTableProps> = ({ defaultTab = "sale" }) => {
  const [activeTab, setActiveTab] = useState<"sale" | "rental">(defaultTab);

  const plans = activeTab === "sale" ? SalePricingPlans : rentPricingPlans;

  return (
    <div className={styles.container}>
      <div className={styles.pricePlansContainer}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${styles.pricePlan} ${
              plan.isHighlighted ? styles.highlighted : ""
            }`}
          >
            <div>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planDescription}>{plan.description}</p>
              <div className={styles.planPrice}>{plan.price}</div>
              <hr className={styles.separator} />
              <ul className={styles.featureList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.featureIcon}>✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`${styles.actionButton} ${
                plan.isHighlighted ? styles.highlighted : styles.default
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleTable;
