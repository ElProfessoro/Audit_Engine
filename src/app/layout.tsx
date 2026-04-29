import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audit Engine — MSDN Consulting",
  description: "Outil de démonstration commerciale pour audits RGPD",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
