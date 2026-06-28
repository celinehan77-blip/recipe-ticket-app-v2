import { recipes, stations } from "@/lib/mockData";
import type { Recipe } from "@/types";

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function getStationSearchText(recipe: Recipe) {
  const station = stations.find((item) => item.id === recipe.stationId);

  if (!station) {
    return "";
  }

  return [station.nameZh, station.nameEn].join(" ");
}

export function searchRecipes(query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  return recipes.filter((recipe) => {
    const searchText = [
      recipe.titleZh,
      recipe.titleEn,
      recipe.mainIngredient,
      recipe.flavor,
      recipe.description,
      `${recipe.timeMinutes} 分钟`,
      recipe.tags.join(" "),
      getStationSearchText(recipe),
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(normalizedQuery);
  });
}
