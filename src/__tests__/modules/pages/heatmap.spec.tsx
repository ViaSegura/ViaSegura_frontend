import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const HeatMap = jest.requireActual("@viasegura/app/heatmap/page").default;

import {
  heatmap,
  neighborhood,
  exportHeatmapData,
} from "@viasegura/services/heatmap";

global.atob = jest.fn((data) => data);
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = jest.fn();

jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("@viasegura/services/heatmap", () => ({
  heatmap: jest.fn(),
  neighborhood: jest.fn(),
  exportHeatmapData: jest.fn(),
}));

jest.mock("@viasegura/components/header", () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock("@viasegura/constants/heatmap", () => ({
  HeatmapMap: ({ data }: { data: any[] }) => (
    <div data-testid="heatmap-map">Points: {data.length}</div>
  ),
  EMPTY_RESPONSE: {},
}));

jest.mock("@viasegura/components/monthYearPicker", () => ({
  MonthYearPicker: ({ setDate, date }: any) => (
    <div data-testid="month-year-picker">
      <span data-testid="selected-date">
        {date ? new Date(date).toISOString().split("T")[0] : "No Date"}
      </span>
      <button onClick={() => setDate(new Date(2023, 5, 15))}>
        Select Date
      </button>
    </div>
  ),
}));

jest.mock("@viasegura/components/ui/select", () => ({
  Select: ({ onValueChange, children }: any) => (
    <div data-testid="mock-select-root">
      <select
        data-testid="native-select"
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="All">All</option>
        <option value="Centro">Centro</option>
        <option value="Boa Viagem">Boa Viagem</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: () => null,
}));

jest.mock("@viasegura/components/loader", () => ({
  PulseLoader: () => <div data-testid="pulse-loader-mock">Loading...</div>,
}));

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("HeatMap Page", () => {
  const mockHeatmapData = {
    content: [
      {
        coordinates: [
          { latitude: -8.05, longitude: -34.88, neighborhood: "Centro" },
        ],
      },
      {
        coordinates: [
          { latitude: -8.06, longitude: -34.89, neighborhood: "Centro" },
        ],
      },
      {
        coordinates: [
          { latitude: -8.1, longitude: -34.9, neighborhood: "Boa Viagem" },
        ],
      },
    ],
    totalElements: 3,
  };

  const mockNeighborhoods = ["Centro", "Boa Viagem"];

  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    (heatmap as jest.Mock).mockClear();
    (neighborhood as jest.Mock).mockClear();
    (exportHeatmapData as jest.Mock).mockClear();

    (heatmap as jest.Mock).mockResolvedValue(mockHeatmapData);
    (neighborhood as jest.Mock).mockResolvedValue(mockNeighborhoods);

    mockLink = document.createElement("a");
    jest.spyOn(mockLink, "click");
    jest.spyOn(mockLink, "setAttribute");

    const originalCreateElement = document.createElement.bind(document);
    jest
      .spyOn(document, "createElement")
      .mockImplementation(
        (tagName: string, options?: ElementCreationOptions) => {
          if (tagName === "a") {
            return mockLink;
          }
          return originalCreateElement(tagName, options);
        }
      );

    jest.spyOn(document.body, "appendChild");
    jest.spyOn(document.body, "removeChild");
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("should render initial layout and fetch initial data", async () => {
    render(<HeatMap />);

    expect(screen.getByText("Mapa de Calor de Sinistros")).toBeInTheDocument();

    const applyButton = await screen.findByRole("button", {
      name: "Aplicar Filtros",
    });

    await waitFor(() => {
      expect(neighborhood).toHaveBeenCalledTimes(1);
      expect(heatmap).toHaveBeenCalledTimes(1);
    });

    const totalIncidentsElement = await screen.findByText("3");
    expect(totalIncidentsElement).toBeInTheDocument();
    expect(screen.getByText("Total de Sinistros")).toBeInTheDocument();

    const topNeighborhoodElement = screen
      .getAllByText("Centro")
      .find((el) => el.className?.includes("truncate"));
    expect(topNeighborhoodElement).toBeInTheDocument();
    expect(screen.getByText("Bairros Afetados")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap-map")).toHaveTextContent("Points: 3");
  });

  test("should filter data by neighborhood", async () => {
    render(<HeatMap />);

    const applyButton = await screen.findByRole("button", {
      name: "Aplicar Filtros",
    });

    const select = screen.getByTestId("native-select");
    fireEvent.change(select, { target: { value: "Boa Viagem" } });

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(heatmap).toHaveBeenCalledTimes(2);
      expect(heatmap).toHaveBeenCalledWith({
        neighborhood: "Boa Viagem",
      });
    });
  });

  test("should filter data by date", async () => {
    render(<HeatMap />);

    const applyButton = await screen.findByRole("button", {
      name: "Aplicar Filtros",
    });

    const selectDateBtn = screen.getByText("Select Date");
    fireEvent.click(selectDateBtn);

    expect(screen.getByTestId("selected-date")).toHaveTextContent("2023-06-15");

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(heatmap).toHaveBeenCalledTimes(2);
      expect(heatmap).toHaveBeenCalledWith({ neighborhood: "" });
    });
  });

  test("should clear filters when 'Limpar Filtros' is clicked", async () => {
    render(<HeatMap />);

    await screen.findByRole("button", { name: "Aplicar Filtros" });

    const select = screen.getByTestId("native-select");
    fireEvent.change(select, { target: { value: "Centro" } });

    const selectDateBtn = screen.getByText("Select Date");
    fireEvent.click(selectDateBtn);

    const clearButton = screen.getByText("Limpar Filtros");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(heatmap).toHaveBeenCalledTimes(2);
      expect(heatmap).toHaveBeenCalledWith({ neighborhood: "" });
    });

    expect(screen.getByTestId("selected-date")).toHaveTextContent("No Date");
  });

  test("should handle export functionality correctly", async () => {
    render(<HeatMap />);

    (exportHeatmapData as jest.Mock).mockResolvedValue(
      "dGhpcyBpcyBhIGZha2UgYmFzZTY0IHN0cmluZw=="
    );

    const exportButton = screen.getByText("Exportar dados");
    fireEvent.click(exportButton);

    await screen.findByText("Gerando arquivo...");

    await waitFor(() => {
      expect(exportHeatmapData).toHaveBeenCalled();
      // O downloadBase64File foi executado
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        "download",
        "relatorio_sinistros_geral.xls"
      );
      expect(mockLink.click).toHaveBeenCalled();
    });

    expect(global.atob).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    await screen.findByText("Exportar dados");
  });

  test("should handle export with selected date filters", async () => {
    render(<HeatMap />);

    const selectDateBtn = screen.getByText("Select Date");
    fireEvent.click(selectDateBtn);

    await screen.findByRole("button", { name: "Aplicar Filtros" });

    (exportHeatmapData as jest.Mock).mockResolvedValue("another-fake-base64");

    const exportButton = screen.getByText("Exportar dados");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(exportHeatmapData).toHaveBeenCalledWith({
        neighborhood: "",
        start_year: 2023,
        start_month: 6,
        end_year: 2023,
        end_month: 6,
      });

      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        "download",
        "relatorio_sinistros_06-2023.xls"
      );
    });
  });

  test("should display empty state if no data is returned", async () => {
    (heatmap as jest.Mock).mockResolvedValue({ content: [], totalElements: 0 });

    render(<HeatMap />);

    await waitFor(() => expect(heatmap).toHaveBeenCalledTimes(1));

    expect(
      await screen.findByText("Nenhum sinistro encontrado nesta região")
    ).toBeInTheDocument();
    expect(screen.getByText("Total de Sinistros")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });

  test("should handle API fetch error and stop loading", async () => {
    (heatmap as jest.Mock).mockRejectedValue(new Error("API Down"));

    render(<HeatMap />);

    await waitFor(() => {
      expect(heatmap).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("button", { name: "Aplicar Filtros" })
      ).toBeEnabled();
    });

    expect(console.error).toHaveBeenCalledWith(
      "Error loading heatmap:",
      new Error("API Down")
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
