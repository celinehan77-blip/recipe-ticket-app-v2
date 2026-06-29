import { ChickenStationScreen } from "@/components/station/ChickenStationScreen";
import { getAllStations } from "@/lib/data";

type StationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllStations().map((station) => ({
    slug: station.slug,
  }));
}

export default async function StationPage({ params }: StationPageProps) {
  const { slug } = await params;

  return <ChickenStationScreen stationSlug={slug} />;
}
