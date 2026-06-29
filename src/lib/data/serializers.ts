import type {
  Recipe,
  SerializableRecipe,
  SerializableStation,
  Station,
} from "@/types";

export function serializeStation(station: Station): SerializableStation {
  return {
    id: station.id,
    slug: station.slug,
    nameZh: station.nameZh,
    nameEn: station.nameEn,
    description: station.description,
    recipeCount: station.recipeCount,
    averageTime: station.averageTime,
    difficulty: station.difficulty,
    categoryType: station.categoryType,
    accentColor: station.accentColor,
    route: station.route,
  };
}

export function serializeStations(stations: Station[]): SerializableStation[] {
  return stations.map(serializeStation);
}

export function serializeRecipe(recipe: Recipe): SerializableRecipe {
  return {
    ...recipe,
    steps: recipe.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      duration: step.duration,
      tips: step.tips,
    })),
  };
}

export function serializeRecipes(recipes: Recipe[]): SerializableRecipe[] {
  return recipes.map(serializeRecipe);
}
