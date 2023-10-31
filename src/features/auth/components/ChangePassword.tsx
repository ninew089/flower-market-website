import { useAppStore } from '@/features/store';
import Button from '@/features/ui/components/Button';
import FormField from '@/features/ui/components/form/FormField';
import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as validators from '../helpers/validators';
import { type ChangeInput } from '../types';

const ChangePassword = () => {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const setUiToast = useAppStore((state) => state.setUiToast);
  const { mutateAsync: update } = api.auth.update.useMutation();
  const {
    handleSubmit,
    register,

    formState: { errors, isValid },
  } = useForm<ChangeInput>({
    resolver: zodResolver(validators.changePassword),
  });

  const updatePassword: SubmitHandler<ChangeInput> = async (changePassword) => {
    await update({
      ...changePassword,
    });
    await updateSession({
      ...changePassword,
    });
    setUiToast({
      type: 'Success',
      message: 'Success,Change your password.',
    });
    void router.push('/market');
  };

  return (
    <div className="mx-auto max-w-lg px-5">
      <form onSubmit={handleSubmit(updatePassword)}>
        <FormField
          id="password"
          label="New Password"
          type="password"
          placeholder="New Password"
          error={errors.password?.message}
          {...register('password')}
        ></FormField>
        <FormField
          id="password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        ></FormField>

        <Button
          type="submit"
          align="center"
          color={isValid ? 'primary' : 'default'}
          // disabled={!isValid}
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
