import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Home,
  FileText,
  Camera,
  Image,
  LayoutTemplateIcon as LayoutPlanIcon,
  FileSignature,
  BarChart2,
  Globe,
  UserCheck,
  Clock,
} from "lucide-react";
import styles from "./serviceOverview.module.css";

export default function ServiceOverview() {
  const services = [
    {
      icon: Home,
      title: "Immobilienbewertung",
      description: "Mit modernen Tools",
    },
    {
      icon: FileText,
      title: "Dokumenten-Checkliste",
      description: "Vollständige Unterlagen",
    },
    {
      icon: Camera,
      title: "Anleitung zur Bildererstellung",
      description: "Professionelle Aufnahmen",
    },
    {
      icon: Image,
      title: "Bildbearbeitung",
      description: "Optimierung Ihrer Fotos",
    },
    {
      icon: LayoutPlanIcon,
      title: "Grundriss Erstellung",
      description: "Detaillierte Pläne",
    },
    {
      icon: FileSignature,
      title: "Exposé-Erstellung",
      description: "Ansprechende Präsentation",
    },
    {
      icon: BarChart2,
      title: "Statistiken und Reportings",
      description: "Datenbasierte Einblicke",
    },
    {
      icon: Globe,
      title: "Veröffentlichung",
      description: "Auf allen wichtigen Portalen",
    },
    {
      icon: UserCheck,
      title: "Persönlicher Ansprechpartner",
      description: "Individuelle Betreuung",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Unser Service</h2>
      <div className={styles.gridContainer}>
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <IconComponent
                  className={`${styles.w8} ${styles.h8} ${styles.mb2} ${styles.serviceIcon}`}
                />
                <CardTitle className={styles.overviewText}>
                  {service.title}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
      <Card className={styles.mt8}>
        <CardHeader>
          <CardTitle className={styles.cardTitleFlex}>
            <Clock
              className={`${styles.w6} ${styles.h6} ${styles.mr2} ${styles.serviceIcon}`}
            />
            Gültigkeitsdauer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.flexContainer}>
            <Badge
              variant="secondary"
              className={`${styles.textLg} ${styles.py2} ${styles.px4}`}
            >
              <CheckCircle
                className={`${styles.w5} ${styles.h5} ${styles.mr2}`}
              />
              <div className={styles.timePeriod}>6 Monate bei Verkauf</div>
              <div className={styles.timePeriodResponse}>6 Monate bei <br/>Verkauf</div>
            </Badge>
            <Badge
              variant="secondary"
              className={`${styles.textLg} ${styles.py2} ${styles.px4}`}
            >
              <CheckCircle
                className={`${styles.w5} ${styles.h5} ${styles.mr2}`}
              />
              <div className={styles.timePeriod}>2 Monate bei Vermietung</div>
              <div className={styles.timePeriodResponse}>2 Monate bei <br/>Vermietung</div>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
