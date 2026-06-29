import { stations } from "@/lib/mockData";
import {
  getAllStationsFromSupabase,
  getStationBySlugFromSupabase,
} from "@/lib/data/supabase/stations";
import { mapSupabaseStationToStation } from "@/lib/data/supabase/mappers";
import type { Station } from "@/types";

const stationDisplayNames: Record<string, string> = {
  chicken: "Chicken Station",
  pasture: "Pasture Station",
  seafood: "Seafood Harbor",
};

function getMockStationBySlug(slug: string): Station | null {
  return stations.find((station) => station.slug === slug) ?? null;
}

function sortStationsByMockOrder(nextStations: Station[]): Station[] {
  return [...nextStations].sort((left, right) => {
    const leftIndex = stations.findIndex((station) => station.slug === left.slug);
    const rightIndex = stations.findIndex((station) => station.slug === right.slug);

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });
}

export async function getAllStations(): Promise<Station[]> {
  try {
    const supabaseStations = (await getAllStationsFromSupabase())
      .map(mapSupabaseStationToStation)
      .filter((station): station is Station => Boolean(station));

    if (supabaseStations.length > 0) {
      return sortStationsByMockOrder(supabaseStations);
    }
  } catch {
    return stations;
  }

  return stations;
}

export async function getStationBySlug(slug: string): Promise<Station | null> {
  try {
    const supabaseStation = await getStationBySlugFromSupabase(slug);
    const station = supabaseStation
      ? mapSupabaseStationToStation(supabaseStation)
      : null;

    if (station) {
      return station;
    }
  } catch {
    return getMockStationBySlug(slug);
  }

  return getMockStationBySlug(slug);
}

export async function getStationById(id: string): Promise<Station | null> {
  const allStations = await getAllStations();

  return allStations.find((station) => station.id === id) ?? null;
}

export async function getStationDisplayName(slug: string): Promise<string> {
  return stationDisplayNames[slug] ?? (await getStationBySlug(slug))?.nameEn ?? "Station";
}
