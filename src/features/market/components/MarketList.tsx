import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import MarketItem from './MarketItem';

const MarketList = () => {
  const { data: items, isLoading } = api.item.list.useQuery(); // CSR

  if (isLoading) return <Loading></Loading>;
  if (!items) return <div>Not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <p className="text-xl pl-5 font-medium mb-10"> Market Place</p>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <MarketItem key={item.id} {...item}></MarketItem>
        ))}
      </div>
    </div>
  );
};

export default MarketList;
