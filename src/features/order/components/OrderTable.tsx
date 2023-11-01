import { api } from '@/utils/api';
import Loading from '../../ui/components/Loading';
import { OrderItem } from '../types';
import DataGrid, { DataGridColumn } from '@/features/ui/components/DataGrid';
import { toDateString } from '@/features/shared/helpers/date';
import { aesDecrypt } from '@/utils/encrypt';
import Image from 'next/image';

const OrderTable = () => {
  const { data, isLoading } = api.order.orderByCustomerId.useQuery();

  const columns: DataGridColumn<OrderItem>[] = [
    {
      field: 'createdAt',
      headerName: 'createdAt',
      value: (val) => toDateString(val.createdAt),
    },
    {
      field: 'shop',
      headerName: 'Shop',
      value: (val) => val.shop.name,
    },
    {
      field: 'sale',
      headerName: 'Items',
      value: (val) => (
        <div className="flex flex-col gap-y-1">
          {val.sale.map((x) => (
            <div key={x.id} className="flex gap-x-2">
              <Image
                priority
                src={aesDecrypt(x.item.image)}
                alt={x.item.productName}
                width="0"
                height="0"
                sizes="100vw"
                objectFit="cover"
                className=" rounded-md object-cover object-center w-8 h-8"
              />
              <div>
                product name:{x.item.productName}
                <br />
                quantity:{x.quantity}
                <br />
                total:{x.price}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  if (typeof data === 'undefined') return <div>Not found.</div>;
  if (isLoading) return <Loading></Loading>;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="flex flex-col gap-y-5 mt-10">
        <DataGrid title="My Order" columns={columns} rows={data}></DataGrid>
      </div>
    </div>
  );
};

export default OrderTable;
