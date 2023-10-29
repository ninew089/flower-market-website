import { useForm, type SubmitHandler } from 'react-hook-form';
import { type RegisterInput } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as validators from '../helpers/validators';
import Button from '@/features/ui/components/Button';
import FormField from '@/features/ui/components/form/FormField';
import Link from 'next/link';

export type RegisterFormProps = {
  onSubmit: SubmitHandler<RegisterInput>;
};

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(validators.register(false)),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg flex flex-col gap-y-4 px-5"
    >
      <h2 className="mb-4 text-center font-semibold text-2xl text-pink-500">
        Register
      </h2>
      <div className="flex flex-col gap-y-3 p-4 border shadow-black/50 rounded-xl">
        <p className="text-xl font-medium">Information</p>
        <FormField
          id="name"
          label="Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormField
          id="citizenId"
          label="citized ID"
          placeholder="Enter your citized ID"
          error={errors.citizenId?.message}
          {...register('citizenId')}
        />
        <FormField
          id="tel"
          label="Tel"
          placeholder="Tel"
          error={errors.tel?.message}
          {...register('tel')}
        />
      </div>
      <div className="flex flex-col gap-y-3 p-4 border shadow-black/50 rounded-xl">
        <p className="text-xl font-medium">Create Account</p>
        <FormField
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" color="primary">
          Register
        </Button>
        <Link href={'/auth/sign-in'}>Already have an account?</Link>
      </div>
    </form>
  );
};

export default RegisterForm;
