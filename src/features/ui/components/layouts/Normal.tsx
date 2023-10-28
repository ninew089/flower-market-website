import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "../Navbar";
import { useSession } from "next-auth/react";
import AuthMenu from "@/features/auth/components/AuthMenu";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession();
  return (
    <>
      <Navbar>
        <Navbar.Navbrand></Navbar.Navbrand>
        <Navbar.NavItem to="/market">Market Places</Navbar.NavItem>
        {/* <Navbar.NavItem to="/announcements">Announcements</Navbar.NavItem>
        <Navbar.NavItem to="/articles">Blog</Navbar.NavItem> */}
        <div className="flex-1"/>
        {session?.user.name?<AuthMenu/>:   <Navbar.NavItem to="/auth/sign-in">Login</Navbar.NavItem>}
     
      </Navbar>
      <main className="mt-20 py-10">{children}</main>
   
    </>
  );
};
export default Layout;
