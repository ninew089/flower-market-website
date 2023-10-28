import Profile from '@/features/auth/components/Profile';
import { NextPageWithLayout } from '../_app';
import Layout from '@/features/ui/components/layouts/Normal';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';

const ProfilePage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <Profile></Profile>
    </ProtectedRoute>
  );
};

ProfilePage.getLayout = Layout;

export default ProfilePage;
