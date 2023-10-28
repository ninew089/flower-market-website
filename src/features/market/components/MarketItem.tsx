import Link from 'next/link';
import { Item } from '../types';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/solid';

export type MarketItemProps = Item & { edit?: boolean; userId?: string };

const MarketItem = ({
  id,
  slug,
  title,
  image,
  price,
  edit,
  userId,
}: MarketItemProps) => {
  return (
    <Link
      href={`/market/${slug}`}
      className="relative px-4 pt-4 pb-5 flex flex-col w-full shadow-md rounded-xl shadow-black/5"
    >
      {edit && userId && (
        <Link
          href={`/shop/${userId}/${id}/edit`}
          className="bg-pink-100 p-1 rounded-full absolute top-0 right-4 z-10"
        >
          <PencilIcon width={16} className="text-pink-500" />
        </Link>
      )}

      <Image
        priority
        src={image}
        alt={title}
        width="0"
        height="0"
        sizes="100vw"
        objectFit="cover"
        className="mx-auto rounded-md object-cover object-center w-full h-[240px]"
      />
      <p className="mt-4 text-base font-medium line-clamp-2 ">{title}</p>
      <p className="text-right mt-auto font-medium">฿{price}</p>
    </Link>
  );
};

export default MarketItem;
