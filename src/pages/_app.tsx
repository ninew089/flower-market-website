import { api } from "@/utils/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { type ReactElement, type ReactNode } from "react";

import "@/styles/globals.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (props: { children: ReactNode }) => ReactElement;
};
interface AppPropsWithLayout extends AppProps<{ session: Session | null }> {
  Component: NextPageWithLayout;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const Layout = Component.getLayout ?? (({ children }) => <>{children}</>);
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
