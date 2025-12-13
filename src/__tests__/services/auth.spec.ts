import { fetchAPI } from "@viasegura/services/index";
import { authRegister, authLogin } from "@viasegura/services/auth";
import { setCookieLogin } from "@viasegura/utils/auth";

jest.mock("@viasegura/services");
jest.mock("@viasegura/utils/auth");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authRegister", () => {
  it("should return true when status is 201", async () => {
    (fetchAPI as jest.Mock).mockResolvedValue({ status: 201 });

    const result = await authRegister({
      username: "John",
      email: "john@example.com",
      password: "123456",
    });

    expect(result).toBe(true);
  });

  it("should return false when status is not 201", async () => {
    (fetchAPI as jest.Mock).mockResolvedValue({ status: 400 });

    const result = await authRegister({
      username: "Jane",
      email: "jane@example.com",
      password: "654321",
    });

    expect(result).toBe(false);
  });
});

describe("authLogin", () => {
  it("should call setCookieLogin and return true when status is 200", async () => {
    (fetchAPI as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: "fakeAccessToken",
        refreshToken: "fakeRefreshToken",
        username: "John",
      }),
    });

    const result = await authLogin({
      username: "John",
      password: "123456",
    });

    expect(fetchAPI).toHaveBeenCalled();
    expect(setCookieLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        response: expect.any(Object),
      })
    );
    expect(result).toBe(true);
  });

  it("should return false and not call setCookieLogin when status is not 200", async () => {
    (fetchAPI as jest.Mock).mockResolvedValue({
      status: 401,
      json: jest.fn(), // ainda precisa existir pra evitar erro
    });

    const result = await authLogin({
      username: "John",
      password: "wrongpass",
    });

    expect(setCookieLogin).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
