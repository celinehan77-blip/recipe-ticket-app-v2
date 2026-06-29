import {
  completeMockGenerationTask as completeStoredMockGenerationTask,
  readMockGenerationTask,
  saveMockGenerationTask,
  type MockGenerationTask,
} from "@/lib/mockGenerationTask";

export function getLatestGenerationTask(): MockGenerationTask | null {
  return readMockGenerationTask();
}

export function createMockGenerationTask(sourceUrl: string): MockGenerationTask {
  return saveMockGenerationTask(sourceUrl);
}

export function completeMockGenerationTask(): void {
  completeStoredMockGenerationTask();
}

export function getLatestGeneratedRecipeSlug(): string {
  return getLatestGenerationTask()?.generatedRecipeSlug ?? "kung-pao-chicken";
}
