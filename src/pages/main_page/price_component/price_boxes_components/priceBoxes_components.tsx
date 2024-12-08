'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import styles from './priceBoxes.module.css';

type SparpotenzialCalculatorProps = {
  type?: 'sale' | 'rental';
};

export default function SparpotenzialCalculator({ type = 'sale' }: SparpotenzialCalculatorProps) {
  const [preis, setPreis] = useState<number>(type === 'sale' ? 300000 : 1000);
  const immportantCost = type === 'sale' ? 1750 : 890;

  const traditionelleMakler =
    type === 'sale'
      ? Math.round(Math.round(preis * 0.06)*1.02)
      : Math.round(Math.round(preis * 3)*1.02); 

  const gespart = traditionelleMakler - immportantCost;

  const sliderEinstellungen =
    type === 'sale'
      ? { min: 30000, max: 2000000, step: 1000 }
      : { min: 300, max: 2500, step: 10 };

  return (
    <div className={styles.sppContainer}>
      <p className={styles.sppDescription}>
        {type === 'sale'
          ? 'Verkaufspreis deiner Immobilie eingeben und Sparpotenzial berechnen lassen.'
          : 'Monatsmiete deiner Immobilie eingeben und Sparpotenzial berechnen lassen.'}
      </p>

      <div className={styles.sppGrid}>
        <div className={styles.sppCard}>
          <div className={styles.sppCardContent}>
            <h3 className={styles.sppCardTitle}>
              {type === 'sale' ? 'Verkaufspreis' : 'Monatsmiete'}
            </h3>
            <div className={styles.sppInputSection}>
              <Slider
                value={[preis]}
                onValueChange={(value) => setPreis(value[0])}
                min={sliderEinstellungen.min}
                max={sliderEinstellungen.max}
                step={sliderEinstellungen.step}
                className={cn(styles.sppSlider, 'w-full')}
              />
              <div className={styles.sppSliderLabel}>
                <span>{sliderEinstellungen.min.toLocaleString('de-DE')} €</span>
                <span>{sliderEinstellungen.max.toLocaleString('de-DE')} €</span>
              </div>
            </div>
            <div className={styles.sppPriceValue}>
              {preis.toLocaleString('de-DE')} €
            </div>
          </div>
        </div>

        <div className={styles.sppCard}>
          <div className={styles.sppCardContent}>
            <h3 className={styles.sppCardTitle}>Provisionskosten</h3>
            <div className={styles.sppCalculations}>
              <div className={styles.sppCalculationRow}>
                <span>Traditionelle Makler</span>
                <span className={styles.sppCalculationValue}>
                  {traditionelleMakler.toLocaleString('de-DE')} €
                </span>
              </div>
              <div className={styles.sppCalculationRow}>
                <span>IMMPORTANT</span>
                <span className={styles.sppCalculationValue}>
                  {immportantCost.toLocaleString('de-DE')} €
                </span>
              </div>
              <div className={`${styles.sppCalculationRow} ${styles.sppSaving}`}>
                <span className={styles.savingText}>Gespart mit Immportant</span>
                <span className={styles.responsiveSavingText}>Gespart</span>
                <span className={styles.sppCalculationValue}>
                  {gespart.toLocaleString('de-DE')} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {type === 'sale' ? 
        <div className={'pt-4'}><span className={'text-red-500'}>*</span> Berechnung nach 6% und 20% MwSt.</div> : 
        <div className={'pt-4'}><span className={'text-red-500'}>*</span> Berechnung nach 3 Monatsmieten und 20% MwSt.</div>}
    </div>
  );
}
