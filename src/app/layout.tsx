import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar"; 
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Inbox - Stacked Layout",
  description: "Layout estilo inbox basado en Tailwind UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
           
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
