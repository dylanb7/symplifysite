import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "~/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={`flex-1 ${inter.className}`}>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
};

export default api.withTRPC(MyApp);
