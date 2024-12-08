import React, { useState } from "react";
import Link from "next/link";
import styles from "./submenu.module.css";

interface SubmenuItem {
  option: string;
  imgSrc: string;
  title: string;
  description: string;
  link: string;
}

interface SubmenuProps {
  items: SubmenuItem[];
}

const Submenu: React.FC<SubmenuProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<SubmenuItem>(items[0]);

  const handleOptionHover = (item: SubmenuItem) => {
    setSelectedItem(item);
  };

  return (
    <div className={styles.submenu}>
      <div className={styles.submenuContent}>
        <div className={styles.imageContainer}>
          <img
            src={selectedItem.imgSrc}
            alt={selectedItem.option}
            className={styles.submenuImage}
          />
        </div>
        <div className={styles.menuContainer}>
          <div className={styles.optionsContainer}>
            <ul className={styles.optionsMenu}>
              <div className={styles.optionsTitle}>{selectedItem.title}</div>
              {items.map((item, index) => (
                <Link href={item.link}>
                  <li
                    key={index}
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

export default Submenu;
