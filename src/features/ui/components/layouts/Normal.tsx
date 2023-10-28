import Link from 'next/link';
import { ReactNode } from 'react';
import Navbar from '../Navbar';
import { useSession } from 'next-auth/react';
import AuthMenu from '@/features/auth/components/AuthMenu';
import FloatingActionButton from '../FloatingActionButton';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useAppStore } from '@/features/store';
import { useRouter } from 'next/router';

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const route = useRouter();
  const { data: session, status } = useSession();
  const cartItem = useAppStore((state) => state.items);
  return (
    <>
      <Navbar>
        <Navbar.Navbrand></Navbar.Navbrand>
        <Navbar.NavItem to="/market">Market Places</Navbar.NavItem>
        {/* <Navbar.NavItem to="/announcements">Announcements</Navbar.NavItem>
        <Navbar.NavItem to="/articles">Blog</Navbar.NavItem> */}
        <div className="flex-1" />
        {session?.user.name ? (
          <AuthMenu />
        ) : (
          <Navbar.NavItem to="/auth/sign-in">Login</Navbar.NavItem>
        )}
      </Navbar>
      <main className="mt-20 py-10">{children}</main>
      {cartItem.length > 0 && (
        <FloatingActionButton
          className="top-[100px]"
          onClick={() => route.push('/cart')}
        >
          <ShoppingCartIcon width={24} height={24} />
        </FloatingActionButton>
      )}
    </>
  );
};
export default Layout;
