import { ChickenStationScreen } from "@/components/station/ChickenStationScreen";
import {
  getRecipesByStationSlug,
  getStationBySlug,
} from "@/lib/data";
import {
  serializeRecipes,
  serializeStation,
} from "@/lib/data/serializers";
import { stations } from "@/lib/mockData";

type StationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return stations.map((station) => ({
    slug: station.slug,
  }));
}

export default async function StationPage({ params }: StationPageProps) {
  const { slug } = await params;
  const [station, recipes] = await Promise.all([
    getStationBySlug(slug),
    getRecipesByStationSlug(slug),
  ]);

  return (
    <ChickenStationScreen
      station={station ? serializeStation(station) : null}
      recipes={serializeRecipes(recipes)}
    />
  );
}
