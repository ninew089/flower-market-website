import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import EditShopItem from '@/features/shop/components/EditShopItem';
import Layout from '@/features/ui/components/layouts/Normal';
import { NextPageWithLayout } from '@/pages/_app';

const EditShopItemPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <EditShopItem></EditShopItem>
    </ProtectedRoute>
  );
};

EditShopItemPage.getLayout = Layout;

export default EditShopItemPage;
