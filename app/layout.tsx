import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Meu Ciclo",
  description: "Acompanhe seu ciclo menstrual de forma simples e inteligente.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meu Ciclo",
  },
  openGraph: {
    title: "Meu Ciclo",
    description: "Acompanhe seu ciclo menstrual de forma simples e inteligente.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Meu Ciclo" }],
  },
  twitter: {
    card: "summary",
    title: "Meu Ciclo",
    description: "Acompanhe seu ciclo menstrual de forma simples e inteligente.",
    images: ["/icons/icon-512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FF385C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className={`${nunito.className} min-h-full flex flex-col bg-white`}>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
