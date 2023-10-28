import Button from '@/features/ui/components/Button';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { NextPageWithLayout } from './_app';
import Layout from '@/features/ui/components/layouts/Normal';

const IndexPage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 mt-20">
        <Image
          priority
          src="/assets/images/logo.png"
          alt="logo"
          width={100}
          height={100}
        />
        <p className="text-xl text-pink-600 font-semibold text-center">
          Wellcome to Flowshiny MarketPlace
        </p>
        <p className="text-sm max-w-[300px] text-center text-gray-600">
          Start today and watch your customers feel the joy of your exquisite
          blooms! 🌼🌸🌻
        </p>
        <Button
          color="primary"
          className="w-fit h-fit"
          onClick={() => router.push(`/market`)}
        >
          Get Start 🌼
        </Button>
      </div>
    </div>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;
