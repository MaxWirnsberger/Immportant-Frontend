import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
// import styles from "../inquire.module.css";
import styles from "@/pages/app/inquires/overview/inquire.module.css";
import { Input } from "@/components/ui/input";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isReadFilter, setIsReadFilter] = useState<string>("all");
  const [portalFilter, setPortalFilter] = useState<string>("all");

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const router = useRouter();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastInquiryElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInquiries([]);
    setPage(1);
    setHasMore(true);
    fetchInquiries(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realEstateId, searchTerm, isReadFilter, portalFilter]);

  useEffect(() => {
    if (loading || loadingMore) return;
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchInquiries();
      }
    });

    if (lastInquiryElementRef.current) {
      observer.current.observe(lastInquiryElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, loadingMore, hasMore, inquiries]);

  const fetchInquiries = async (reset = false) => {
    if (loading || loadingMore) return;

    setLoading(true);
    setLoadingMore(true);

    const params = new URLSearchParams();
    params.append("page", reset ? "1" : page.toString());
    params.append("page_size", "10");

    if (searchTerm) {
      params.append("name", searchTerm);
    }

    if (isReadFilter !== "all") {
      params.append("is_read", isReadFilter);
    }

    if (portalFilter !== "all") {
      params.append("portal", portalFilter);
    }

    try {
      const response = await axiosInstance.get(
        `/feedback/inquire/${realEstateId}/`,
        {
          params: params,
        }
      );
      const result = response.data;

      setInquiries((prevInquiries) =>
        reset ? result.results : [...prevInquiries, ...result.results]
      );
      setHasMore(!!result.next);
      setPage((prevPage) => (reset ? 2 : prevPage + 1));
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setError("Fehler beim Laden der Anfragen");
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading && !loadingMore && inquiries.length === 0) {
    return <div>Lade Daten...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedInquiries = inquiries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className={styles.mt6}>
      <CardHeader>
        <CardTitle>Nachrichten</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.toolbar}>
          <Input
            type="text"
            placeholder="Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
              setHasMore(true);
            }}
            className={styles.searchInput}
          />
          <Select
            value={isReadFilter}
            onValueChange={(value) => {
              setIsReadFilter(value);
              setPage(1);
              setHasMore(true);
            }}
          >
            <SelectTrigger className={styles.selectInput}>
              <SelectValue placeholder="Filter by read status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="true">Gelesen</SelectItem>
              <SelectItem value="false">Ungelesen</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={portalFilter}
            onValueChange={(value) => {
              setPortalFilter(value);
              setPage(1);
              setHasMore(true);
            }}
          >
            <SelectTrigger className={styles.selectInput}>
              <SelectValue placeholder="Filter by portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Portale</SelectItem>
              <SelectItem value="Immowelt">Immowelt</SelectItem>
              <SelectItem value="Immo-Scout">Immo-Scout</SelectItem>
              <SelectItem value="Kleinanzeigen">Kleinanzeigen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMobile ? (
          <div className={styles.chatList}>
            {sortedInquiries.map((inquiry, index) => (
              <div
                key={inquiry.id}
                className={styles.chatItem}
                onClick={() =>
                  router.push(`/app/inquires/message/${inquiry.id}`)
                }
                ref={
                  index === sortedInquiries.length - 1
                    ? lastInquiryElementRef
                    : null
                }
              >
                <div className={styles.chatItemLeft}>
                  <div className={styles.chatName}>
                    {`${inquiry.firstname} ${inquiry.lastname}`}
                  </div>
                  <div className={styles.chatPreview}>
                    {inquiry.inquiry && inquiry.inquiry.length > 50
                      ? inquiry.inquiry.substring(0, 50) + "..."
                      : inquiry.inquiry || "Keine Vorschau verfügbar"}
                  </div>
                </div>
                <div className={styles.chatItemRight}>
                  <div className={styles.chatTime}>
                    {inquiry.date
                      ? new Date(inquiry.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Kein Datum"}
                  </div>
                  {!inquiry.is_read && (
                    <div className={styles.unreadIndicator}></div>
                  )}
                </div>
              </div>
            ))}
            {loadingMore && <div>Lade weitere Anfragen...</div>}
            {!hasMore && (
              <div className={styles.hasNoMore}>
                Keine weiteren Anfragen verfügbar.
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
                {sortedInquiries.map((inquiry, index) => (
                  <TableRow
                    key={inquiry.id}
                    onClick={() =>
                      router.push(`/app/inquires/message/${inquiry.id}`)
                    }
                    className="cursor-pointer"
                    ref={
                      index === sortedInquiries.length - 1
                        ? (lastInquiryElementRef as MutableRefObject<any>)
                        : null
                    }
                  >
                    <TableCell>{`${inquiry.firstname} ${inquiry.lastname}`}</TableCell>
                    <TableCell>{inquiry.portal}</TableCell>
                    <TableCell>
                      {new Date(inquiry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{inquiry.is_read ? "-" : "Neu"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {loadingMore && <div>Lade weitere Anfragen...</div>}
            {!hasMore && (
              <div className={styles.hasNoMore}>
                Keine weiteren Anfragen verfügbar.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
