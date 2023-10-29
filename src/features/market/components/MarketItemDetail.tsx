import { useRouter } from 'next/router';
import { Item } from '../types';
import Image from 'next/image';
import { api } from '@/utils/api';
import Loading from '@/features/ui/components/Loading';
import Button from '@/features/ui/components/Button';
import { useEffect } from 'react';
import { useAppStore } from '@/features/store';
import Link from 'next/link';
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/24/solid';
import Badge from '@/features/ui/components/Badge';
import { useSession } from 'next-auth/react';

export type MarketItemProps = Item;

const MarketItemDetail = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data } = useSession();
  const { data: item, isLoading } = api.item.bySlug.useQuery(slug);
  const { mutate } = api.item.view.useMutation();
  const addItem = useAppStore((state) => state.addItem);
  const setUiToast = useAppStore((state) => state.setUiToast);

  useEffect(() => {
    if (typeof item !== 'undefined' && item !== null) {
      mutate(item.id);
    }
  }, [item]);

  if (isLoading) return <Loading></Loading>;
  if (!item || typeof slug === 'undefined') return <div>Not found.</div>;

  const onBuyItem = () => {
    addItem({
      id: item.id,
      name: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    setUiToast({
      type: 'Success',
      message: `Product added to cart successfully`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-5 flex flex-col w-full">
      <Link href="/market" className="flex gap-x-1">
        <ChevronLeftIcon width={24} />
        Back
      </Link>
      <div className="mt-10 relarive">
        {!item.available && <Badge color="danger">Sold Out</Badge>}
        {data?.user.id && (
          <Link
            href={`/shop/${data.user.id}/${item.id}/edit`}
            className="bg-pink-100 p-1 rounded-full absolute top-0 right-4 z-10"
          >
            <PencilIcon width={16} className="text-pink-500" />
          </Link>
        )}
        <Image
          priority
          src={item.image}
          alt={item.title}
          width={320}
          height={320}
          sizes="100vw"
          objectFit="cover"
          className="mx-auto rounded-md hover:scale-105 transition-all duration-300"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-left text-sm mt-1">
          in stock {item.stock} items
        </div>
        <div className="text-right mt-1 text-pink-400">
          sold {item.sold} items
        </div>
      </div>

      <p className="mt-4 text-lg font-medium line-clamp-2  text-pink-500">
        {item.title}
      </p>
      <p className="text-sm font-medium line-clamp-2 ">{item.content}</p>
      <p className="text-right font-medium mb-10 mt-2">
        post by <span className="text-pink-500">{item.name}</span>
      </p>
      <p className="text-right mt-auto font-medium mb-10">฿{item.price}</p>

      <Button
        className="mt-1"
        color="primary"
        onClick={onBuyItem}
        disabled={!item.available}
      >
        Buy
      </Button>
    </div>
  );
};

export default MarketItemDetail;
