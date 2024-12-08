import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import styles from "@/pages/app/dashboard/dashboard.module.css";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMediaQuery } from "react-responsive";

interface GraphCardProps {
  data: {
    date: string;
    Immowelt: number;
    "Immo-Scout": number;
    Kleinanzeigen: number;
    Gesamt: number;
  }[];
}

const views = [
  "Alle Anfragen",
  "Immowelt",
  "Immo-Scout",
  "Kleinanzeigen",
] as const;
type View = (typeof views)[number];

const chartConfig = {
  Immowelt: { color: "#00015e" },
  "Immo-Scout": { color: "#00015e" },
  Kleinanzeigen: { color: "#00015e" },
  Gesamt: { color: "#00015e" },
};

export function GraphCard({ data }: GraphCardProps) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 445px)" });
  const strokeWidth = isSmallScreen ? 1 : 2;
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const chartData = useMemo(() => {
    return data;
  }, [data]);

  const activePlatform = views[currentViewIndex];

  const hasData = (platform: View) => {
    if (platform === "Alle Anfragen") {
      return chartData.some(
        (day) =>
          day.Immowelt > 0 || day["Immo-Scout"] > 0 || day.Kleinanzeigen > 0
      );
    }
    return chartData.some(
      (day) => (day[platform as keyof typeof day] as number) > 0
    );
  };

  const handleNext = () => {
    let nextIndex = (currentViewIndex + 1) % views.length;
    while (!hasData(views[nextIndex]) && nextIndex !== currentViewIndex) {
      nextIndex = (nextIndex + 1) % views.length;
    }
    setCurrentViewIndex(nextIndex);
  };

  const handlePrevious = () => {
    let prevIndex = (currentViewIndex - 1 + views.length) % views.length;
    while (!hasData(views[prevIndex]) && prevIndex !== currentViewIndex) {
      prevIndex = (prevIndex - 1 + views.length) % views.length;
    }
    setCurrentViewIndex(prevIndex);
  };

  const filteredChartData =
    activePlatform === "Alle Anfragen"
      ? chartData
      : chartData.map((day) => ({
          date: day.date,
          [activePlatform]: day[activePlatform as keyof typeof day],
        }));

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{activePlatform}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData(activePlatform) ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="80%" height={200}>
              <LineChart
                data={filteredChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), "dd MMM")}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                {activePlatform === "Alle Anfragen" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Gesamt"
                      stroke={chartConfig.Gesamt.color}
                      // strokeWidth={2}
                      strokeWidth={strokeWidth}
                      dot={{ fill: chartConfig.Gesamt.color }}
                      activeDot={{ r: 6 }}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey={activePlatform}
                    stroke={chartConfig[activePlatform].color}
                    // strokeWidth={2}
                    strokeWidth={strokeWidth}
                    dot={{ fill: chartConfig[activePlatform].color }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <p className={styles.noDataMessage}>
            Innerhalb der letzten 14 Tage <br />
            keine Nachrichten erhalten
          </p>
        )}
        <ArrowLeft className={styles.iconLeft} onClick={handlePrevious} />
        <ArrowRight className={styles.iconRight} onClick={handleNext} />
      </CardContent>
    </Card>
  );
}
