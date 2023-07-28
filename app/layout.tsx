import "./globals.css";

export const metadata = {
  title: "InSentence.net | Practice English",
  description:
    "Practice and improve your English with thousands of example sentences with pronunciation.",
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="text-cblack_light text-sans min-h-screen flex flex-col justify-between ">
        <header>
          <Navbar />
        </header>
        {children}
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
