import { useRouter } from 'next/router';
import { Item } from '../types';
import Image from 'next/image';
import { api } from '@/utils/api';
import Loading from '@/features/ui/components/Loading';
import Button from '@/features/ui/components/Button';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/features/store';

export type MarketItemProps = Item;

const MarketItemDetail = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data: item, isLoading } = api.item.bySlug.useQuery(slug);
  const { mutate } = api.item.view.useMutation();
  const addItem = useAppStore((state) => state.addItem);

  useEffect(() => {
    if (typeof item !== 'undefined' && item !== null) {
      mutate(item.id);
    }
  }, [item]);

  if (isLoading) return <Loading></Loading>;
  if (!item || typeof slug === 'undefined') return <div>Not found.</div>;

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
      <p className="text-right mt-auto font-medium mb-10">
        post by {item.name}
      </p>
      <p className="text-right mt-auto font-medium mb-10">฿{item.price}</p>

      <Button
        className="mt-1"
        color="primary"
        onClick={() =>
          addItem({
            id: item.id,
            name: item.title,
            price: item.price,
            image: item.image,
            quantity: 0,
          })
        }
      >
        Buy
      </Button>
    </div>
  );
};

export default MarketItemDetail;
