import ProtectedRoute from '@/features/auth/guard/ProtectedRote';
import AddShopItem from '@/features/shop/components/AddShopItem';
import Layout from '@/features/ui/components/layouts/Normal';
import { NextPageWithLayout } from '@/pages/_app';

const AddShopItemPage: NextPageWithLayout = () => {
  return (
    <ProtectedRoute>
      <AddShopItem></AddShopItem>
    </ProtectedRoute>
  );
};

AddShopItemPage.getLayout = Layout;

export default AddShopItemPage;
