import { CartItem as CartItemProps } from '../cart';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useAppStore } from '@/features/store';

const CartItem = ({
  name,
  quantity,
  image,
  price,
  id,
  stock,
}: CartItemProps & { stock: number }) => {
  const add = useAppStore((state) => state.addItem);
  const remove = useAppStore((state) => state.removeItem);
  const clearCart = useAppStore((state) => state.clearCart);
  return (
    <div className="px-5 flex gap-x-8 w-full">
      <Image
        priority
        src={image}
        alt={name}
        width="0"
        height="0"
        sizes="100vw"
        objectFit="cover"
        className="rounded-md object-cover object-center w-[100px] h-[100px] hover:scale-105 transition-all duration-300"
      />
      <div className="flex flex-col gap-y-3 flex-1">
        <p>{name}</p>
        <div className="flex gap-x-1">
          <p
            className="w-6 h-6 bg-gray-100 flex justify-center items-center rounded-sm cursor-pointer"
            onClick={() => {
              quantity < stock && add({ name, quantity: 1, image, price, id });
            }}
          >
            +
          </p>
          <div className="w-8 flex items-center justify-center">{quantity}</div>
          <p
            className="w-6 h-6 bg-gray-100 flex justify-center items-center rounded-sm cursor-pointer"
            onClick={() => {
              remove(id, quantity);
            }}
          >
            -
          </p>
        </div>
      </div>
      <div className="h flex items-center">
        <TrashIcon
          width={24}
          className="text-rose-700 cursor-pointer"
          onClick={() => clearCart(id)}
        />
      </div>
    </div>
  );
};

export default CartItem;
