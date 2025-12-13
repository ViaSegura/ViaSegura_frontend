import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegisterForm } from "@viasegura/modules/auth/components/register-form/index";
import { authRegister } from "@viasegura/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

jest.mock("@viasegura/services/auth", () => ({
  authRegister: jest.fn(),
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

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("RegisterForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render form fields correctly", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByText("Já tem uma conta?")).toBeInTheDocument();
  });

  test("should show validation errors for empty fields", async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authRegister).not.toHaveBeenCalled();
    });
  });

  test("should toggle password visibility", () => {
    render(<RegisterForm />);

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

  test("should handle successful registration", async () => {
    (authRegister as jest.Mock).mockResolvedValue(true);

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authRegister).toHaveBeenCalledWith({
        username: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Usuário cadastrado com sucesso!",
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("should handle failed registration", async () => {
    (authRegister as jest.Mock).mockResolvedValue(false);

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authRegister).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível cadastrar esse usuário",
        expect.any(Object)
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
