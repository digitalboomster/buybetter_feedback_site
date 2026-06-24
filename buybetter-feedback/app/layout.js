import "./globals.css";

export const metadata = {
  title: "BuyBetter · In-store feedback",
  description: "Tell us about your visit to a BuyBetter store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
