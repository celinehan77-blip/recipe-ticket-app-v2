import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  completeMockGenerationTaskWithSlug,
  failMockGenerationTaskWithSlug,
  readLatestGeneratedRecipeSlug,
  readMockGenerationTask,
  saveMockGenerationTask,
} from "../../src/lib/mockGenerationTask";
import {
  getLocalGeneratedRecipeBySlug,
  mapParsedDraftToLocalRecipe,
  saveLocalGeneratedRecipe,
} from "../../src/lib/data/localGeneratedRecipe";
import type { ParsedRecipeDraft } from "../../src/types/ai";
import {
  isBackgroundGenerationRouteUnavailable,
  pickReusableRecipeSlug,
} from "../../src/lib/data/pendingRecipeGeneration";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const draft: ParsedRecipeDraft = {
  titleZh: "番茄炒蛋",
  titleEn: "Tomato Eggs",
  description: "家常快手菜",
  timeMinutes: 15,
  difficulty: "简单",
  flavor: "酸甜",
  mainIngredient: "番茄 · 鸡蛋",
  tags: ["家常菜"],
  ingredients: [
    { name: "番茄", amount: "2 个", group: "main", note: "切块" },
    { name: "盐", amount: "2 克", group: "seasoning", note: "" },
  ],
  seasonings: [
    { name: "白糖", amount: "3 克", group: "seasoning", note: "" },
  ],
  steps: [
    {
      title: "炒制",
      description: "鸡蛋和番茄炒匀",
      duration: "5 分钟",
      heat: "中火",
      tips: "",
    },
  ],
  confidence: 0.9,
  warnings: [],
};

beforeEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: new MemoryStorage() },
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

test("failed generation keeps a usable fallback slug and safe error code", () => {
  saveMockGenerationTask("番茄炒蛋", "manual");
  failMockGenerationTaskWithSlug("my-generated-recipe", "recipe_save_failed");

  const task = readMockGenerationTask();

  assert.equal(task?.status, "failed");
  assert.equal(task?.errorCode, "recipe_save_failed");
  assert.equal(task?.generatedRecipeSlug, "my-generated-recipe");
  assert.equal(readLatestGeneratedRecipeSlug(), "my-generated-recipe");
});

test("completed generation persists the exact generated slug", () => {
  saveMockGenerationTask("番茄炒蛋", "manual");
  completeMockGenerationTaskWithSlug("tomato-eggs-2");

  const task = readMockGenerationTask();

  assert.equal(task?.status, "completed");
  assert.equal(task?.generatedRecipeSlug, "tomato-eggs-2");
  assert.equal(readLatestGeneratedRecipeSlug(), "tomato-eggs-2");
});

test("starting a second generation replaces the previous active task", () => {
  saveMockGenerationTask("番茄炒蛋", "manual");
  completeMockGenerationTaskWithSlug("tomato-eggs-2");
  saveMockGenerationTask("青椒肉丝", "manual");

  const task = readMockGenerationTask();

  assert.equal(task?.status, "processing");
  assert.equal(task?.sourceUrl, "青椒肉丝");
  assert.equal(task?.generatedRecipeSlug, "kung-pao-chicken");
});

test("parsed draft becomes a complete local recipe", () => {
  const recipe = mapParsedDraftToLocalRecipe(draft);

  assert.equal(recipe.slug, "my-generated-recipe");
  assert.equal(recipe.titleZh, "番茄炒蛋");
  assert.ok(recipe.ingredients.some((item) => item.name === "番茄"));
  assert.ok(recipe.seasonings.some((item) => item.name === "盐"));
  assert.ok(recipe.seasonings.some((item) => item.name === "白糖"));
  assert.ok(recipe.steps.length >= 1);
});

test("each saved local recipe keeps a unique slug and its own draft", () => {
  const firstRecipe = saveLocalGeneratedRecipe(draft);
  const secondRecipe = saveLocalGeneratedRecipe({
    ...draft,
    titleZh: "青椒肉丝",
    titleEn: "Shredded Pork with Peppers",
  });

  assert.notEqual(firstRecipe.slug, secondRecipe.slug);
  assert.equal(
    getLocalGeneratedRecipeBySlug(firstRecipe.slug)?.titleZh,
    "番茄炒蛋",
  );
  assert.equal(
    getLocalGeneratedRecipeBySlug(secondRecipe.slug)?.titleZh,
    "青椒肉丝",
  );
});

test("Vercel can fall back when Netlify background routes are unavailable", () => {
  assert.equal(isBackgroundGenerationRouteUnavailable(404), true);
  assert.equal(isBackgroundGenerationRouteUnavailable(405), true);
  assert.equal(isBackgroundGenerationRouteUnavailable(500), false);
});

test("completed source generation prefers local cache then cloud cache", () => {
  assert.equal(pickReusableRecipeSlug("local-recipe", "cloud-recipe"), "local-recipe");
  assert.equal(pickReusableRecipeSlug(null, "cloud-recipe"), "cloud-recipe");
  assert.equal(pickReusableRecipeSlug(null, null), null);
});
