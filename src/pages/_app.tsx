import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

import { useRouter } from "next/router";
import { createClient } from "~/utils/supabase/component";
import { Toaster } from "~/components/ui/toaster";
import { CookiesProvider } from "react-cookie";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <CookiesProvider>
      <div className={`flex-1 ${inter.className}`}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </CookiesProvider>
  );
};

export default api.withTRPC(MyApp);
