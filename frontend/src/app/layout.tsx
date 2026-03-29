import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "NoteMark - Personal Notes & Bookmark Manager",
    description: "Save and organize your notes and bookmarks with tags, search, and favorites",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white min-h-screen`}>
                <AuthProvider>
                    <Navbar />
                    <main className="pt-16">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
