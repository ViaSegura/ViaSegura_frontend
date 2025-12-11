import { setCookieLogin, clearToken } from "@viasegura/utils/auth";
import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";

// Mock Next.js server-side cookies
const mockSet = jest.fn();
const mockDelete = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    set: mockSet,
    delete: mockDelete,
  })),
}));

describe("Auth Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setCookieLogin", () => {
    test("should set cookies correctly from response", async () => {
      const mockData = {
        accessToken: "access-123",
        refreshToken: "refresh-123",
        username: "user-123",
      };

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;

      await setCookieLogin({ response: mockResponse });

      expect(mockSet).toHaveBeenCalledTimes(3);
      expect(mockSet).toHaveBeenCalledWith(
        COOKIE_TOKEN,
        mockData.accessToken,
        expect.objectContaining({
          path: "/",
          maxAge: 60 * 60,
          sameSite: "lax",
        })
      );
      expect(mockSet).toHaveBeenCalledWith(
        COOKIE_REFRESH_TOKEN,
        mockData.refreshToken,
        expect.objectContaining({
          path: "/",
          maxAge: 60 * 60,
          sameSite: "strict",
        })
      );
      expect(mockSet).toHaveBeenCalledWith(
        COOKIE_LOGIN,
        mockData.username,
        expect.objectContaining({
          path: "/",
          maxAge: 60 * 60,
          sameSite: "lax",
        })
      );
    });
  });

  describe("clearToken", () => {
    test("should delete all auth cookies", async () => {
      await clearToken();

      expect(mockDelete).toHaveBeenCalledTimes(3);
      expect(mockDelete).toHaveBeenCalledWith(COOKIE_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(COOKIE_REFRESH_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(COOKIE_LOGIN);
    });
  });
});
