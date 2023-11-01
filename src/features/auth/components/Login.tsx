import { useAppStore } from '@/features/store';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { type LoginInput } from '../types';
import LoginForm from './LoginForm';
import { aesEncrypt } from '@/utils/encrypt';

const Login = () => {
  const router = useRouter();
  const setUiToast = useAppStore((state) => state.setUiToast);

  const submit = async (credentials: LoginInput) => {
    const result = await signIn('credentials', {
      ...credentials,
      password: aesEncrypt(credentials.password),
      redirect: false,
    });

    if (result?.ok) return router.replace('/market');
    if (result?.error) {
      setUiToast({ type: 'Error', message: 'Invalid Credentials' });
    }
  };

  return <LoginForm onSubmit={submit}></LoginForm>;
};

export default Login;
