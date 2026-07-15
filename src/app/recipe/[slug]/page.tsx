import { RecipeDetailScreen } from "@/components/recipe/RecipeDetailScreen";
import { getAllRecipes, getRecipeDetailBySlug } from "@/lib/data";
import { serializeRecipe, serializeRecipes } from "@/lib/data/serializers";
import { recipes as mockRecipes } from "@/lib/mockData";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    from?: string;
  }>;
};

export function generateStaticParams() {
  return mockRecipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export default async function RecipePage({
  params,
  searchParams,
}: RecipePageProps) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const backHref = search.from === "loading" ? "/" : "/flavor-map";
  const [recipe, recipes] = await Promise.all([
    getRecipeDetailBySlug(slug),
    getAllRecipes(),
  ]);

  return (
    <RecipeDetailScreen
      allRecipes={serializeRecipes(recipes)}
      backHref={backHref}
      recipe={recipe ? serializeRecipe(recipe) : null}
      recipeSlug={slug}
    />
  );
}
