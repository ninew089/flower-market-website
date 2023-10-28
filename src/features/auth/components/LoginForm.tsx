import { useForm, type SubmitHandler } from "react-hook-form";
import { type LoginInput, type RegisterInput } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as validators from "../helpers/validators";
import Button from "@/features/ui/components/Button";
import FormField from "@/features/ui/components/form/FormField";
import Link from "next/link";

export type LoginFormProps =
   {
      onSubmit: SubmitHandler<LoginInput>;
    };

const LoginForm = ({ onSubmit }: LoginFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    typeof onSubmit extends SubmitHandler<RegisterInput>
      ? RegisterInput
      : LoginInput
  >({
    resolver: zodResolver(
    validators.login,
    ),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg px-5">
      <h2 className="mb-4 text-center font-semibold text-2xl text-pink-500">
      login
      </h2>
      <FormField
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
       />

      <FormField
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="flex items-center justify-between">
        <Button type="submit" color="primary">
        Login
        </Button>
        <Link href={ "/auth/sign-up"}>
        Sign up?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
