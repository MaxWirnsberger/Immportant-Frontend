"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import HamburgerMenuComponent from "./hamburgerMenu_component/hamburgerMenu";
// import Submenu from "./Submenu/submenu";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/mainpage/header/header_img.webp"
              alt="Header Logo"
              width={250}
              height={40}
            />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li className={pathname === "/service/" ? styles.active : ""}>
              <Link href="/service">Unser Service</Link>
            </li>

            <li className={pathname === "/price/sale/" ? styles.active : ""}>
              <Link href="/price/sale/">Verkaufspreis</Link>
            </li>
            <li className={pathname === "/price/rental/" ? styles.active : ""}>
              <Link href="/price/rental/">Vermietungspreis</Link>
            </li>

            {/* <li className={pathname === "/blog/" ? styles.active : ""}>
              <Link href="/blog/">Blog</Link>
            </li> */}

            <div className={styles.authLinks}>
              {/* <li
                className={`${styles.headerLink} ${
                  pathname === "/auth/contactMail/" ? styles.active : ""
                }`}
              >
                <Link href="/auth/contactMail/">Beim Start dabei sein</Link>
              </li> */}
              <li
                className={`${styles.headerLogin} ${
                  pathname === (isAuthenticated ? "/app/realEstates/" : "/auth/login/") ? styles.active : ""
                }`}
              >
                <Link href={isAuthenticated ? "/app/realEstates/" : "/auth/login/"}>
                  Login
                </Link>
              </li>
            </div>
          </ul>
        </nav>
        <div className={styles.responsiveMenu}>
          <HamburgerMenuComponent />
        </div>
      </div>
    </header>
  );
};

export default Header;
