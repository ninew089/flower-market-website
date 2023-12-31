import { type SubmitHandler, useForm } from 'react-hook-form';
import { type ShopItemInput } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as validators from '../helpers/validators';
import FlowerUploader from '@/features/ui/components/FlowerUploader';
import { useSession } from 'next-auth/react';
import FormField from '@/features/ui/components/form/FormField';
import Button from '@/features/ui/components/Button';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '@/features/ui/components/Loading';
import { getImagePath } from '@/features/shared/helpers/upload';
import { useAppStore } from '@/features/store';

const EditShopItem = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const setUiToast = useAppStore((state) => state.setUiToast);

  const { mutateAsync: update } = api.item.update.useMutation({
    onSuccess() {
      setUiToast({ type: 'Success', message: 'Success,Updated Flower' });
      void router.push(`/shop/${session?.user.id}`);
    },
    onError({ message }) {
      setUiToast({ type: 'Error', message });
    },
  });

  const itemId = router.query.itemId as string;
  const { data: item, isLoading } = api.item.byId.useQuery(+itemId);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<ShopItemInput>({
    resolver: zodResolver(validators.shopItems),
    defaultValues: { image: undefined },
  });

  const updateProfile: SubmitHandler<ShopItemInput> = async (shopItem) => {
    update({
      data: { ...shopItem, available: !!shopItem.available ? 'true' : 'false' },
      id: +itemId,
    });
  };

  useEffect(() => {
    if (typeof item !== 'undefined' && item !== null) {
      setValue('productName', item.productName);
      setValue('content', item.content);
      setValue('excerpt', item.excerpt);
      setValue('image', item.image);
      setValue('price', item.price);
      setValue('slug', item.slug);
      setValue('stock', item.stock);
      setValue(
        'available',
        !!item.available
          ? ('true' as any as boolean)
          : ('false' as any as boolean),
      );
    }
  }, [item]);

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="mx-auto max-w-lg px-5">
      <form onSubmit={handleSubmit(updateProfile)}>
        <div className="center mx-auto py-3">
          <FlowerUploader
            defaultImage={item?.image ?? '/assets/images/avatar.png'}
            onImageChanged={(image) => {
              setValue('image', getImagePath(image), { shouldValidate: true });
            }}
            error={errors.image?.message}
          ></FlowerUploader>
        </div>
        <FormField
          id="productName"
          label="Product Name"
          placeholder="Your Product Name"
          error={errors.productName?.message}
          {...register('productName')}
        />
        <FormField
          id="excerpt"
          label="Product Excerpt"
          placeholder="Your Product Excerpt"
          error={errors.excerpt?.message}
          {...register('excerpt')}
        />
        <FormField
          id="content"
          label="Product Details"
          placeholder="Your Product Details"
          error={errors.content?.message}
          {...register('content')}
        />
        <FormField
          id="slug"
          label="Product Slug"
          placeholder="Your Product Slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <FormField
          id="price"
          label="Product Price"
          type="number"
          placeholder="Your Product Price"
          error={errors.price?.message}
          {...register('price', {
            valueAsNumber: true,
            validate: (value) => value > 0,
          })}
        />
        <FormField
          id="stock"
          label="Stock"
          type="number"
          placeholder="Your Stock"
          error={errors.stock?.message}
          {...register('stock', {
            valueAsNumber: true,
            validate: (value) => value > 0,
          })}
        />
        <label>
          <div>
            <input type="radio" value="true" {...register('available')} />
            Available
          </div>
        </label>
        <label>
          <div>
            <input type="radio" value="false" {...register('available')} />
            Sold Out
          </div>
        </label>

        <Button
          type="submit"
          align="center"
          color={isValid ? 'primary' : 'default'}
          disabled={!isValid}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default EditShopItem;
