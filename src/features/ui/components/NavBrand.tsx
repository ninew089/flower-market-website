import Link from 'next/link';
import Image from 'next/image';

const NavBrand = () => {
  return (
    <Link href="/market" className="flex  items-center gap-x-1 lg:px-2">
      <Image
        priority
        src="/assets/images/logo.png"
        alt="logo"
        width={50}
        height={50}
      />
      <div className="text-pink-600 text-xl font-semibold">Flowshiny</div>
    </Link>
  );
};

export default NavBrand;
