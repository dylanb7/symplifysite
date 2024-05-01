import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { Footer } from "~/components/footer";
import { NavigationBar } from "~/components/nav";
import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <div className={`flex-1 ${inter.className}`}>
        <NavigationBar />
        <main className={`font-sans ${inter.variable}`}>
          <Component {...pageProps} />
          <Toaster />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
