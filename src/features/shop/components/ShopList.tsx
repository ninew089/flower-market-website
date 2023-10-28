import MarketItem from '@/features/market/components/MarketItem';
import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';

const ShopList = () => {
  const router = useRouter();
  const { data: items, isLoading } = api.item.byUserId.useQuery(13); // CSR

  if (isLoading) return <Loading></Loading>;
  if (!items) return <div>Not found.</div>;


  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MarketItem key={item.id} {...item}></MarketItem>
      ))}
     
    </div>
  );
};

export default ShopList;
