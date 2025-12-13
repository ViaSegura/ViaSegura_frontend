"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@viasegura/components/ui/form";
import { Input } from "@viasegura/components/ui/input";
import { Loader } from "@viasegura/components/loader/index";
import { toast } from "sonner";

import { loginSchema } from "./schemas";
import { loginFormInputsProps } from "./types";
import { Button } from "@viasegura/components/ui/button";
import { authLogin } from "@viasegura/services/auth";

export const LoginForm = () => {
  const router = useRouter();
  const schema = loginSchema();
  const form = useForm<loginFormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleFormLogin = async (data: loginFormInputsProps) => {
    try {
      const isSucess = await authLogin(data);
      if (isSucess) {
        toast.success("Seja bem-vindo!", {
          position: "bottom-right",
        });
        router.push("/heatmap");
      } else {
        toast.error("Usuário ainda não cadastrado", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(handleFormLogin)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="username" className="mt-5">
                E-mail
              </FormLabel>

              <FormControl
                className={fieldState.error && "focus-visible:ring-rose-600"}
              >
                <Input
                  id="username"
                  inputMode="email"
                  type="text"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoFocus
                  spellCheck={false}
                  className="bg-muted border-border"
                  required
                  {...field}
                />
              </FormControl>

              <FormMessage className="absolute text-red-500 bottom-[-18px] right-0 block text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem className="relative mb-2">
              <FormLabel htmlFor="password" className="text-foreground mt-5">
                Senha
              </FormLabel>

              <FormControl>
                <div
                  className={`bg-muted border-border flex h-10 w-full items-center 
                  justify-between gap-2 py-2 focus-within:outline-none focus-within:ring-2 
                  focus-within:ring-offset-2 rounded-md
                          ${
                            fieldState.error
                              ? `focus-within:ring-rose-600`
                              : `focus-within:ring-ring`
                          }
                        `}
                >
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="bg-muted pr-10 border-none shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    name={field.name}
                    onChange={(value) => value && field.onChange(value)}
                    ref={field.ref}
                    autoComplete="current-password"
                    spellCheck={false}
                    required
                  />

                  <span className="cursor-pointer leading-[0] pr-3">
                    <button
                      onClick={handleTogglePasswordVisibility}
                      type="button"
                      className="focus-visible:outline-primary cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-500" strokeWidth={1} />
                      ) : (
                        <Eye className="text-gray-500" strokeWidth={1} />
                      )}
                    </button>
                  </span>
                </div>
              </FormControl>

              <FormMessage className="absolute text-red-500 bottom-[-18px] right-0 block text-xs" />
            </FormItem>
          )}
        />
        <Button
          className="w-full h-10 cursor-pointer bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white my-6 rounded-[4px]"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Loader className="h-4 w-4" />
          ) : (
            "Entrar"
          )}
        </Button>
        <div className="mb-2 text-center text-sm">
          Não tem uma conta? {""}
          <Link href="/register" className="text-primary hover:underline">
            Clique aqui
          </Link>
        </div>
      </form>
    </Form>
  );
};
