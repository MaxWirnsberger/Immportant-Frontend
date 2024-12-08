import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./invoice.module.css";
import globalstyle from "../../globalApp.module.css";
import { Loader2 } from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  amount: string;
  pdf: string | null;
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get("/payments/invoice-list/");
        setInvoices(response.data);
      } catch (err) {
        setError("Fehler beim Laden der Rechnungen.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <main className={globalstyle.appMainContainer}>
      <h2>Rechnungen</h2>
      {loading ? (
        <div className={styles.loader}>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Laden...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : invoices.length > 0 ? (
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>R.-Nr.</th>
              <th>Datum</th>
              <th>Betrag</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoice_number}</td>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td>{invoice.amount} €</td>
                <td>
                  {invoice.pdf ? (
                    <a
                      href={invoice.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pdfLink}
                    >
                      PDF anzeigen
                    </a>
                  ) : (
                    "Nicht verfügbar"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Keine Rechnungen vorhanden.</p>
      )}
    </main>
  );
}
