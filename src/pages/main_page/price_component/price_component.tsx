"use client";
import styles from "./price.module.css";
import PriceBoxComponent from "./price_boxes_components/priceBoxes_components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PriceComponent() {
  return (
    <div className={styles.priceBoxesContainer}>
      <Tabs defaultValue="sale" className={'w-full'}>
        <div className={styles.priceTabsList}>
          <TabsList className={styles.priceTabsListTrigger}>
            <TabsTrigger value="sale">Verkauf</TabsTrigger>
            <TabsTrigger value="rental">Vermietung</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="sale">
          <PriceBoxComponent type="sale" />
        </TabsContent>
        <TabsContent value="rental">
          <PriceBoxComponent type="rental" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
