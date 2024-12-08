import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";
import { useMediaQuery } from "react-responsive";
import styles from "@/pages/app/dashboard/dashboard.module.css";

interface Inquiry {
  id: string;
  form_of_address: string;
  firstname: string;
  lastname: string;
  inquiry: string;
  email: string;
  tel: string;
  date: string;
  portal: "Immowelt" | "Immo-Scout" | "Kleinanzeigen";
  is_read: boolean;
}

interface InquiriesCardProps {
  realEstateId: string;
}

export function InquiriesCard({ realEstateId }: InquiriesCardProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axiosInstance.get(
          `/feedback/recent-inquiries/${realEstateId}/`
        );
        setInquiries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden der Anfragen");
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [realEstateId]);

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedInquiries = inquiries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedInquiries = sortedInquiries.slice(0, 10);
  const hasMoreInquiries = inquiries.length >= 10;

  return (
    <Card className={styles.mt6}>
      <CardHeader>
        <CardTitle>Anfragen</CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className={styles.mobileCardContainer}>
            {displayedInquiries.map((inquiry) => (
              <div key={inquiry.id} className={styles.mobileCard}>
                <p>
                  <strong>Name:</strong>{" "}
                  {`${inquiry.firstname} ${inquiry.lastname}`}
                </p>
                <p>
                  <strong>Portal:</strong> {inquiry.portal}
                </p>
                <p>
                  <strong>Datum:</strong>{" "}
                  {new Date(inquiry.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {inquiry.is_read ? "-" : "Neu"}
                </p>
              </div>
            ))}
            {hasMoreInquiries && (
              <div className={styles.mobileCard}>
                <p>Weitere Einträge verfügbar...</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{`${inquiry.firstname} ${inquiry.lastname}`}</TableCell>
                    <TableCell>{inquiry.portal}</TableCell>
                    <TableCell>
                      {new Date(inquiry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{inquiry.is_read ? "-" : "Neu"}</TableCell>
                  </TableRow>
                ))}
                {hasMoreInquiries && (
                  <TableRow>
                    <TableCell>Weitere Einträge verfügbar...</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
