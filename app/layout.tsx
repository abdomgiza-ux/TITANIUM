import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://titaniumtechnology.ae"),
  title: "TiTANiUM Technology | Modern IT & Infrastructure Solutions",
  description:
    "Reliable IT support, infrastructure, networking, troubleshooting, CCTV systems, Microsoft 365, website solutions, and technical consultation in Dubai, UAE.",
  keywords: [
    "TiTANiUM Technology",
    "Dubai IT support",
    "network solutions",
    "Microsoft 365 setup",
    "CCTV systems",
    "office technology setup",
    "website solutions Dubai",
    "technology consultation"
  ],
  icons: {
    icon: "/logo-cropped.png",
    shortcut: "/logo-cropped.png",
    apple: "/logo-cropped.png"
  },
  openGraph: {
    title: "TiTANiUM Technology",
    description:
      "Modern IT & Infrastructure Solutions for businesses and individuals in Dubai, UAE.",
    type: "website",
    locale: "en_AE",
    images: [
      {
        url: "/logo-cropped.png",
        width: 1820,
        height: 520,
        alt: "TiTANiUM Technology logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TiTANiUM Technology | Modern IT & Infrastructure Solutions",
    description:
      "Reliable technology services, IT support, networking, troubleshooting, and digital solutions in Dubai.",
    images: ["/logo-cropped.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
