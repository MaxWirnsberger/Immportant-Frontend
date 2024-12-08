import React from "react";
import styles from "./service.module.css";
import ServiceHeroComponent from "./service_hero/serviceHero";
import ProcessFlowComponent from "./service_components/processflow/processFlowComponent";
import CompareComponent from "./service_components/compare_component/compareComponent";
import ServiceOverview from "./service_components/serviceOverview";

// import ServicePriceComponent from "./service_components/price_calculation/servicePrice";
// import ServiceDocumentComponent from "./service_components/document_management/serviceDocuments";
// import ServiceStepsComponent from "./service_components/step_by_step/serviceSteps";
// import ServiceAPIComponent from "./service_components/api_plattform/serviceAPI";
// import ServiceInterestedComponent from "./service_components/interested_management/serviceInterested";
// import ServiceCalenderComponent from "./service_components/calender_management/serviceCalender";
// import CompareTableComponent from "./service_components/compare_component/compareTable";

export default function ServicePage() {
  return (
    <main>
      <ServiceHeroComponent />
      <ProcessFlowComponent />

      <div className={styles.packageContainer}>
          <h2 className={styles.compareHeadline}>Warum unser Produkt so gut ist.</h2>
          <CompareComponent />
      </div>
      <ServiceOverview />
    </main>
  );
}
