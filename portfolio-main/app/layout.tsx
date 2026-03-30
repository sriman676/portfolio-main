import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sriman | Cyber Defense Portfolio",
  description: "A centralized interactive hub showcasing offensive and defensive cybersecurity engineering, systems architecture, and web analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
