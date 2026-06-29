import {
  getFavoriteRecipeSlugs,
  isFavoriteRecipe,
  toggleFavoriteRecipe,
} from "@/lib/localFavorites";
import { getRecipeBySlug } from "@/lib/data/recipes";
import type { Recipe } from "@/types";

export function getFavoriteSlugs(): string[] {
  return getFavoriteRecipeSlugs();
}

export function getFavoriteRecipes(): Recipe[] {
  return getFavoriteSlugs()
    .map((slug) => getRecipeBySlug(slug))
    .filter((recipe): recipe is Recipe => Boolean(recipe));
}

export function isRecipeFavorite(slug: string): boolean {
  return isFavoriteRecipe(slug);
}

export function toggleRecipeFavorite(slug: string): {
  favorite: boolean;
  slugs: string[];
} {
  return toggleFavoriteRecipe(slug);
}
