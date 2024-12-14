"use client";
import Image from "next/image";
import styles from "./testimonial.module.css";
import * as React from "react";
import TestimonialCarousellComponent from "./testimonial_carousell_component/testimonial_carousell_component";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function TestimonialComponent() {
  const [isVertical, setIsVertical] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 860);
    };

    handleResize(); // Set initial orientation
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className={styles.testimonialContainer}>
      <div className={styles.testimonialContent}>
        <Image
          src="/images/mainpage/testimonials/quotation_marks.png"
          alt="quotation Image"
          width={500}
          height={500}
          className={styles.quotationImg}
        />
        <div className={styles.testimonialBoxes}>
          <div className={styles.testimonialText}>
            <span>TESTIMONIALS</span> <br />
            <h2 className={styles.testimonialHeadline}>
              Werde Teil unserer Erfolgsgeschichte!
            </h2>
          </div>
          <div className={styles.testimonialCarouselContainer}>
            {/* <Carousel
              orientation={isVertical ? "vertical" : "horizontal"}
              className={styles.testimonialCarouselConten}
              opts={{
                align: isVertical ? "start" : "center",
              }}
            >
              <CarouselContent className={styles.responsiveCarousel}>
                {Array.from({ length: 1 }).map((_, index) => (
                  <CarouselItem key={index} className={styles.testimonialCarouselBox}>
                    <TestimonialCarousellComponent />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel> */}
            <TestimonialCarousellComponent />
          </div>
        </div>
      </div>
    </section>
  );
}
