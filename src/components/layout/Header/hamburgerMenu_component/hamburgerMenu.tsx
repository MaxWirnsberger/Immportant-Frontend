"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./hamburgerMenu.module.css";
import { Menu, X, ChevronDown } from "lucide-react";

export default function HamburgerMenuComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // Zustand für das Untermenü
  const pathname = usePathname();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof Element &&
      !event.target.closest(`.${styles.menuWrap}`) &&
      !event.target.closest(`.${styles.menuIcon}`)
    ) {
      setMenuOpen(false);
      setSubmenuOpen(false); // Schließe das Untermenü auch, wenn außerhalb geklickt wird
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const handlePriceClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <div className={styles.hamburgerContainer}>
      <div onClick={() => setMenuOpen(true)}>
        <Menu className={styles.menuIcon} />
      </div>
      <div className={`${styles.menuWrap} ${menuOpen ? styles.menuOpen : ""}`}>
        <nav className={styles.menu}>
          <a
            href="/service"
            className={pathname == "/service" ? styles.active : ""}
          >
            <span>Unser Service</span>
          </a>
          <a
            onClick={handlePriceClick}
            className={`${styles.priceButton} ${
              pathname === "/price" || submenuOpen
                ? styles.priceActive
                : styles.priceInactive
            }`}
          >
            <span>Preis</span>
            <ChevronDown
              className={`${styles.chevronIcon} ${
                pathname == "/price" || submenuOpen
                  ? styles.chevronActive
                  : styles.chevronInactive
              }`}
            />
          </a>
          {submenuOpen && (
            <div className={styles.submenu}>
              <a
                href="/price/rental"
                className={pathname == "/price/rental" ? styles.active : ""}
              >
                <span>Vermietung</span>
              </a>
              <a
                href="/price/sale"
                className={pathname == "/price/sale" ? styles.active : ""}
              >
                <span>Verkauf</span>
              </a>
            </div>
          )}
          {/* <a href="/blog" className={pathname == "/blog" ? styles.active : ""}>
            <span>Blog</span>
          </a>
          <a
            href="/auth/register"
            className={`${styles.burgerRegister} ${
              pathname === "/auth/register" ? styles.active : ""
            }`}
          >
            <span>Jetzt inserieren</span>
          </a> */}
          <a
            href="/auth/login"
            className={`${styles.burgerLogin} ${
              pathname === "/auth/login" ? styles.active : ""
            }`}
          >
            <span>Login</span>
          </a>
        </nav>
        <button
          className={styles.closeButton}
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>
      </div>
    </div>
  );
}
