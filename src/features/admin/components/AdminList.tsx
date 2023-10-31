import { api } from '@/utils/api';
import Loading from '../../ui/components/Loading';
import { getImagePath } from '../../shared/helpers/upload';
import { aesDecrypt } from '@/utils/encrypt';
import Image from 'next/image';
import { AdminItem } from '../types';
import DataGrid, { DataGridColumn } from '@/features/ui/components/DataGrid';

const AdminList = () => {
  const { data, isLoading } = api.admin.overview.useQuery();

  const columns: DataGridColumn<AdminItem>[] = [
    {
      field: 'image',
      headerName: '',
      value: (user) => (
        <Image
          src={
            user.image
              ? getImagePath(aesDecrypt(user.image))
              : '/assets/images/avatar.png'
          }
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover"
        ></Image>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'email',
      headerName: 'Email',
    },
    {
      field: 'tel',
      headerName: 'Tel',
    },
    {
      field: 'sale',
      headerName: 'Total Sale',
    },
  ];

  if (typeof data === 'undefined') return <div>Not found.</div>;
  if (isLoading) return <Loading></Loading>;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="flex flex-col gap-y-5 mt-10">
        <DataGrid
          title="All Membership"
          columns={columns}
          rows={data}
        ></DataGrid>
      </div>
    </div>
  );
};

export default AdminList;
