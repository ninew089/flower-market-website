import { useRouter } from 'next/router';
import { type RegisterInput } from '../types';
import RegisterForm from './RegisterForm';
import { api } from '@/utils/api';
import { aesEncrypt } from '@/utils/encrypt';
import { useAppStore } from '@/features/store';

const Register = () => {
  const router = useRouter();
  const setUiToast = useAppStore((state) => state.setUiToast);
  const { mutateAsync: register } = api.auth.register.useMutation({
    onSuccess() {
      router.replace('/auth/sign-in');
    },
    onError({ message }) {
      setUiToast({ type: 'Error', message });
    },
  });
  const submit = async (credentials: RegisterInput) => {
    await register({
      ...credentials,
      citizenId: aesEncrypt(credentials.citizenId),
      tel: aesEncrypt(credentials.tel),
    });
  };

  return <RegisterForm onSubmit={submit}></RegisterForm>;
};

export default Register;
