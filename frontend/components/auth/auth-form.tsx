'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Mode = "login" | "register";

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res =
        mode === "register"
          ? await authApi.register({
              email: values.email,
              password: values.password,
              name: values.name || "",
            })
          : await authApi.login({
              email: values.email,
              password: values.password,
            });
      setSession(res.user, res.accessToken);
      toast.success(`Welcome ${res.user.name}`);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message ?? "Unable to sign in");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Name</label>
          <Input placeholder="Alex Builder" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-danger">{errors.name.message}</p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Email</label>
        <Input placeholder="you@example.com" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-danger">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Password</label>
        <Input
          type="password"
          placeholder="At least 8 characters"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-danger">{errors.password.message}</p>
        )}
      </div>
      {mode === "register" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Confirm password</label>
          <Input
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-danger">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>
      )}
      <Button className="w-full" type="submit" disabled={isSubmitting} loading={isSubmitting}>
        {mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
};
