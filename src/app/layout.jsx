// @ts-nocheck
import Nav from "./Nav";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Send It Yoi",
};

// @ts-ignore
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`mx-4 md:mx-48 xl:mx-96 ${poppins.className} bg-gray-200 font-sans`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
