import { useEffect, useState } from "react";
import styles from "./realEstates.module.css";
import globalstyle from "../globalApp.module.css";
import { useRouter } from "next/router";
import { BACKEND_URL } from "@/lib/config";
import axiosInstance from "@/lib/axiosInstance";
import { useSelectedRealEstate } from "@/contexts/selectedRealEstateContext";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin, Home } from "lucide-react";

interface RealEstate {
  id: string;
  object_category__type_of_use: string;
  object_category__marketing_type: string;
  geo__street: string;
  geo__house_number: string;
  title_image: {
    id: string;
    attachment_titel: string;
    document: string;
  } | null;
}

export default function RealEstatePage() {
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [newRealEstate, setNewRealEstate] = useState({});
  const { setSelectedRealEstateId } = useSelectedRealEstate();
  const router = useRouter();

  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        const response = await axiosInstance.get("/real-estate/view/");
        setRealEstates(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Immobilien:", error);
      }
    };
    fetchRealEstates();
  }, []);

  const handleCreateRealEstate = async () => {
    try {
      const response = await axiosInstance.post(
        "/real-estate/create/",
        newRealEstate
      );
      const newRealEstateId = response.data.id;
      setSelectedRealEstateId(newRealEstateId);
      router.push(`/app/objectDetails/${newRealEstateId}`);
    } catch (error) {
      console.error("Fehler beim Erstellen der Immobilie:", error);
    }
  };

  const handleSelectRealEstate = (id: string) => {
    setSelectedRealEstateId(id);
    router.push(`/app/dashboard/${id}`);
  };

  return (
    <main className={globalstyle.appMainContainer}>
      <h2>Meine Immobilien</h2>
      <div className={styles.newObjectButton}>
        <button onClick={handleCreateRealEstate}>Neu Inserieren</button>
      </div>
      <div className={styles.objectContainer}>
        {realEstates.map((estate) => (
          <Card
            key={estate.id}
            className={`${styles.card} ${styles.cardHover}`}
            onClick={() => handleSelectRealEstate(estate.id)}
          >
            <div className={styles.imageContainer}>
              {estate.title_image ? (
                <Image
                  src={`${BACKEND_URL}media/${estate.title_image.document}`}
                  alt={estate.title_image.attachment_titel}
                  layout="fill"
                  objectFit="cover"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <Home className={styles.placeholderIcon} />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>
                <MapPin className={styles.mapPinIcon} />
                {estate.geo__street} {estate.geo__house_number}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.cardAddress}>
                {estate.object_category__type_of_use} (
                {estate.object_category__marketing_type})
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
