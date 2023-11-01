import { api } from '@/utils/api';
import Loading from '../../ui/components/Loading';
import { OrderItem } from '../types';
import DataGrid, { DataGridColumn } from '@/features/ui/components/DataGrid';
import { toDateString } from '@/features/shared/helpers/date';

const OrderTable = () => {
  const { data, isLoading } = api.sale.orderById.useQuery();

  const columns: DataGridColumn<OrderItem>[] = [
    {
      field: 'saleTime',
      headerName: 'saleTime',
      value: (val) => toDateString(val.saleTime),
    },
    {
      field: 'itemId',
      headerName: 'itemId',
    },
    {
      field: 'itemName',
      headerName: 'itemName',
    },
    {
      field: 'price',
      headerName: 'price',
    },
    {
      field: 'quantity',
      headerName: 'quantity',
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
