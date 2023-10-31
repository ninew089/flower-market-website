import Layout from '@/features/ui/components/layouts/Normal';
import { NextPageWithLayout } from '../_app';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';

import AdminList from '@/features/admin/components/AdminList';

const IndexPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute roles={['ADMIN']}>
      <AdminList></AdminList>
    </ProtectedRoute>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;
