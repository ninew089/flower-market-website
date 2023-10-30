import { NextPageWithLayout } from '../_app';
import Layout from '@/features/ui/components/layouts/Normal';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import ChangePassword from '@/features/auth/components/ChangePassword';

const ChangePasswordPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <ChangePassword></ChangePassword>
    </ProtectedRoute>
  );
};

ChangePasswordPage.getLayout = Layout;

export default ChangePasswordPage;
