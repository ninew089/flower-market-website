import Layout from '@/features/ui/components/layouts/Normal';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import ChangePassword from '@/features/auth/components/ChangePassword';
import { ReactNode } from 'react';

const ChangePasswordPage = () => {
  return <ChangePassword></ChangePassword>;
};

ChangePasswordPage.getLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default ChangePasswordPage;
