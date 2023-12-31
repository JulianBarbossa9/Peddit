import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "Peddit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        roboto.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
        {/* @ts-expect-error server component */}
        <NavBar />
        { authModal }
        <div className="container max-w-7xl mx-auto h-full pt-12">
          { children }
        </div>
        
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
