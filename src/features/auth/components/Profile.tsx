import { type SubmitHandler, useForm } from 'react-hook-form';
import { type ProfileInput } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as validators from '../helpers/validators';
import AvatarUploader from '@/features/ui/components/AvatarUploader';
import { useSession } from 'next-auth/react';
import { getImagePath } from '@/features/shared/helpers/upload';
import FormField from '@/features/ui/components/form/FormField';
import Button from '@/features/ui/components/Button';
import { useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';

const Profile = () => {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const { mutateAsync: update } = api.auth.update.useMutation();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileInput>({
    resolver: zodResolver(validators.profile),
    defaultValues: { image: undefined },
  });

  const updateProfile: SubmitHandler<ProfileInput> = async (profile) => {
    await update({
      ...profile,
      tel: profile.tel ? aesEncrypt(profile.tel) : undefined,
    });
    await updateSession({
      ...profile,
      tel: profile.tel ? aesEncrypt(profile.tel) : undefined,
    });

    // setUiToast({
    //   type: 'Success',
    //   message: 'Your profile has already updated.',
    // });

    router.push('/market');
  };

  useEffect(() => {
    if (session?.user.name) setValue('name', session.user.name);
    if (session?.user.email) setValue('email', session.user.email);
    if (session?.user.tel) setValue('tel', aesDecrypt(session.user.tel));
  }, [session?.user.email, session?.user.name, setValue]);

  return (
    <div className="mx-auto max-w-lg px-5">
      <form onSubmit={handleSubmit(updateProfile)}>
        <div className="center mx-auto py-3">
          <AvatarUploader
            defaultImage={
              session?.user.image
                ? getImagePath(session.user.image)
                : '/assets/images/avatar.png'
            }
            onImageChanged={(image) => {
              setValue('image', image, { shouldValidate: true });
            }}
            error={errors.image?.message}
          ></AvatarUploader>
        </div>
        <FormField
          id="name"
          label="Name"
          placeholder="Your awesome name"
          error={errors.name?.message}
          {...register('name')}
        ></FormField>
        <FormField
          id="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        ></FormField>
        <FormField
          id="name"
          label="Tel"
          placeholder="Your Tel name"
          error={errors.name?.message}
          {...register('tel')}
        ></FormField>

        <Button
          type="submit"
          align="center"
          color={isValid ? 'primary' : 'default'}
          disabled={!isValid}
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default Profile;
