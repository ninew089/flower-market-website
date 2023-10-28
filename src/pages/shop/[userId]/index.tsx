import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../../_app';
import ShopList from '@/features/shop/components/ShopList';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';

const IndexPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <ShopList></ShopList>
    </ProtectedRoute>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;
