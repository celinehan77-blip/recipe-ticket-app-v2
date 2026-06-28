export type MockGenerationTaskStatus = "processing" | "completed";

export type MockGenerationTask = {
  sourceUrl: string;
  generatedRecipeSlug: "kung-pao-chicken";
  status: MockGenerationTaskStatus;
  sourcePlatform: "mock";
  createdAt: string;
};

const MOCK_GENERATION_TASK_KEY = "recipe-ticket:mock-generation-task";

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function saveMockGenerationTask(sourceUrl: string) {
  const task: MockGenerationTask = {
    sourceUrl,
    generatedRecipeSlug: "kung-pao-chicken",
    status: "processing",
    sourcePlatform: "mock",
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
      JSON.stringify({ ...task, status: "completed" }),
    );
  } catch {
    return;
  }
}
