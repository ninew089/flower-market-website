import { ShopStaticItem } from '../types';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/outline';

export type ShopStaticCardProps = ShopStaticItem;

const ShopStaticCard = ({
  id,
  productName,
  image,
  price,
  sold,
  viewer,
}: ShopStaticCardProps) => {
  return (
    <div className="flex items-center gap-x-3 p-3 w-full shadow-md rounded-xl shadow-black/5">
      <Image
        priority
        src={image}
        alt={productName}
        width="0"
        height="0"
        sizes="100vw"
        objectFit="cover"
        className=" rounded-md object-cover object-center w-8 h-8"
      />
      <p className="text-base font-medium w-[80px] truncate">{productName}</p>
      <p className="font-medium w-[50px]">฿{price}</p>
      <div className="flex-1 ml-5">
        <p className="font-medium text-xs text-gray-500">sold</p>
        <p className="font-medium">
          {sold} <span className="font-normal text-xs">items</span>
        </p>
      </div>
      <div className="flex gap-x-1 items-center font-medium text-xs">
        <EyeIcon width={16} />
        {viewer} view
      </div>
    </div>
  );
};

export default ShopStaticCard;
