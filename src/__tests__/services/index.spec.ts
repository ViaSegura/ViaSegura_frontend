import { fetchAPI } from "@viasegura/services/index";

const EXPECTED_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

global.fetch = jest.fn();

describe("fetchAPI Utility", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("should call fetch with the correctly concatenated base URL", async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "meu-endpoint";
    const options = { method: "GET" };
    const expectedUrl = `${EXPECTED_BASE_URL}/${url}`;

    await fetchAPI({ url, options });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, options);
  });

  test("should return the response from fetch directly", async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await fetchAPI({ url: "any", options: {} });

    expect(response).toBe(mockResponse);
  });

  test("should pass options correctly to fetch", async () => {
    const mockResponse = { ok: true, status: 201 } as Response;
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "data";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    };
    const expectedUrl = `${EXPECTED_BASE_URL}/${url}`;

    await fetchAPI({ url, options });

    expect(fetch).toHaveBeenCalledWith(expectedUrl, options);
  });

  test("should propagate (re-throw) the error if fetch fails", async () => {
    const mockError = new Error("Network failed");
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const url = "error-endpoint";
    const options = { method: "GET" };

    await expect(fetchAPI({ url, options })).rejects.toThrow("Network failed");
  });
});
