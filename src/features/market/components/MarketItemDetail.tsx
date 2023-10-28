import { useRouter } from 'next/router';
import { Item } from '../types';
import Image from 'next/image';
import { api } from '@/utils/api';
import Loading from '@/features/ui/components/Loading';
import Button from '@/features/ui/components/Button';
import { useEffect } from 'react';

export type MarketItemProps = Item;

const MarketItemDetail = () => {
  const router = useRouter();
  const itemId = router.query.itemId as string;

  useEffect(() => {
    if (typeof itemId === 'undefined') {
      mutate(+itemId);
    }
  }, []);

  const { data: item, isLoading } = api.item.byId.useQuery(+itemId);
  const { mutate } = api.item.view.useMutation();

  if (isLoading) return <Loading></Loading>;
  if (!item || typeof itemId === 'undefined') return <div>Not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-5 flex flex-col w-full">
      <Image
        priority
        src={item.image}
        alt={item.title}
        width="0"
        height="0"
        sizes="100vw"
        objectFit="cover"
        className="mx-auto rounded-md object-cover object-center w-full h-[320px]"
      />
      <div className="text-right mt-1"> sold {item.sold} items</div>
      <p className="mt-4 text-base font-medium line-clamp-2 ">{item.title}</p>
      <p className="text-sm font-medium line-clamp-2 ">{item.content}</p>
      <p className="text-right mt-auto font-medium">฿{item.price}</p>
      <Button className="mt-1" color="primary">
        Buy
      </Button>
    </div>
  );
};

export default MarketItemDetail;
