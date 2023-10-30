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

  const { data: recommendItems, isLoading: isLoadRecommendItems } =
    api.item.recommendList.useQuery();

  if (isError) return <div>Not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <p className="text-xl pl-5 font-medium mb-10 text-pink-500">
        Recommend For You
      </p>
      {isLoadRecommendItems ? (
        <Loading></Loading>
      ) : (
        <div className="flex flex-row snap-x scroll-smooth md:scroll-auto overflow-x-auto gap-x-6 py-4">
          {recommendItems?.map((item, index) => (
            <MarketItem
              key={item.id}
              {...item}
              className="min-w-[calc(100vw-40px)] md:min-w-[320px]"
            ></MarketItem>
          ))}
        </div>
      )}

      <div className="flex  flex-col lg:flex-row justify-between items-center my-20">
        <p className="text-xl pl-5 font-medium mb-10 text-pink-500">
          Market Place
        </p>
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'Search your flower...'}
          type="text"
          className="mb-10 lg:mb-0 mt-1 max-w-xl block w-full rounded-md border border-gray-100 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
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
