import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bee Dental — Perfilando tu sonrisa con precisión y calidez | Santo Domingo",
  description:
    "Sistema Integral de Gestión Clínica y Odontología Avanzada en Plaza Balón, Av. Charles de Gaulle 10, Santo Domingo.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300685f'><path d='M12 2C8.5 2 6 4.5 6 7.5c0 2.2 1.3 4.2 2 6.5.6 2 1 4 2 6 .5 1 1.5 2 2 2s1.5-1 2-2c1-2 1.4-4 2-6 .7-2.3 2-4.3 2-6.5C18 4.5 15.5 2 12 2zm0 3c1.7 0 3 1.3 3 3 0 1.5-.8 3-1.3 4.8-.4 1.4-.7 2.8-1.2 4.2-.2-.5-.4-1.1-.6-1.6-.6-1.7-1.3-3.4-1.3-4.8 0-1.7 1.3-3 3-3z'/><circle cx='8.5' cy='7.5' r='1.2' fill='%2389f5e7'/><circle cx='15.5' cy='7.5' r='1.2' fill='%2389f5e7'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

