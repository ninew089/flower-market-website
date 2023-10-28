import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../../_app';
import StaticList from '@/features/shop/components/StaticList';


const IndexPage: NextPageWithLayout = () => {
  return <StaticList></StaticList>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
