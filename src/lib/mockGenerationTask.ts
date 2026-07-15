export type MockGenerationTaskStatus = "processing" | "completed" | "failed";

export type MockGenerationTask = {
  completedAt?: string | null;
  errorCode?: string | null;
  sourceUrl: string;
  generatedRecipeSlug: string;
  status: MockGenerationTaskStatus;
  sourcePlatform: string;
  createdAt: string;
};

const MOCK_GENERATION_TASK_KEY = "recipe-ticket:mock-generation-task";
const LATEST_GENERATED_RECIPE_SLUG_KEY =
  "recipe-ticket:latest-generated-recipe-slug";
const DEFAULT_GENERATED_RECIPE_SLUG = "kung-pao-chicken";

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function saveLatestGeneratedRecipeSlug(slug: string): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(LATEST_GENERATED_RECIPE_SLUG_KEY, slug);
    return true;
  } catch {
    return false;
  }
}

export function readLatestGeneratedRecipeSlug() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(LATEST_GENERATED_RECIPE_SLUG_KEY);
  } catch {
    return null;
  }
}

export function saveMockGenerationTask(
  sourceUrl: string,
  sourcePlatform = "mock",
) {
  const task: MockGenerationTask = {
    sourceUrl,
    generatedRecipeSlug: DEFAULT_GENERATED_RECIPE_SLUG,
    status: "processing",
    sourcePlatform,
    createdAt: new Date().toISOString(),
  };

  if (!canUseLocalStorage()) {
    return task;
  }

  try {
    window.localStorage.setItem(
      MOCK_GENERATION_TASK_KEY,
      JSON.stringify(task),
    );
  } catch {
    return task;
  }

  return task;
}

export function readMockGenerationTask() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawTask = window.localStorage.getItem(MOCK_GENERATION_TASK_KEY);

    if (!rawTask) {
      return null;
    }

    return JSON.parse(rawTask) as MockGenerationTask;
  } catch {
    return null;
  }
}

export function completeMockGenerationTask() {
  const task = readMockGenerationTask();

  if (!task || !canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      MOCK_GENERATION_TASK_KEY,
      JSON.stringify({
        ...task,
        completedAt: new Date().toISOString(),
        errorCode: null,
        status: "completed",
      }),
    );
  } catch {
    return;
  }
}

export function completeMockGenerationTaskWithSlug(generatedRecipeSlug: string) {
  const task = readMockGenerationTask();
  const safeSlug = generatedRecipeSlug || DEFAULT_GENERATED_RECIPE_SLUG;

  saveLatestGeneratedRecipeSlug(safeSlug);

  if (!task || !canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      MOCK_GENERATION_TASK_KEY,
      JSON.stringify({
        ...task,
        completedAt: new Date().toISOString(),
        errorCode: null,
        generatedRecipeSlug: safeSlug,
        status: "completed",
      }),
    );
  } catch {
    return;
  }
}

export function failMockGenerationTaskWithSlug(
  generatedRecipeSlug: string,
  errorCode: string,
) {
  const task = readMockGenerationTask();
  const safeSlug = generatedRecipeSlug || DEFAULT_GENERATED_RECIPE_SLUG;

  saveLatestGeneratedRecipeSlug(safeSlug);

  if (!task || !canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      MOCK_GENERATION_TASK_KEY,
      JSON.stringify({
        ...task,
        completedAt: new Date().toISOString(),
        errorCode,
        generatedRecipeSlug: safeSlug,
        status: "failed",
      }),
    );
  } catch {
    return;
  }
}
