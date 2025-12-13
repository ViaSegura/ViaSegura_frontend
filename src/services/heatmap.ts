import { getAuthenticatedFetch } from "./server-fetch";

import {
  ExportHeatmapParams,
  HeatmapParams,
  HeatmapResponse,
} from "@viasegura/types/heatmap";
import {
  EMPTY_RESPONSE,
  HEATMAP_ENDPOINTS,
} from "@viasegura/constants/heatmap";
import {
  buildExportQueryParams,
  buildHeatmapQueryParams,
} from "@viasegura/utils/heatmap-params";

export const heatmap = async (
  params?: HeatmapParams
): Promise<HeatmapResponse> => {
  const queryString = buildHeatmapQueryParams(params);
  const url = queryString
    ? `${HEATMAP_ENDPOINTS.GET}?${queryString}`
    : HEATMAP_ENDPOINTS.GET;

  const response = await getAuthenticatedFetch(url);

  if (!response.ok) return EMPTY_RESPONSE as HeatmapResponse;

  return response.data || EMPTY_RESPONSE;
};

export const neighborhood = async () => {
  const response = await getAuthenticatedFetch(`h3_grid/neighborhoods`);

  return response.data;
};

export const exportHeatmapData = async (params?: ExportHeatmapParams) => {
  const queryString = buildExportQueryParams(params);
  const url = `${HEATMAP_ENDPOINTS.EXPORT}?${queryString}`;

  const response = await getAuthenticatedFetch(url);

  return response.data;
};
