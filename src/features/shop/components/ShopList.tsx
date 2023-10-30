import MarketItem from '@/features/market/components/MarketItem';
import Button from '@/features/ui/components/Button';
import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import { aesDecrypt } from '@/utils/encrypt';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ShopList = () => {
  const router = useRouter();
  const { data } = useSession();
  const userId = router.query.userId as string;

  const { data: dataShop, isLoading } = api.item.byUserId.useQuery(+userId);

  const isMyShop = data?.user.id === userId;
  if (typeof userId === 'undefined') return <div>Not found.</div>;
  if (isLoading) return <Loading></Loading>;
  if (!dataShop)
    return (
      <div className="flex flex-col items-center justify-center gap-4 mt-20">
        <Image
          priority
          src="/assets/images/logo.png"
          alt="logo"
          width={100}
          height={100}
        />
        <p className="text-xl text-pink-600 font-semibold text-center">
          Add Your Flowers and Bring Color
          <br /> to Your Shop!
        </p>
        <p className="text-sm max-w-[300px] text-center text-gray-600">
          Start today and watch your customers feel the joy of your exquisite
          blooms! 🌼🌸🌻
        </p>
        <Button
          color="primary"
          className="w-fit h-fit"
          onClick={() => router.push(`/shop/${userId}/add`)}
        >
          Add your Flower
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="flex  flex-col gap-y-2 lg:flex-row lg:items-center justify-between mb-10">
        <div className="flex">
          {dataShop.shopInfo?.image && (
            <Image
              priority
              src={`/uploads/${aesDecrypt(dataShop.shopInfo.image)}`}
              alt="logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover object-center "
            />
          )}
          <p className="text-xl pl-5 font-medium">
            {`Shop ${dataShop.shopInfo?.name}`}
          </p>
        </div>
        {isMyShop && dataShop.items.length > 0 && (
          <Button
            color="primary"
            className="w-fit h-fit place-self-end lg:place-self-none"
            onClick={() => router.push(`/shop/${userId}/add`)}
          >
            Add your Flower
          </Button>
        )}
      </div>
      {dataShop.items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 mt-20">
          <Image
            priority
            src="/assets/images/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
          <p className="text-xl text-pink-600 font-semibold text-center">
            Add Your Flowers and Bring Color
            <br /> to Your Shop!
          </p>
          <p className="text-sm max-w-[300px] text-center text-gray-600">
            Start today and watch your customers feel the joy of your exquisite
            blooms! 🌼🌸🌻
          </p>
          <Button
            color="primary"
            className="w-fit h-fit"
            onClick={() => router.push(`/shop/${userId}/add`)}
          >
            Add your Flower
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataShop.items.map((item) => (
          <MarketItem key={item.id} {...item} edit={isMyShop} userId={userId} />
        ))}
      </div>
    </div>
  );
};

export default ShopList;
