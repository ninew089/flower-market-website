import { api } from '@/utils/api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type NextPage } from 'next';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppProps } from 'next/app';
import { type ReactElement, type ReactNode } from 'react';
import { Kanit } from 'next/font/google';

import '@/styles/globals.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (props: { children: ReactNode }) => ReactElement;
};
interface AppPropsWithLayout extends AppProps<{ session: Session | null }> {
  Component: NextPageWithLayout;
}

const kanit = Kanit({
  subsets: [],
  weight: ['400', '500', '600', '700'],
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const Layout = Component.getLayout ?? (({ children }) => <>{children}</>);
  return (
    <SessionProvider session={session}>
      <Layout>
        <main className={kanit.className}>
          <Component {...pageProps} />
        </main>

        <ReactQueryDevtools initialIsOpen />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
