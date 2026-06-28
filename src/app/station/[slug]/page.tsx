import { ChickenStationScreen } from "@/components/station/ChickenStationScreen";
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

  return <ChickenStationScreen stationSlug={slug} />;
}
