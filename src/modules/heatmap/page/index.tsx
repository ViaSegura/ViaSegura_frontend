"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Filter,
  MapPin,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";

import { Header } from "@viasegura/components/header";
import { Button } from "@viasegura/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";
import { MonthYearPicker } from "@viasegura/components/monthYearPicker";
import { PulseLoader } from "@viasegura/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@viasegura/components/ui/select";

import { HeatmapMap } from "@viasegura/constants/heatmap";
import {
  heatmap,
  neighborhood,
  exportHeatmapData,
} from "@viasegura/services/heatmap";
import {
  HeatmapParams,
  HeatmapResponse,
  ExportHeatmapParams,
} from "@viasegura/types/heatmap";

const HeatMap = () => {
  const [apiData, setApiData] = useState<HeatmapResponse | null>(null);
  const [neighborhoodsList, setNeighborhoodsList] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const totalIncidents = apiData?.totalElements || 0;

  const [filters, setFilters] = useState({
    neighborhood: "",
    period: "",
    search: "",
  });

  const handleClearFilters = () => {
    setFilters({
      neighborhood: "",
      period: "",
      search: "",
    });

    setDate(undefined);
    fetchHeatmapData("", null);
  };

  const fetchHeatmapData = useCallback(
    async (forceNeighborhood?: string, forceDate?: Date | null) => {
      setIsLoading(true);

      try {
        const neighborhoodValue =
          typeof forceNeighborhood === "string"
            ? forceNeighborhood
            : filters.neighborhood;

        const dateValue = forceDate === null ? undefined : forceDate || date;

        const requestParams: HeatmapParams = {
          neighborhood: neighborhoodValue,
        };

        if (dateValue) {
          const year = dateValue.getFullYear();
          const month = dateValue.getMonth() + 1;

          requestParams.start_year = year;
          requestParams.start_month = month;
          requestParams.end_year = year;
          requestParams.end_month = month;
        }

        const response = await heatmap(requestParams);

        setApiData(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading heatmap:", error);
        setIsLoading(false);
      }
    },
    [filters, date]
  );

  const fetchNeighborhoodsList = useCallback(async () => {
    try {
      const data = await neighborhood();

      if (Array.isArray(data)) {
        setNeighborhoodsList(["All", ...data]);
      }
    } catch (error) {
      console.error("Error loading neighborhoods list:", error);
    }
  }, []);

  const downloadBase64File = (base64Data: any, fileName: string) => {
    try {
      if (typeof base64Data !== "string") {
        console.error(
          "Download failed: Data provided is not a string.",
          base64Data
        );
        return;
      }

      const cleanBase64 = base64Data.replace(/^data:.*,/, "");

      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error processing file download:", error);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const params: ExportHeatmapParams = {
        neighborhood: filters.neighborhood,
      };

      if (date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        params.start_year = year;
        params.start_month = month;
        params.end_year = year;
        params.end_month = month;
      }

      const response = await exportHeatmapData(params);

      let base64String = "";

      if (typeof response === "string") {
        base64String = response;
      } else if (response && typeof response === "object") {
        base64String =
          response.data ||
          response.base64 ||
          response.content ||
          response.file ||
          "";

        if (!base64String) {
          console.log(
            "API response structure unknown, attempting fallback extraction:",
            response
          );
          const firstString = Object.values(response).find(
            (v) => typeof v === "string"
          );
          if (firstString) base64String = firstString as string;
        }
      }

      if (base64String) {
        let fileName = "relatorio_sinistros_geral.xls";

        if (date) {
          const formattedDate = date
            .toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })
            .replace("/", "-");
          fileName = `relatorio_sinistros_${formattedDate}.xls`;
        }

        downloadBase64File(base64String, fileName);
      } else {
        console.error("Failed to find Base64 string in API response.");
      }

      setIsExporting(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      setIsExporting(false);
    }
  };

  const heatmapData = useMemo(() => {
    if (!apiData?.content) return [];

    return apiData.content
      .map((item) => {
        const coord = item.coordinates?.[0];
        if (!coord) return null;

        const lat = Number(coord.latitude);
        const lng = Number(coord.longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        return [lat, lng, 1] as [number, number, number];
      })
      .filter((item): item is [number, number, number] => item !== null);
  }, [apiData]);

  const topNeighborhood = useMemo(() => {
    if (
      !apiData?.content ||
      !Array.isArray(apiData.content) ||
      apiData.content.length === 0
    ) {
      return "-";
    }

    const counts: Record<string, number> = {};
    let maxCount = 0;
    let topName = "-";

    apiData.content.forEach((item) => {
      const coord = item.coordinates?.[0];
      const name = coord?.neighborhood;

      if (name && typeof name === "string") {
        counts[name] = (counts[name] || 0) + 1;
        if (counts[name] > maxCount) {
          maxCount = counts[name];
          topName = name;
        }
      }
    });

    return String(topName || "-")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [apiData]);

  const affectedRegionsCount = useMemo(() => {
    if (!apiData?.content) return 0;

    const neighborhoods = apiData.content
      .map((i) => i.coordinates?.[0]?.neighborhood)
      .filter((n): n is string => !!n);

    return new Set(neighborhoods).size;
  }, [apiData]);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  useEffect(() => {
    fetchNeighborhoodsList();
  }, [fetchNeighborhoodsList]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Mapa de Calor de Sinistros
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize e analise a distribuição de sinistros por região com
              filtros avançados
            </p>
          </div>

          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Select
                  value={filters.neighborhood}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, neighborhood: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoodsList.map((neighborhoodName) => (
                      <SelectItem
                        key={neighborhoodName}
                        value={neighborhoodName}
                        className="cursor-pointer"
                      >
                        {neighborhoodName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <MonthYearPicker
                  date={date}
                  setDate={setDate}
                  className="w-full h-10"
                />

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpar Filtros
                  </Button>
                  <Button
                    className="bg-gradient-primary"
                    onClick={() => fetchHeatmapData()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin cursor-pointer" />
                        Loading
                      </>
                    ) : (
                      "Aplicar Filtros"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mapa de Calor Regional
                  </CardTitle>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 transition-all hover:bg-muted"
                    onClick={() => fetchHeatmapData()}
                    disabled={isLoading}
                    title="Recarregar dados"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isLoading
                          ? "animate-spin text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="h-[500px] w-full rounded-lg overflow-hidden relative border bg-muted/10 group">
                    {isLoading && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
                        <PulseLoader />

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-foreground tracking-tight">
                            Atualizando mapa de calor
                          </span>
                          <span className="text-xs text-muted-foreground animate-pulse">
                            Sincronizando dados geográficos...
                          </span>
                        </div>
                      </div>
                    )}

                    {!isLoading && <HeatmapMap data={heatmapData} />}

                    {!isLoading && heatmapData.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-background/90 backdrop-blur px-6 py-4 rounded-full shadow-lg border border-border flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm font-medium">
                            Nenhum sinistro encontrado nesta região
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resumo Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {isLoading ? "-" : totalIncidents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de Sinistros
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
                      <div className="text-xl font-semibold text-foreground">
                        {isLoading ? "-" : affectedRegionsCount}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Bairros Afetados
                      </div>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border border-destructive/10">
                      <div className="text-xl font-semibold text-foreground truncate px-1">
                        {isLoading ? "-" : topNeighborhood}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Maior Incidência
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-2"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {isExporting ? "Gerando arquivo..." : "Exportar dados"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeatMap;
