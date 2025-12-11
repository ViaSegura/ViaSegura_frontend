import { fetchAPI } from ".";
import { loginFormInputsProps } from "@viasegura/modules/auth/components/login-form/types";
import { registerFormInputsProps } from "@viasegura/modules/auth/components/register-form/types";

export const authRegister = async ({
  username,
  email,
  password,
}: registerFormInputsProps) => {
  const registerRequest = {
    name: username,
    email,
    password,
  };

  const response = await fetchAPI({
    url: "users",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    },
  });

  return response.status === 201;
};

export const authLogin = async ({
  username,
  password,
}: loginFormInputsProps): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
