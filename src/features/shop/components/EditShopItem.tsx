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

const EditShopItem = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutateAsync: update, isSuccess } = api.item.update.useMutation();
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
    update({ data: shopItem, id: +itemId });
  };

  useEffect(() => {
    if (typeof item !== 'undefined' && item !== null) {
      setValue('title', item.title);
      setValue('content', item.content);
      setValue('excerpt', item.excerpt);
      setValue('image', item.image);
      setValue('price', item.price);
      setValue('slug', item.slug);
    }
  }, [item]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/shop/${session?.user.id}`);
    }
  }, [isSuccess]);

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit(updateProfile)}>
        <div className="center mx-auto py-3">
          <FlowerUploader
            defaultImage={item?.image ?? '/assets/images/avatar.png'}
            onImageChanged={(image) => {
              setValue('image', '/uploads/' + image, { shouldValidate: true });
            }}
            error={errors.image?.message}
          ></FlowerUploader>
        </div>
        <FormField
          id="title"
          label="Product Name"
          placeholder="Your Product Name"
          error={errors.title?.message}
          {...register('title')}
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