import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Fuente principal para títulos y nombre del hotel
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

// Fuente secundaria elegante
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Fuente para texto normal
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Rose Garden Hotel",
  description: "Hotel boutique de lujo con estilo oriental y servicios excepcionales",
  keywords: ["hotel", "lujo", "spa", "resort", "the rose garden"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body 
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}