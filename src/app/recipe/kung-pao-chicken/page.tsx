import { RecipeDetailScreen } from "@/components/recipe/RecipeDetailScreen";

type KungPaoChickenPageProps = {
  searchParams?: Promise<{
    from?: string;
  }>;
};

export default async function KungPaoChickenPage({
  searchParams,
}: KungPaoChickenPageProps) {
  const params = searchParams ? await searchParams : {};
  const backHref = params.from === "loading" ? "/" : "/flavor-map";

  return <RecipeDetailScreen backHref={backHref} />;
}
