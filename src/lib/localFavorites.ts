const FAVORITE_RECIPE_SLUGS_KEY = "recipe-ticket:favorite-recipe-slugs";

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function normalizeFavoriteSlugs(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (slug): slug is string => typeof slug === "string" && slug.trim().length > 0,
  );
}

export function getFavoriteRecipeSlugs() {
  if (!canUseLocalStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(FAVORITE_RECIPE_SLUGS_KEY);
    if (!rawValue) return [];

    return normalizeFavoriteSlugs(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

function saveFavoriteRecipeSlugs(slugs: string[]) {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(
      FAVORITE_RECIPE_SLUGS_KEY,
      JSON.stringify(Array.from(new Set(slugs))),
    );
  } catch {
    return;
  }
}

export function addFavoriteRecipe(slug: string) {
  const favoriteSlugs = getFavoriteRecipeSlugs();
  const nextFavoriteSlugs = Array.from(new Set([...favoriteSlugs, slug]));

  saveFavoriteRecipeSlugs(nextFavoriteSlugs);
  return nextFavoriteSlugs;
}

export function removeFavoriteRecipe(slug: string) {
  const nextFavoriteSlugs = getFavoriteRecipeSlugs().filter(
    (favoriteSlug) => favoriteSlug !== slug,
  );

  saveFavoriteRecipeSlugs(nextFavoriteSlugs);
  return nextFavoriteSlugs;
}

export function replaceFavoriteRecipeSlug(
  previousSlug: string,
  nextSlug: string,
) {
  const favoriteSlugs = getFavoriteRecipeSlugs();

  if (!favoriteSlugs.includes(previousSlug)) {
    return favoriteSlugs;
  }

  const nextFavoriteSlugs = favoriteSlugs.map((slug) =>
    slug === previousSlug ? nextSlug : slug,
  );

  saveFavoriteRecipeSlugs(nextFavoriteSlugs);
  return Array.from(new Set(nextFavoriteSlugs));
}

export function clearFavoriteRecipes() {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.removeItem(FAVORITE_RECIPE_SLUGS_KEY);
  } catch {
    return;
  }
}

export function isFavoriteRecipe(slug: string) {
  return getFavoriteRecipeSlugs().includes(slug);
}

export function toggleFavoriteRecipe(slug: string) {
  if (isFavoriteRecipe(slug)) {
    return {
      favorite: false,
      slugs: removeFavoriteRecipe(slug),
    };
  }

  return {
    favorite: true,
    slugs: addFavoriteRecipe(slug),
  };
}
