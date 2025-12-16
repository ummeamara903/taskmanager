import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Task Manager",
  description: "Manage your tasks easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
