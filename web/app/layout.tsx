import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAO Voting - Gasless Governance",
  description: "Decentralized Autonomous Organization with gasless voting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

