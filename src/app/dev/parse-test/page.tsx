import { ParseRecipeTestScreen } from "@/components/dev/ParseRecipeTestScreen";
import { notFound } from "next/navigation";

export default function ParseRecipeTestPage() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_AI_DEV_TOOLS !== "true"
  ) {
    notFound();
  }

  return <ParseRecipeTestScreen />;
}
