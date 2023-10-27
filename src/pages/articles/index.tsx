import Layout from "@/features/ui/components/layouts/Normal";
import { type NextPageWithLayout } from "../_app";

import { Leave, User } from "@prisma/client";

const IndexPage: NextPageWithLayout = () => {
  return <div>Index Page</div>;
};

IndexPage.getLayout = Layout;

export default IndexPage;
