import Profile from '@/features/auth/components/Profile';
import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import Layout from '@/features/ui/components/layouts/Normal';
import { ReactNode } from 'react';

const ProfilePage = () => {
  return <Profile></Profile>;
};

ProfilePage.getLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
