import CustomerOrderTable from '@/features/shop/components/CustomerOrderTable';
import Layout from '@/features/ui/components/layouts/Normal';
import { ReactNode } from 'react';

const CustomerOrderPage = () => {
  return <CustomerOrderTable></CustomerOrderTable>;
};

CustomerOrderPage.getLayout = ({ children }: { children: ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default CustomerOrderPage;
