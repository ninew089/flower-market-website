import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../../_app';
import ShopList from '@/features/shop/components/ShopList';

const IndexPage: NextPageWithLayout = () => {
  return <ShopList></ShopList>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
