import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="de">
        <Head>
          <meta name="description" content="Vermarkte deine Immobilien ohne Makler" />
          <script src="https://webcachex-eu.datareporter.eu/loader/v2/cmp-load.js?url=4b0746e3-c2a1-4a69-9484-d1cbb6b0beb6.ORQuLprYvVDA.vR2" defer></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;