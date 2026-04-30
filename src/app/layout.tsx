import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System Generator",
  description: "Generate random solar systems with a chance for exotic planets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
