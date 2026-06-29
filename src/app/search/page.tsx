import { SearchScreen } from "@/components/search/SearchScreen";
import { getAllRecipes, getAllStations } from "@/lib/data";
import {
  serializeRecipes,
  serializeStations,
} from "@/lib/data/serializers";

export default async function SearchPage() {
  const [recipes, stations] = await Promise.all([
    getAllRecipes(),
    getAllStations(),
  ]);

  return (
    <SearchScreen
      recipes={serializeRecipes(recipes)}
      stations={serializeStations(stations)}
    />
  );
}
