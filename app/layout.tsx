import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat, Teko } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SpaceBackground from "../components/SpaceBackground";
import Footer from '@/sections/Footer'
import { AuthProvider } from '@/lib/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-teko",
});

export const metadata: Metadata = {
  title: "House of Geeks",
  description: "House of Geeks is the technical society of IIIT Ranchi",
};

export default function RootLayout({
  children,
  community,
}: Readonly<{
  children: React.ReactNode;
  community: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${teko.variable} antialiased`}
      >
        <AuthProvider>
          <SpaceBackground />
          <CustomCursor />
          {children}
          {community}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
