import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Awan Leading Company | Heavy Equipment Rental in Jeddah, Saudi Arabia",
    template: "%s | Awan Leading Company",
  },
  description:
    "Awan Leading Company for Logistics is Saudi Arabia's trusted partner for heavy equipment rental — cranes, forklifts, generators, and specialized machinery. From Jeddah to every corner of the Kingdom.",
  metadataBase: new URL("https://awanleading.com"),
  openGraph: {
    title: "Awan Leading Company | Heavy Equipment Rental",
    description:
      "Saudi Arabia's trusted partner for heavy equipment rental — cranes, forklifts, generators, and specialized machinery.",
    locale: "en_SA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
