import MarketItem from '@/features/market/components/MarketItem';
import Button from '@/features/ui/components/Button';
import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ShopList = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  if (typeof userId === 'undefined') return <div>Not found.</div>;

  const { data: items, isLoading } = api.item.byUserId.useQuery(+userId);

  if (isLoading) return <Loading></Loading>;
  if (!items)
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
      <div className="flex items-center justify-between mb-10">
        <p className="text-xl pl-5 font-medium"> Market Place</p>
        {items.length > 0 && (
          <Button
            color="primary"
            className="w-fit h-fit"
            onClick={() => router.push(`/shop/${userId}/add`)}
          >
            Add your Flower
          </Button>
        )}
      </div>
      {items.length === 0 && (
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
        {items.map((item) => (
          <MarketItem key={item.id} {...item} edit userId={userId}></MarketItem>
        ))}
      </div>
    </div>
  );
};

export default ShopList;
