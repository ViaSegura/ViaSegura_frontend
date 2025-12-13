import {
  heatmap,
  neighborhood,
  exportHeatmapData,
} from "@viasegura/services/heatmap";

import { getAuthenticatedFetch } from "@viasegura/services/server-fetch";
import {
  buildHeatmapQueryParams,
  buildExportQueryParams,
} from "@viasegura/utils/heatmap-params";
import {
  EMPTY_RESPONSE,
  HEATMAP_ENDPOINTS,
} from "@viasegura/constants/heatmap";

jest.mock("@viasegura/services/server-fetch", () => ({
  __esModule: true,
  getAuthenticatedFetch: jest.fn(),
}));

jest.mock("@viasegura/utils/heatmap-params", () => ({
  buildHeatmapQueryParams: jest.fn(),
  buildExportQueryParams: jest.fn(),
}));

describe("Heatmap Service", () => {
  const mockGetAuthenticatedFetch = getAuthenticatedFetch as jest.Mock;
  const mockBuildHeatmapParams = buildHeatmapQueryParams as jest.Mock;
  const mockBuildExportParams = buildExportQueryParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("heatmap function", () => {
    const mockSuccessResponse = {
      content: [{ some: "data" }],
      totalElements: 1,
    };

    test("should call getAuthenticatedFetch with correct URL (no params)", async () => {
      mockBuildHeatmapParams.mockReturnValue("");
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        data: mockSuccessResponse,
      });

      const result = await heatmap();

      expect(mockBuildHeatmapParams).toHaveBeenCalledWith(undefined);
      expect(mockGetAuthenticatedFetch).toHaveBeenCalledWith(
        HEATMAP_ENDPOINTS.GET
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    test("should call getAuthenticatedFetch with query params when provided", async () => {
      const params = { start_year: 2023 };
      mockBuildHeatmapParams.mockReturnValue("start_year=2023");
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        data: mockSuccessResponse,
      });

      await heatmap(params);

      expect(mockBuildHeatmapParams).toHaveBeenCalledWith(params);
      expect(mockGetAuthenticatedFetch).toHaveBeenCalledWith(
        `${HEATMAP_ENDPOINTS.GET}?start_year=2023`
      );
    });

    test("should return EMPTY_RESPONSE if getAuthenticatedFetch returns ok: false", async () => {
      mockBuildHeatmapParams.mockReturnValue("");
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: false,
        status: 500,
        data: null,
      });

      const result = await heatmap();

      expect(result).toEqual(EMPTY_RESPONSE);
    });

    test("should return EMPTY_RESPONSE if response.data is null", async () => {
      mockBuildHeatmapParams.mockReturnValue("");
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        data: null,
      });

      const result = await heatmap();

      expect(result).toEqual(EMPTY_RESPONSE);
    });
  });

  describe("neighborhood function", () => {
    test("should fetch neighborhoods list correctly", async () => {
      const mockNeighborhoods = ["Centro", "Boa Viagem"];
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        data: mockNeighborhoods,
      });

      const result = await neighborhood();

      expect(mockGetAuthenticatedFetch).toHaveBeenCalledWith(
        "h3_grid/neighborhoods"
      );
      expect(result).toEqual(mockNeighborhoods);
    });
  });

  describe("exportHeatmapData function", () => {
    test("should construct export URL with query params and return result", async () => {
      const mockExportParams = { neighborhood: "Centro" };
      const mockResponse = { base64: "xyz" };

      mockBuildExportParams.mockReturnValue("neighborhood=Centro");
      mockGetAuthenticatedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        data: mockResponse,
      });

      const result = await exportHeatmapData(mockExportParams);

      expect(mockBuildExportParams).toHaveBeenCalledWith(mockExportParams);
      expect(mockGetAuthenticatedFetch).toHaveBeenCalledWith(
        `${HEATMAP_ENDPOINTS.EXPORT}?neighborhood=Centro`
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
