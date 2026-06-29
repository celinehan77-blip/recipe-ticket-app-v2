import { stations } from "@/lib/mockData";
import type { Station } from "@/types";

const stationDisplayNames: Record<string, string> = {
  chicken: "Chicken Station",
  pasture: "Pasture Station",
  seafood: "Seafood Harbor",
};

export function getAllStations(): Station[] {
  return stations;
}

export function getStationBySlug(slug: string): Station | null {
  return stations.find((station) => station.slug === slug) ?? null;
}

export function getStationById(id: string): Station | null {
  return stations.find((station) => station.id === id) ?? null;
}

export function getStationDisplayName(slug: string): string {
  return stationDisplayNames[slug] ?? getStationBySlug(slug)?.nameEn ?? "Station";
}
