import Layout from "@/features/ui/components/layouts/Normal";
import { type NextPageWithLayout } from "../_app";
import MarketList from "@/features/market/components/MarketList";


const IndexPage: NextPageWithLayout = () => {
  return <MarketList></MarketList>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
