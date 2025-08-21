import { Poppins, Poltawski_Nowy } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import NextTopLoader from "nextjs-toploader";

const poltawski = Poltawski_Nowy({
  variable: "--font-poltawski",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Emilioroo | Home",
  description: "Please Sign up or Sign in to continue.",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return notFound()
  }
  return (
    <html lang={locale}>
      <body
        className={`
          ${poppins.variable}
          ${poltawski.variable}
          antialiased container mx-auto max-w-[1920px] 
        `}
      >
        <>
          <NextTopLoader color="#3b72d8" height={2} showSpinner={false} />
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider>
                {children}
              </NextIntlClientProvider>
              <Toaster richColors />
            </ThemeProvider>
          </StoreProvider>
        </>
      </body>
    </html>
  );
}
