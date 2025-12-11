"use client";

import { useState, useEffect, useCallback } from "react";

import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { MapContainer, TileLayer } from "react-leaflet";

type HeatmapDataPoint = [number, number, number];

interface HeatmapMapProps {
  data: HeatmapDataPoint[];
}

type HeatmapGradient = Record<number, string>;

const HeatmapMap: React.FC<HeatmapMapProps> = ({ data }) => {
  const [gradient, setGradient] = useState<HeatmapGradient | undefined>(
    undefined
  );

  const [mapRerenderKey, setMapRerenderKey] = useState(0);

  const updateGradient = useCallback(() => {
    const styles = getComputedStyle(document.documentElement);

    const stop1 = styles.getPropertyValue("--heatmap-stop1").trim();
    const stop2 = styles.getPropertyValue("--heatmap-stop2").trim();
    const stop3 = styles.getPropertyValue("--heatmap-stop3").trim();
    const stop4 = styles.getPropertyValue("--heatmap-stop4").trim();

    if (stop1 && stop2 && stop3 && stop4) {
      const newGradient: HeatmapGradient = {
        0.4: `hsl(${stop1})`,
        0.6: `hsl(${stop2})`,
        0.8: `hsl(${stop3})`,
        1.0: `hsl(${stop4})`,
      };
      setGradient(newGradient);
    } else setGradient(undefined);

    setMapRerenderKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    updateGradient();

    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateGradient();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [updateGradient]);

  return (
    <MapContainer
      center={[-8.05428, -34.8813]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILE_URL || ""} />

      <HeatmapLayer
        points={data}
        longitudeExtractor={(p: HeatmapDataPoint) => p[1]}
        latitudeExtractor={(p: HeatmapDataPoint) => p[0]}
        intensityExtractor={(p: HeatmapDataPoint) => p[2]}
        radius={25}
        blur={20}
        maxZoom={13}
        minOpacity={0.4}
        max={1}
        gradient={gradient}
        key={mapRerenderKey}
      />
    </MapContainer>
  );
};

export default HeatmapMap;
