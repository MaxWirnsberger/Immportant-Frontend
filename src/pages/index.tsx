import HeroBanner from "./main_page/hero_component/heroBanner";
import ProblemComponent from "./main_page/problem_component/problem_component";
import SolutionComponent from "./main_page/solution_component/solution_component";
import SoftwareView from "./main_page/softwareView_component/softwareView_component";
import TestimonialComponent from "./main_page/testimonials_component/testimonial_component";
import PriceComponent from "./main_page/price_component/price_component";
import CallToActionComponent from "./main_page/calltoaction_component/callToAction_component";
import styles from "./main_page/price_component/price.module.css";

export default function Homepage() {
  return (
    <>
      <HeroBanner />
      <ProblemComponent />
      <SolutionComponent />
      <div className={styles.priceContainer}>
        <div className={styles.priceContent}>
          <div className={styles.priceHeader}>
            <span>WAS KOSTET DICH DER SPAß?</span>
            <h2>Ein Paket für jedes Budget</h2>
          </div>
          <PriceComponent />
        </div>
      </div>
      {/* <SoftwareView /> */}
      <TestimonialComponent />
      <CallToActionComponent />
    </>
  );
}
