import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Gina by KeebCats - A gallery of pictures of the Gina Macro-Numpad."
          />
          <meta property="og:site_name" content="gallery.gina.keebcats.co.uk" />
          <meta
            property="og:description"
            content="Gina by KeebCats - A gallery of pictures of the Gina Macro-Numpad."
          />
          <meta
            property="og:title"
            content="Gina Macro-Numpad by KeebCats - Clickture Gallery"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Gina Macro-Numpad by KeebCats - Clickture Gallery"
          />
          <meta
            name="twitter:description"
            content="See pictures for the Gina Macro-Numpad by KeebCats."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
