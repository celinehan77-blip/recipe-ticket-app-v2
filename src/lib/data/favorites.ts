import {
  addFavoriteRecipe,
  getFavoriteRecipeSlugs,
  isFavoriteRecipe,
  removeFavoriteRecipe,
  toggleFavoriteRecipe,
} from "@/lib/localFavorites";
import { getCurrentUser } from "@/lib/auth/session";
import { getRecipeBySlug } from "@/lib/data/recipes";
import {
  tryAddFavoriteRecipeToSupabase,
  tryGetFavoriteRecipesFromSupabase,
  tryGetFavoriteSlugsFromSupabase,
  tryIsRecipeFavoriteInSupabase,
  tryRemoveFavoriteRecipeFromSupabase,
} from "@/lib/data/supabase/favorites";
import type { Recipe } from "@/types";

type FavoriteToggleResult = {
  favorite: boolean;
  message?: string;
  mode: "local" | "cloud" | "fallback";
  slugs: string[];
};

export function getLocalFavoriteSlugs(): string[] {
  return getFavoriteRecipeSlugs();
}

export async function getFavoriteSlugs(): Promise<string[]> {
  const user = await getCurrentUser();

  if (!user) {
    return getLocalFavoriteSlugs();
  }

  const favoriteSlugs = await tryGetFavoriteSlugsFromSupabase(user.id);

  if (!favoriteSlugs.ok) {
    return getLocalFavoriteSlugs();
  }

  return favoriteSlugs.data;
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  const user = await getCurrentUser();

  if (user) {
    const favoriteRecipes = await tryGetFavoriteRecipesFromSupabase(user.id);

    if (favoriteRecipes.ok) {
      return favoriteRecipes.data;
    }
  }

  const favoriteRecipes = await Promise.all(
    getLocalFavoriteSlugs().map((slug) => getRecipeBySlug(slug)),
  );

  return favoriteRecipes.filter((recipe): recipe is Recipe => Boolean(recipe));
}

export async function isRecipeFavorite(slug: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (user) {
    const favorite = await tryIsRecipeFavoriteInSupabase(user.id, slug);

    if (favorite.ok) {
      return favorite.data;
    }
  }

  return isFavoriteRecipe(slug);
}

export async function toggleRecipeFavorite(
  slug: string,
): Promise<FavoriteToggleResult> {
  const user = await getCurrentUser();

  if (!user) {
    const localResult = toggleFavoriteRecipe(slug);

    return {
      favorite: localResult.favorite,
      mode: "local",
      slugs: localResult.slugs,
    };
  }

  const cloudFavorite = await tryIsRecipeFavoriteInSupabase(user.id, slug);

  if (cloudFavorite.ok) {
    const cloudResult = cloudFavorite.data
      ? await tryRemoveFavoriteRecipeFromSupabase(user.id, slug)
      : await tryAddFavoriteRecipeToSupabase(user.id, slug);

    if (cloudResult.ok) {
      if (cloudFavorite.data) {
        removeFavoriteRecipe(slug);
      } else {
        addFavoriteRecipe(slug);
      }

      return {
        favorite: !cloudFavorite.data,
        mode: "cloud",
        slugs: await getFavoriteSlugs(),
      };
    }
  }

  const localResult = toggleFavoriteRecipe(slug);

  return {
    favorite: localResult.favorite,
    message: "云端收藏暂时不可用，已先保存在当前浏览器。",
    mode: "fallback",
    slugs: localResult.slugs,
  };
}

export async function syncLocalFavoritesToSupabase(): Promise<{
  failed: number;
  ok: boolean;
  skipped: boolean;
  synced: number;
  total: number;
}> {
  const user = await getCurrentUser();
  const localSlugs = getLocalFavoriteSlugs();

  if (!user) {
    return {
      failed: 0,
      ok: false,
      skipped: true,
      synced: 0,
      total: localSlugs.length,
    };
  }

  let synced = 0;
  let failed = 0;

  await Promise.all(
    localSlugs.map(async (slug) => {
      const result = await tryAddFavoriteRecipeToSupabase(user.id, slug);

      if (result.ok) {
        synced += 1;
      } else {
        failed += 1;
      }
    }),
  );

  return {
    failed,
    ok: failed === 0,
    skipped: false,
    synced,
    total: localSlugs.length,
  };
}
