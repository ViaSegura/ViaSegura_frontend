"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import { Button } from "@viasegura/components/ui/button";
import { Checkbox } from "@viasegura/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@viasegura/components/ui/form";
import { Input } from "@viasegura/components/ui/input";
import { Label } from "@viasegura/components/ui/label";

import { Loader } from "@viasegura/components/loader";
import { authRegister } from "@viasegura/services/auth";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "./schemas";
import { registerFormInputsProps } from "./types";
import { toast } from "sonner";

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const schema = registerSchema();
  const form = useForm<registerFormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data: registerFormInputsProps) => {
    const success = await authRegister(data);

    if (success) {
      toast.success("Usuário cadastrado com sucesso!", {
        position: "bottom-right",
      });
      return router.push("/login");
    } else {
      toast.error("Não foi possível cadastrar esse usuário", {
        position: "bottom-right",
      });
    }
  };
  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="username">Nome</FormLabel>
              <FormControl
                className={fieldState.error && "focus-visible:ring-rose-600"}
              >
                <Input
                  id="username"
                  type="text"
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
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="email" className="mt-5">
                E-mail
              </FormLabel>
              <FormControl
                className={fieldState.error && "focus-visible:ring-rose-600"}
              >
                <Input
                  id="email"
                  inputMode="email"
                  type="text"
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
                    type={showPassword ? "text" : "password"}
                    className="bg-muted pr-10 border-none shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    name={field.name}
                    onChange={(value) => value && field.onChange(value)}
                    ref={field.ref}
                    autoComplete="current-password"
                    spellCheck={false}
                    required
                  />
                  <span className="cursor-pointer leading-[0]">
                    <button
                      onClick={handleTogglePasswordVisibility}
                      type="button"
                      className="focus-visible:outline-primary cursor-pointer pr-3"
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

        <div className="flex items-center space-x-2 my-6">
          <Checkbox id="terms" />
          <Label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aceito os{" "}
            <Link href="#" className="text-primary hover:underline">
              termos de uso
            </Link>{" "}
            e{" "}
            <Link href="#" className="text-primary hover:underline">
              política de privacidade
            </Link>
          </Label>
        </div>

        <Button
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 mb-6 "
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Loader className="h-4 w-4" />
          ) : (
            "Entrar"
          )}
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entre aqui
            </Link>
          </span>
        </div>
      </form>
    </Form>
  );
};
