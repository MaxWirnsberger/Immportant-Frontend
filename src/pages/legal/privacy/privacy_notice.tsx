import React, { useEffect } from 'react';

const PrivacyNotice: React.FC = () => {
  useEffect(() => {
    const placeholder = document.getElementById('dr-privacynotice-div');
    if (placeholder) {
      placeholder.innerHTML = 'Laden...'; 
    }
  }, []);

  return (
    <div id="dr-privacynotice-container" style={{ minHeight: '400px', width: '100%' }}>
      <div id="dr-privacynotice-div"></div>
      <noscript>
        <iframe
          width="100%"
          // frameBorder="0"
          style={{ minHeight: '400px' }}
          src="https://webcache-eu.datareporter.eu/c/4b0746e3-c2a1-4a69-9484-d1cbb6b0beb6/ORQuLprYvVDA/vR2/privacynotice_noscript.html"
        ></iframe>
      </noscript>
    </div>
  );
};

export default PrivacyNotice;
