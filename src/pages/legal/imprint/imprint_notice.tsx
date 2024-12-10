import React, { useEffect } from "react";

const ImprintNotice: React.FC = () => {
  useEffect(() => {
    const placeholder = document.getElementById("dr-imprint-div");
    if (placeholder) {
      placeholder.innerHTML = "Laden...";
    }
  }, []);

  return (
    <div
      id="dr-privacynotice-container"
      style={{ minHeight: "400px", width: "100%" }}
    >
      <div id="dr-imprint-div"></div>
      <noscript>
        <iframe
          width="100%"
          style={{ minHeight: "400px" }}
          src="https://webcache-eu.datareporter.eu/c/4b0746e3-c2a1-4a69-9484-d1cbb6b0beb6/ORQuLprYvVDA/imprint_noscript.html"
        ></iframe>
      </noscript>
    </div>
  );
};

export default ImprintNotice;
