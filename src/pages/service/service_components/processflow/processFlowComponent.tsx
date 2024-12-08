import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { House } from "lucide-react";
import styles from "./processFlow.module.css";

export default function ProcessFlowComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>So machen wir das</h2>
      </div>
      <div className={styles.grid}>
        {/* Step 1 */}
        <Card>
          <CardContent className={styles.cardContent}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <h2 className={styles.stepTitle}>Kennenlernen</h2>
                <p className={styles.stepDescription}>
                  Zunächst kannst du einen Termin mit uns vereinbaren. Dabei
                  informieren wir dich über unsere Produkte und erklären, was
                  wir von dir benötigen, um dein Inserat zu erstellen.
                  Entscheidet du dich für eine Zusammenarbeit, erstellen wir
                  deinen Account und senden dir eine Liste der benötigten
                  Unterlagen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardContent className={styles.cardContent}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <h2 className={styles.stepTitle}>Vorbereiten</h2>
                <p className={styles.stepDescription}>
                  Mit unserer Checkliste hast du eine
                  Schritt-für-Schritt-Anleitung, welche Dokumente notwendig sind
                  und wo diese abrufbar sind. Außerdem erhältst du von uns
                  Tipps, wie du deine Immobilie optimal in Szene setzt. Sobald
                  du uns alles zugesandt hast können wir mit der
                  Inseratserstellung starten
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardContent className={styles.cardContent}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <h2 className={styles.stepTitle}>Inserats Erstellung</h2>
                <p className={styles.stepDescription}>
                  Beim Erstellen des Inserats bewerten wir zunächst die
                  Immobilie, erstellen einen Grundrissplan, bündeln alle
                  Informationen in einem Exposé und veröffentlichen das Inserat
                  auf den wichtigsten Plattformen. Mit unserem Tool bleibst du
                  stets über den aktuellen Stand deines Inserats informiert.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardContent className={styles.cardContent}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div>
                <h2 className={styles.stepTitle}>Richtigen Kunden finden</h2>
                <p className={styles.stepDescription}>
                  Nachdem das Inserat veröffentlicht wurde, hilft unser Tool
                  dabei, die Anfragen zu verwalten und erleichtert mit der
                  Kalenderfunktion die Terminkoordination mit den Interessenten.
                  Gemeinsam mit deinem persönlichen Ansprechpartner besprichst
                  du die Besichtigungstermine, und finden den passende
                  Interessent, für deine Immobilie.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.footer}>
        <Button size="lg" className={styles.ctaButton}>
          Jetzt einen Termin vereinbaren
        </Button>
      </div>
    </div>
  );
}
