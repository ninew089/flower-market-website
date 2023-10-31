import Layout from '@/features/ui/components/layouts/Normal';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import AdminList from '@/features/admin/components/AdminList';
import { ReactNode } from 'react';

const AdminPage = () => {
  return <AdminList></AdminList>;
};

AdminPage.getLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute roles={['ADMIN']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
