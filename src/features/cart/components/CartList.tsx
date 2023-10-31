import { useAppStore } from '@/features/store';
import CartItem from './CartItem';
import Button from '@/features/ui/components/Button';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '@/utils/api';
import { useMemo } from 'react';

const CartList = () => {
  const cartList = useAppStore((state) => state.items);
  const getTotal = useAppStore((state) => state.getTotal);
  const clearAll = useAppStore((state) => state.clearAll);
  const setUiToast = useAppStore((state) => state.setUiToast);
  const router = useRouter();
  const total = useMemo(() => getTotal(), [getTotal, cartList]);
  const { mutateAsync: buy, isLoading } = api.item.buy.useMutation({
    onSuccess() {
      clearAll();
      setUiToast({
        type: 'Success',
        message: `We've confirmed your payment. Thank you for shopping with us`,
      });
      router.push(`/market`);
    },
    onError({ message }) {
      setUiToast({ type: 'Error', message });
    },
  });

  const listIdCart = cartList.map((x) => x.id);
  const { data: listStock } = api.item.findStockList.useQuery(listIdCart);

  const onBuy = async () => {
    const cartItem = cartList.map((item) => ({
      id: item.id,
      total: item.quantity,
    }));

    if (cartItem.length > 0) {
      await buy(cartItem);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5">
      <p className="text-xl pl-5 font-medium mb-10"> My Cart</p>
      <div className="flex flex-col gap-y-6">
        {cartList.map((item, index) => (
          <CartItem
            key={item.id}
            {...item}
            stock={listStock?.[index]?.stock ?? 0}
          ></CartItem>
        ))}
        {cartList.length > 0 && (
          <div className="flex flex-col items-end">
            <p className="mb-6">Total : ฿{total}</p>
            <Button color="primary" onClick={onBuy} disabled={isLoading}>
              Buy
            </Button>
          </div>
        )}
      </div>
      {cartList.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 mt-20">
          <Image
            priority
            src="/assets/images/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
          <p className="text-xl text-pink-600 font-semibold text-center">
            Add Flowers
            <br /> to Your Cart!
          </p>
          <p className="text-sm max-w-[300px] text-center text-gray-600">
            feel the joy of exquisite blooms! 🌼🌸🌻
          </p>
          <Button
            color="primary"
            className="w-fit h-fit"
            onClick={() => router.push(`/market`)}
          >
            Add your Flower
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartList;
