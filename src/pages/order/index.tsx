import OrderTable from '@/features/order/components/OrderTable';
import Layout from '@/features/ui/components/layouts/Normal';
import { ReactNode } from 'react';

const OrderPage = () => {
  return <OrderTable></OrderTable>;
};

OrderPage.getLayout = ({ children }: { children: ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default OrderPage;
