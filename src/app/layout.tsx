import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayThatJam | Tip to Pick the Next Song",
  description:
    "The live music request platform where your tips decide what plays next. Request songs, tip to boost them up the queue, and compete to hear your favorite track.",
  keywords: ["song request", "live music", "tipping", "DJ", "bar music", "request songs"],
  openGraph: {
    title: "PlayThatJam | Tip to Pick the Next Song",
    description:
      "The live music request platform where your tips decide what plays next.",
    images: [{ url: "/playthatjamlogo.png", width: 440, height: 340, alt: "PlayThatJam" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PlayThatJam | Tip to Pick the Next Song",
    description:
      "The live music request platform where your tips decide what plays next.",
    images: ["/playthatjamlogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
