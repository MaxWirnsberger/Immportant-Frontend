"use client";

import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./package.module.css";

interface Package {
  title: string;
  price: number; // Preis als Zahl
  image: string;
  width: number;
  height: number;
  special?: boolean;
}

interface PackageSelectionProps {
  type: "rental" | "sale";
  field: ControllerRenderProps<any, string>;
  duration: number;
}

const rentalPlans: Package[] = [
  {
    title: "Small",
    image: "/images/mainpage/price/package1.webp",
    width: 200,
    height: 112,
    price: 50,
  },
  {
    title: "Large",
    image: "/images/mainpage/price/package3.webp",
    price: 80,
    width: 200,
    height: 265,
    special: true,
  },
  {
    title: "Medium",
    image: "/images/mainpage/price/package2.webp",
    width: 200,
    height: 120,
    price: 60,
  },
];

const salePlans: Package[] = [
  {
    title: "Small",
    image: "/images/mainpage/price/package1.webp",
    width: 200,
    height: 112,
    price: 85,
  },
  {
    title: "Large",
    image: "/images/mainpage/price/package3.webp",
    price: 145,
    width: 200,
    height: 265,
    special: true,
  },
  {
    title: "Medium",
    image: "/images/mainpage/price/package2.webp",
    width: 200,
    height: 120,
    price: 115,
  },
];

const PackageSelection: React.FC<PackageSelectionProps> = ({ type, field, duration }) => {
  const packages = type === "rental" ? rentalPlans : salePlans;

  const calculatePrice = (basePrice: number, duration: number): string => {
    const totalPrice = basePrice * duration;
    return `${totalPrice}€`;
  };

  return (
    <div className={styles.priceBoxContainer}>
      {packages.map((pkg) => (
        <div
          key={pkg.title}
          className={cn(
            styles.priceBoxContent,
            field.value === pkg.title && styles.selectedPackage, 
            pkg.special && styles.special
          )}
          onClick={() => {
            field.onChange(pkg.title); 
          }}
        >
          <h2>{pkg.title}</h2>
          <div className={styles.priceImage}>
            <Image
              src={pkg.image}
              alt={pkg.title}
              width={pkg.width}
              height={pkg.height}
            />
          </div>
          <p className="text-2xl font-bold mb-2">
            {calculatePrice(pkg.price, duration)}
            <span className="text-sm font-normal"> inkl. MwSt.</span>
          </p>
          {pkg.special && (
            <div className={styles.specialSymbole}>
              <div className={styles.specialSymboleContent}>Bestes Angebot</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PackageSelection;
