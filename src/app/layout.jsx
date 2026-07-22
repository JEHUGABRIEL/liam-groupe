import { Suspense } from "react";
import { CartProvider } from "../lib/cartContext";
import { I18nProvider } from "../lib/i18nProvider";
import CartDrawer from "../components/CartDrawer";
import ChatBot from "../components/ChatBot";
import "../index.css";

export const metadata = {
  title: "LIAM Groupe — Révéler les talents, créer des opportunités durables",
  description:
    "Structure pluridisciplinaire centrafricaine développant des projets culturels, sportifs, entrepreneuriaux et gastronomiques à Bangui.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    type: "website",
    siteName: "LIAM Groupe",
    title: "LIAM Groupe — Révéler les talents, créer des opportunités durables",
    description:
      "Structure pluridisciplinaire centrafricaine développant des projets culturels, sportifs, entrepreneuriaux et gastronomiques à Bangui.",
    images: [
      {
        url: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1/liam-groupe/home-hero",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIAM Groupe — Révéler les talents, créer des opportunités durables",
    description:
      "Structure pluridisciplinaire centrafricaine développant des projets culturels, sportifs, entrepreneuriaux et gastronomiques à Bangui.",
    images: [
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1/liam-groupe/home-hero",
    ],
  },
};

export const viewport = {
  themeColor: "#0B2A4A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Oswald:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <I18nProvider>
          <CartProvider>
            <Suspense fallback={null}>
              {children}
            </Suspense>
            <CartDrawer />
            <ChatBot />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
