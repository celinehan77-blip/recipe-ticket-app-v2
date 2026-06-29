import { FlavorMapScreen } from "@/components/flavor-map/FlavorMapScreen";
import { getAllStations } from "@/lib/data";
import { serializeStations } from "@/lib/data/serializers";

export default async function FlavorMapPage() {
  const stations = await getAllStations();

  return <FlavorMapScreen stations={serializeStations(stations)} />;
}
