import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";

const mockCookieStore = {
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
}));

import { setCookieLogin, clearToken } from "@viasegura/utils/auth";

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

      expect(mockCookieStore.set).toHaveBeenCalledTimes(3);
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        COOKIE_TOKEN,
        mockData.accessToken,
        expect.objectContaining({ httpOnly: true })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        COOKIE_REFRESH_TOKEN,
        mockData.refreshToken,
        expect.objectContaining({ httpOnly: true })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        COOKIE_LOGIN,
        mockData.username,
        expect.objectContaining({ httpOnly: false })
      );
    });
  });

  describe("clearToken", () => {
    test("should delete all auth cookies", async () => {
      await clearToken();

      expect(mockCookieStore.delete).toHaveBeenCalledTimes(3);
      expect(mockCookieStore.delete).toHaveBeenCalledWith(COOKIE_TOKEN);
      expect(mockCookieStore.delete).toHaveBeenCalledWith(COOKIE_REFRESH_TOKEN);
      expect(mockCookieStore.delete).toHaveBeenCalledWith(COOKIE_LOGIN);
    });
  });
});
