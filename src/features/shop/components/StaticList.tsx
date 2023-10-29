import ShopStaticCard from '@/features/shop/components/ShopStaticCard';
import Button from '@/features/ui/components/Button';
import Loading from '@/features/ui/components/Loading';
import { api } from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const StaticList = () => {
  const router = useRouter();
  const userId = router.query.userId as string;

  if (typeof userId === 'undefined') return <div>Not found.</div>;

  const { data: items, isLoading } = api.item.byUserIdWithStatic.useQuery(
    +userId,
  );

  const { data: saleTimeData } = api.sale.byUserId.useQuery();

  const series = saleTimeData?.series ? saleTimeData.series : [];
  const option: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: saleTimeData?.categories ? saleTimeData.categories : [],
      labels: {
        datetimeUTC: false,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };

  const ChartSale = useMemo(
    () => () =>
      typeof window !== 'undefined' && (
        <ReactApexChart
          options={option}
          series={series}
          type="area"
          height={350}
        />
      ),
    [series, series],
  );

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
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex items-center justify-between mb-10">
        <p className="text-xl pl-5 font-medium">Static</p>
      </div>
      <p className="text-xl pl-5 font-medium mb-10">
        Total Sell: ฿{items.totalSell}
      </p>

      <p className="text-xl pl-5 font-medium text-pink-500">
        Let's see, when is the best-selling time?
      </p>
      <div className="flex flex-col gap-y-6">
        {items.listItems.length === 0 && (
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
              Start today and watch your customers feel the joy of your
              exquisite blooms! 🌼🌸🌻
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
        <ChartSale />
        {items.listItems.map((item) => (
          <ShopStaticCard key={item.id} {...item}></ShopStaticCard>
        ))}
      </div>
    </div>
  );
};

export default StaticList;
