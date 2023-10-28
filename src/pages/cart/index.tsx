import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../_app';
import CartList from '@/features/cart/components/CartList';

const IndexPage: NextPageWithLayout = () => {
  return <CartList></CartList>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
