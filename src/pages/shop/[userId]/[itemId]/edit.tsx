import EditShopItem from '@/features/shop/components/EditShopItem';
import Layout from '@/features/ui/components/layouts/Normal';
import { NextPageWithLayout } from '@/pages/_app';

const EditShopItemPage: NextPageWithLayout = () => {
  return <EditShopItem></EditShopItem>;
};

EditShopItemPage.getLayout = Layout;

export default EditShopItemPage;
