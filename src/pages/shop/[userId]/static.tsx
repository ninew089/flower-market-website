import Layout from '@/features/ui/components/layouts/Normal';
import { type NextPageWithLayout } from '../../_app';
import StaticList from '@/features/shop/components/StaticList';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';

const IndexPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <StaticList></StaticList>
    </ProtectedRoute>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;
