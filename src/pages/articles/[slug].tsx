import Layout from "@/features/ui/components/layouts/Normal";
import { NextPageWithLayout } from "../_app";

const DetailPage: NextPageWithLayout = () => {
  return <div>Index Page</div>;
};

DetailPage.getLayout = Layout;

export default DetailPage;
