import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginForm } from "@viasegura/modules/auth/components/login-form/index";
import { authLogin } from "@viasegura/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

jest.mock("@viasegura/services/auth", () => ({
  authLogin: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("lucide-react", () => ({
  Eye: () => <span data-testid="icon-eye" />,
  EyeOff: () => <span data-testid="icon-eye-off" />,
  Loader2: () => <span data-testid="icon-loader" />,
}));

describe("LoginForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render form fields correctly", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByText("Não tem uma conta?")).toBeInTheDocument();
  });

  test("should show validation errors for empty fields", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authLogin).not.toHaveBeenCalled();
    });
  });

  test("should toggle password visibility", () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("Senha");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(screen.getByTestId("icon-eye")).toBeInTheDocument();

    const toggleButton = screen.getByTestId("icon-eye").closest("button");
    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByTestId("icon-eye-off")).toBeInTheDocument();
  });

  test("should handle successful login", async () => {
    (authLogin as jest.Mock).mockResolvedValue(true);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authLogin).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Seja bem-vindo!",
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith("/heatmap");
    });
  });

  test("should handle failed login", async () => {
    (authLogin as jest.Mock).mockResolvedValue(false);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "wrongpass" },
    });

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authLogin).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Usuário ainda não cadastrado",
        expect.any(Object)
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
