import { fetchAPI } from ".";
import { setCookieLogin } from "@viasegura/utils/auth";
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
  const loginRequest = {
    username,
    password,
  };

  const response = await fetchAPI({
    url: "auth/login",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    },
  });

  if (response.status === 200) {
    await setCookieLogin({ response });

    return true;
  }
  return false;
};
