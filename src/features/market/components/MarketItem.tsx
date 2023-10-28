import Link from 'next/link';
import { Item } from '../types';
import Image from 'next/image';

export type MarketItemProps = Item;

const MarketItem = ({ id, slug, title, image, price }: MarketItemProps) => {
  return (
    <Link
      href={`/market/${id}`}
      className="px-4 pt-4 pb-5 flex flex-col w-full shadow-md rounded-xl shadow-black/5"
    >
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
