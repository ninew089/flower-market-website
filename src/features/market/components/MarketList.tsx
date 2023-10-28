import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import MarketItem from './MarketItem';
import { useDeferredValue, useState } from 'react';

const MarketList = () => {
  const [search, setSearch] = useState('');
  const deferredQuery = useDeferredValue(search);
  const {
    data: items,
    isLoading,
    isError,
  } = api.item.list.useQuery(deferredQuery);

  if (isError) return <div>Not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="flex justify-between items-center">
        <p className="text-xl pl-5 font-medium mb-10"> Market Place</p>
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'Search your flower'}
          type="text"
          className="mt-1 max-w-xl block w-full rounded-md border-gray-900 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></input>
      </div>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <MarketItem key={item.id} {...item}></MarketItem>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketList;
