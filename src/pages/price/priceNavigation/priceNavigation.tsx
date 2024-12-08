import React, { useState } from "react";
import Link from "next/link";
import styles from "./priceNavigation.module.css";

const PriceButtons: React.FC = () => {
  const items = [
    {
      option: "Verkaufen",
      imgSrc: "/images/headermenu/sale.jpeg",
      description: "Verkaufen Sie Ihre Immobilie schnell und gewinnbringend.",
      link: "/price/sale/",
    },
    {
      option: "Vermieten",
      imgSrc: "/images/headermenu/rent.jpeg",
      description: "Finden Sie den idealen Mieter für Ihre Immobilie.",
      link: "/price/rental/",
    },
  ];

  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleOptionHover = (item: typeof items[0]) => {
    setSelectedItem(item);
  };

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationContent}>
        <div className={styles.imageContainer}>
          <img
            src={selectedItem.imgSrc}
            alt={selectedItem.option}
            className={styles.navigationImage}
          />
        </div>
        <div className={styles.menuContainer}>
          <div className={styles.optionsContainer}>
            <ul className={styles.optionsMenu}>
              {items.map((item, index) => (
                <Link href={item.link} key={index}>
                  <li
                    className={styles.optionItem}
                    onMouseEnter={() => handleOptionHover(item)}
                  >
                    {item.option}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className={styles.descriptionContainer}>
            <div className={styles.menuDescription}>
              {selectedItem.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceButtons;
