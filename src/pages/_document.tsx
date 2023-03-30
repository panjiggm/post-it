import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`mx-4 bg-gray-200 md:mx-48 xl:mx-96`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
