import { RecipeDetailScreen } from "@/components/recipe/RecipeDetailScreen";
import { recipes } from "@/lib/mockData";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    from?: string;
  }>;
};

export function generateStaticParams() {
  return recipes.map((recipe) => ({
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

  return <RecipeDetailScreen backHref={backHref} recipeSlug={slug} />;
}
