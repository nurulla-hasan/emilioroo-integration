import { Poppins, Poltawski_Nowy } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { SocketProvider } from "@/context/soket-context/SocketContext";

const poltawski = Poltawski_Nowy({
  variable: "--font-poltawski",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "BankyBondy | Home",
  description: "Please Sign up or Sign in to continue.",
};

export default async function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`
          ${poppins.variable}
          ${poltawski.variable}
          antialiased container mx-auto max-w-[1920px] 
        `}>
        <>
          <NextTopLoader color="#3b72d8" height={2} showSpinner={false} />
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
                <SocketProvider>
                  {children}
                </SocketProvider>
              <Toaster richColors />
            </ThemeProvider>
          </StoreProvider>
        </>
      </body>
    </html>
  );
}
