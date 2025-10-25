import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
// Import all available fonts for AI usage
import "../lib/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisioTest+ | Testes de Visão Profissionais e Acessíveis",
  description: "Plataforma completa de testes de visão com 9 tipos diferentes de avaliação, resultados personalizados e recomendações baseadas no seu perfil. Apenas R$ 1,00 por teste.",
  keywords: "teste de visão, acuidade visual, daltonismo, contraste, campo visual, oftalmologia, saúde ocular",
  authors: [{ name: "VisioTest+" }],
  creator: "VisioTest+",
  publisher: "VisioTest+",
  robots: "index, follow",
  openGraph: {
    title: "VisioTest+ | Testes de Visão Profissionais",
    description: "Faça testes de visão completos por apenas R$ 1,00. Resultados personalizados e recomendações profissionais.",
    type: "website",
    locale: "pt_BR",
    siteName: "VisioTest+",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisioTest+ | Testes de Visão Profissionais",
    description: "Faça testes de visão completos por apenas R$ 1,00. Resultados personalizados e recomendações profissionais.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1E40AF" }
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script src="/lasy-bridge.js" strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}