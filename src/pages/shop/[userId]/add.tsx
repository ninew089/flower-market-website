import AddShopItem from "@/features/shop/components/AddShopItem";
import Layout from "@/features/ui/components/layouts/Normal";
import { NextPageWithLayout } from "@/pages/_app";


const AddShopItemPage: NextPageWithLayout = () => {
  return <AddShopItem></AddShopItem>;
};


AddShopItemPage.getLayout = Layout;

export default AddShopItemPage;