import React from "react";
import styles from "../styles/mainPrice.module.css";
import RentalPriceHeroComponent from "./rentalprice_hero/priceHero";
import RentalIntroductionComponent from "./introduction_component/introduction";
import PriceBoxComponent from "@/pages/main_page/price_component/price_boxes_components/priceBoxes_components";
import RentalDescribtionComponent from "./describtion_component/describtion";
import RentalPackageComponent from "./rentalPackage/salesPackage";
import PriceButtons from "../priceNavigation/priceNavigation";
import RentalFAQComponent from "./rentalFAQ/rentalFAQ";
// import Price from "../priceTable_component/priceTable";

export default function RentPricePage() {
  return (
    <main className={styles.priceContainer}>
      <RentalPriceHeroComponent />
      <RentalIntroductionComponent />
      <RentalDescribtionComponent />
      <RentalPackageComponent />
      <div className={styles.subheadline}>
        <h3>Kalkuliere deine Ersparnisse</h3>
      </div>
      <div className={styles.PriceBoxContainer}>
        <PriceBoxComponent type="rental" />
      </div>
      {/* <Price defaultTab="rental" /> */}
      <div className={styles.priceTextContainer}>
        <h3>Starte jetzt mit Immportant und verkaufe wie ein Profi!</h3>
        <span className={styles.priceText}>
          Entscheide dich für unser bewährtes Komplettpaket und genieße die
          Vorteile eines Rundum-Sorglos-Services, der speziell für private
          Immobilienverkäufer entwickelt wurde. Von der professionellen
          Bewertung über die ansprechende Gestaltung deines Exposés bis hin zur
          Veröffentlichung auf den führenden Portalen – wir übernehmen alle
          Schritte für dich. Mit Immportant sparst du wertvolle Zeit, minimierst
          deinen Aufwand und profitierst gleichzeitig von einer
          kosteneffizienten Vermarktung, die dir maximale Reichweite garantiert.
          Ob du dein Zuhause in erfahrene Hände geben oder eine Wertanlage
          erfolgreich verkaufen möchtest – unser System macht es dir leicht, das
          Beste aus deinem Immobilienverkauf herauszuholen. Starte noch heute
          und überzeuge dich selbst: Deine Immobilie, dein Erfolg – einfach,
          schnell und professionell mit Immportant.
        </span>
      </div>
      <PriceButtons />
      <RentalFAQComponent />
    </main>
  );
}
