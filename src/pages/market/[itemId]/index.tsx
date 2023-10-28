import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../../_app';
import MarketItemDetail from '@/features/market/components/MarketItemDetail';

const IndexPage: NextPageWithLayout = () => {
  return <MarketItemDetail></MarketItemDetail>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
