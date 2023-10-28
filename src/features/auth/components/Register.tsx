import { useRouter } from 'next/router';
import { type RegisterUIInput } from '../types';
import RegisterForm from './RegisterForm';
import { api } from '@/utils/api';
import { useAppStore } from '@/features/store';
import { aesEncrypt } from '@/utils/encrypt';

const Register = () => {
  const router = useRouter();
  const setUiToast = useAppStore((state) => state.setUiToast);
  const { mutate: register } = api.auth.register.useMutation({
    onSuccess() {
      router.replace('/auth/sign-in');
    },
    onError({ message }) {
      setUiToast({ type: 'Error', message });
    },
  });
  const submit = (credentials: RegisterUIInput) => {
    console.log(credentials);
    register({
      ...credentials,
      citizenId: aesEncrypt(credentials.citizenId),
      tel: aesEncrypt(credentials.tel),
    });
  };

  return <RegisterForm onSubmit={submit}></RegisterForm>;
};

export default Register;
