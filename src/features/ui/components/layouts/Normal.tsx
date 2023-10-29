import AuthMenu from '@/features/auth/components/AuthMenu';
import ProtectedResource from '@/features/auth/guard/ProtectedResource';
import { useAppStore } from '@/features/store';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import FloatingActionButton from '../FloatingActionButton';
import Navbar from '../Navbar';
import Toast from '../Toast';

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const route = useRouter();
  const { data: session } = useSession();
  const cartItem = useAppStore((state) => state.items);

  return (
    <>
      <Navbar>
        <Navbar.Navbrand></Navbar.Navbrand>
        <Navbar.NavItem to="/">Home</Navbar.NavItem>
        <Navbar.NavItem to="/market">Market Place</Navbar.NavItem>
        <div className="flex-1" />
        <ProtectedResource>
          <AuthMenu />
        </ProtectedResource>
        {!session?.user.name && (
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
      <Toast></Toast>
    </>
  );
};
export default Layout;
