import {
  getRecipeBySlug as getMockRecipeBySlug,
  getRecipeDetailBySlug as getMockRecipeDetailBySlug,
  recipes,
} from "@/lib/mockData";
import { getStationBySlug } from "@/lib/data/stations";
import type { Recipe } from "@/types";

export type RecipeCardData = Pick<
  Recipe,
  | "titleZh"
  | "titleEn"
  | "timeMinutes"
  | "difficulty"
  | "flavor"
  | "mainIngredient"
  | "description"
  | "tags"
  | "slug"
>;

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | null {
  return getMockRecipeBySlug(slug);
}

export function getRecipesByStationId(stationId: string): Recipe[] {
  return recipes.filter((recipe) => recipe.stationId === stationId);
}

export function getRecipesByStationSlug(stationSlug: string): Recipe[] {
  const station = getStationBySlug(stationSlug);

  if (!station) {
    return [];
  }

  return getRecipesByStationId(station.id);
}

export function getRecipeDetailBySlug(slug: string): Recipe | null {
  return getMockRecipeDetailBySlug(slug);
}

export function getRecipeCardData(slug: string): RecipeCardData | null {
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return null;
  }

  return {
    titleZh: recipe.titleZh,
    titleEn: recipe.titleEn,
    timeMinutes: recipe.timeMinutes,
    difficulty: recipe.difficulty,
    flavor: recipe.flavor,
    mainIngredient: recipe.mainIngredient,
    description: recipe.description,
    tags: recipe.tags,
    slug: recipe.slug,
  };
}
