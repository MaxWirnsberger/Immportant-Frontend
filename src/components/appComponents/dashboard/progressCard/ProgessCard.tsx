import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import styles from "../dashboard.module.css";

export function ProgressCard() {
  return (
    <Card className={styles.mt6}>
      <CardHeader>
        <CardTitle>Fortschritt</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={52} className={styles.progress} />
        <div className={styles.progressText}>52% bis zum Interim</div>
      </CardContent>
    </Card>
  );
}
