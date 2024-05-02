import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

import { useRouter } from "next/router";
import { createClient } from "~/utils/supabase/component";
import { Toaster } from "~/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp = ({ Component, pageProps }: AppProps) => {
  const { push, pathname } = useRouter();
  const supabaseClient = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event) => {
      if (pathname == "/update") return;
      switch (event) {
        case "SIGNED_IN":
          void push("/");
          return;
        case "SIGNED_OUT":
          void push("/login");
          return;
      }
    });
    return subscription.unsubscribe;
  }, [pathname, push, supabaseClient.auth]);

  return (
    <div className={`flex-1 ${inter.className}`}>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
};

export default api.withTRPC(MyApp);
