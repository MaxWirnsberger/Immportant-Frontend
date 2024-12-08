import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Minus, Star } from 'lucide-react'

const comparisonData = [
  { aspect: "Kosten", private: "Gering", makler: "Hoch (3-7% Provision)", product: "Moderat (günstiger als Makler)" },
  { aspect: "Zeitaufwand", private: "Hoch", makler: "Gering", product: "Mittel (effiziente Prozesse)" },
  { aspect: "Marktkenntnisse", private: "Begrenzt", makler: "Umfangreich", product: "Umfangreich (KI-gestützte Analysen)" },
  { aspect: "Preisfindung", private: "Herausfordernd", makler: "Professionell", product: "Präzise (Datenbasiert)" },
  { aspect: "Reichweite", private: "Begrenzt", makler: "Groß", product: "Sehr groß (Online + Offline)" },
  { aspect: "Rechtliche Sicherheit", private: "Risiko", makler: "Hoch", product: "Sehr hoch (Rechtsbeistand inklusive)" },
  { aspect: "Flexibilität", private: "Hoch", makler: "Mittel", product: "Sehr hoch (Kundenorientiert)" },
  { aspect: "Verhandlungsführung", private: "Emotional", makler: "Professionell", product: "KI-unterstützt & professionell" },
  { aspect: "Besichtigungen", private: "Selbst", makler: "Vom Makler", product: "Virtuelle & begleitete Optionen" },
  { aspect: "Unterlagen & Formalitäten", private: "Selbst", makler: "Vom Makler", product: "Automatisiert & professionell" },
]

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center">{children}</div>
)

const RatingIcon = ({ rating }: { rating: 'low' | 'medium' | 'high' }) => {
  switch (rating) {
    case 'high':
      return <IconWrapper><Check className="text-[#2cf599]" /></IconWrapper>
    case 'medium':
      return <IconWrapper><Minus className="text-yellow-500" /></IconWrapper>
    case 'low':
      return <IconWrapper><X className="text-red-500" /></IconWrapper>
  }
}

export default function CompareTableComponent() {
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Vergleich: Immobilienvermarktungsmethoden</CardTitle>
        <CardDescription>Private Vermarktung vs. Makler vs. Unser Produkt</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Aspekt</TableHead>
              <TableHead>Private Vermarktung</TableHead>
              <TableHead>Vermarktung über Makler</TableHead>
              <TableHead className="bg-[#00015e] text-white">Immportant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((item) => (
              <TableRow key={item.aspect}>
                <TableCell className="font-medium">{item.aspect}</TableCell>
                <TableCell>{item.private}</TableCell>
                <TableCell>{item.makler}</TableCell>
                <TableCell className="bg-[#2cf599] font-semibold">{item.product}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">Gesamtbewertung</TableCell>
              <TableCell><RatingIcon rating="low" /></TableCell>
              <TableCell><RatingIcon rating="medium" /></TableCell>
              <TableCell className="bg-[#2cf599]">
                <IconWrapper>
                  <Star className="text-[#00015e] fill-[#00015e]" />
                  <Star className="text-[#00015e] fill-[#00015e]" />
                  <Star className="text-[#00015e] fill-[#00015e]" />
                </IconWrapper>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
