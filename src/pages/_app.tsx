
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import { SessionContextProvider } from '@supabase/auth-helpers-react';

import "~/styles/globals.css";
import type { AppProps } from 'next/app'
import { useEffect, useState } from "react";
import { type Session, createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) => {
 
  const { push, pathname } = useRouter()
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event) => {
      if(pathname == '/update') return;
      switch (event) {
        case 'SIGNED_IN':
          void push('/');
          return
        case 'SIGNED_OUT':
          void push('/login');
          return
      }
    })
    return subscription.unsubscribe
  }, [pathname, push, supabaseClient.auth])

  return (
    <div className={`flex-1 ${inter.className}`}>
    <SessionContextProvider
      supabaseClient={supabaseClient}
      
      initialSession={pageProps.initialSession}
    >
      
        <Component {...pageProps} />
      
    </SessionContextProvider>
    </div>
  
  );
};

export default api.withTRPC(MyApp);
