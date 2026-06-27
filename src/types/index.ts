import type { LucideIcon } from "lucide-react";

export type TabKey = "home" | "favorites" | "flavor-map" | "plan" | "profile";

export type TabItem = {
  key: TabKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RecentRecipe = {
  title: string;
  subtitle: string;
};

export type LoadingStep = {
  label: string;
  active: boolean;
};

export type Station = {
  id: string;
  stationNo: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  recipes: number;
  averageTime: string;
  difficulty: string;
  tone: "sage" | "caramel" | "blue";
};

export type RecipeStat = {
  label: string;
  value: string;
  suffix?: string;
};

export type IngredientItem = {
  name: string;
  amount: string;
};

export type IngredientGroup = {
  id: "main" | "side" | "seasoning";
  title: string;
  items: IngredientItem[];
};

export type CookingStep = {
  id: string;
  title: string;
  description: string;
  minutes: string;
};

export type RecipeDetail = {
  no: string;
  title: string;
  englishTitle: string;
  description: string;
  tag: string;
  servings: string;
  stats: RecipeStat[];
  ingredientGroups: IngredientGroup[];
  steps: CookingStep[];
};

export type StationRecipe = {
  id: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  minutes: string;
  difficulty: string;
  flavor: string;
  tags: string[];
  ingredients: string[];
};
