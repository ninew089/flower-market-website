import { getImagePath } from '@/features/shared/helpers/upload';
import { useAppStore } from '@/features/store';
import AvatarUploader from '@/features/ui/components/AvatarUploader';
import Button from '@/features/ui/components/Button';
import FormField from '@/features/ui/components/form/FormField';
import { api } from '@/utils/api';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as validators from '../helpers/validators';
import { type ProfileInput } from '../types';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const setUiToast = useAppStore((state) => state.setUiToast);
  const { mutateAsync: update } = api.auth.update.useMutation();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileInput>({
    resolver: zodResolver(validators.profile(false)),
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
    setUiToast({
      type: 'Success',
      message: 'Your profile has already updated.',
    });
    void router.push('/market');
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
          id="tel"
          label="Tel"
          placeholder="Your Tel name"
          error={errors.name?.message}
          {...register('tel')}
        ></FormField>
        <Button
          type="submit"
          align="center"
          className="w-full"
          color={isValid ? 'primary' : 'default'}
          disabled={!isValid}
        >
          Update Profile
        </Button>
      </form>
      <p className="mt-10 mb-6 ">Settings</p>
      <Link
        href="/auth/change-password"
        className={`text-gray-900 group flex w-full rounded-md px-2 py-2 text-sm  gap-x-1 items-center border border-black/50`}
      >
        <LockClosedIcon width={16} /> Change Password
      </Link>
    </div>
  );
};

export default Profile;
