import { api } from '@/utils/api';
import Loading from '../../ui/components/Loading';
import { CustomerOrder } from '../types';
import DataGrid, { DataGridColumn } from '@/features/ui/components/DataGrid';
import { toDateString } from '@/features/shared/helpers/date';
import { aesDecrypt } from '@/utils/encrypt';
import Image from 'next/image';

const CustomerOrderTable = () => {
  const { data, isLoading } = api.order.orderByShopId.useQuery();

  const columns: DataGridColumn<CustomerOrder>[] = [
    {
      field: 'createdAt',
      headerName: 'createdAt',
      value: (val) => toDateString(val.createdAt),
    },
    {
      field: 'user',
      headerName: 'Name',
      value: (val) => val.user.name,
    },
    {
      field: 'user',
      headerName: 'Tel',
      value: (val) => aesDecrypt(val.user.tel),
    },
    {
      field: 'user',
      headerName: 'Address',
      value: (val) => val.user.address,
    },
    {
      field: 'sale',
      headerName: 'Items',
      value: (val) => (
        <div className="flex flex-col gap-y-1">
          {val.sale.map((x) => (
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
                  <div className="whitespace-nowrap">
                    <p className="text-gray-900">{x.item.productName}</p>
                    <br />
                    Quantity:&nbsp;{x.quantity}
                    <br />
                    {x.quantity}X{x.price / x.quantity}=&nbsp;฿{x.price}
                  </div>
                </div>
              ))}
              <div className="mt-4 text-gray-900">
                Total:&nbsp;฿
                {val.sale.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.price;
                }, 0)}
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
        <DataGrid
          title="All Customer Order"
          columns={columns}
          rows={data}
        ></DataGrid>
      </div>
    </div>
  );
};

export default CustomerOrderTable;
