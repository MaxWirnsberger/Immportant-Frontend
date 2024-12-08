"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./softwareView.module.css";
import SolutionBox from "./solutionBox_component/solutionBox_component";

export default function SoftwareView() {
  const [currentImage, setCurrentImage] = useState("/images/mainpage/softwareView/desktop_comingSoon.png");

  const availableSolutions = [
    { title: "Einfach Inserieren", text: "Schnittstellen zu Immobilienplattformen", image: "/images/mainpage/softwareView/desktop_noContent.png" },
    { title: "Zentrale Kommunikation", text: "Alle Interessenten auf einen Blick", image: "/images/mainpage/softwareView/desktop_noContent.png" },
    { title: "Bis zu 50% günstiger", text: "Bis 50% gegenüber Einzelanzeigen spare", image: "/images/mainpage/softwareView/desktop_noContent.png" },
  ];

  const comingSoonSolutions = [
    { title: "Schritt für Schritt Anleitung", text: "Der Leitfaden, für deine Vermarktung", image: "/images/mainpage/softwareView/desktop_comingSoon.png" },
    { title: "Auch Mobile erreichbar", text: "Durch mobile App alles im Überblick", image: "/images/mainpage/softwareView/desktop_comingSoon_withMobile.png" },
    { title: "Du musst dir nicht alles ansehen", text: "Filterung und vorab Auswahl der Interrenten", image: "/images/mainpage/softwareView/desktop_comingSoon.png" },
    { title: "Kalender Funktion", text: "Besichtigungstermine verwalten", image: "/images/mainpage/softwareView/desktop_comingSoon.png" },
  ];

  return (
    <section className={styles.softwareViewContainer}>
      <div className={styles.softwareViewContent}>
        <div className={styles.softwareViewText}>
          <span>EINE TOLLE APP</span>
          <h2>Das bietet dir Immportant</h2>
        </div>
        <div className={styles.ViewContainer}>
          <div className={styles.viewBoxes}>
            <span>Bereits vorhanden:</span>
            {availableSolutions.map((solution, index) => (
              <SolutionBox
                key={index}
                title={solution.title}
                text={solution.text}
                onMouseEnter={() => setCurrentImage(solution.image)}
                onMouseLeave={() => setCurrentImage(solution.image)}
              />
            ))}
          </div>
          <div className={styles.imageContainer}>
            <Image src={currentImage} alt="Solution Image" width={500} height={300} />
          </div>
          <div className={styles.viewBoxes}>
            <span>Coming Soon:</span>
            {comingSoonSolutions.map((solution, index) => (
              <SolutionBox
                key={index}
                title={solution.title}
                text={solution.text}
                onMouseEnter={() => setCurrentImage(solution.image)}
                onMouseLeave={() => setCurrentImage(solution.image)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
