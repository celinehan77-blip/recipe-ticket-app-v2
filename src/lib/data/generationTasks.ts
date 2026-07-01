import { getCurrentUser } from "@/lib/auth/session";
import {
  completeMockGenerationTask as completeStoredMockGenerationTask,
  readMockGenerationTask,
  saveMockGenerationTask,
  type MockGenerationTask,
} from "@/lib/mockGenerationTask";
import {
  tryCompleteGenerationTaskInSupabase,
  tryCreateGenerationTaskInSupabase,
  tryGetLatestGeneratedRecipeSlugFromSupabase,
  tryGetLatestGenerationTaskFromSupabase,
  type SupabaseGenerationTaskRow,
  type SupabaseGenerationTaskStatus,
} from "@/lib/data/supabase/generationTasks";

const DEFAULT_GENERATED_RECIPE_SLUG = "kung-pao-chicken";

export type GenerationTaskSyncMode = "local" | "cloud" | "fallback";

export type GenerationTask = {
  completedAt?: string | null;
  generatedRecipeSlug: string;
  id?: string;
  sourcePlatform: string;
  sourceUrl: string;
  status: SupabaseGenerationTaskStatus;
  syncMode: GenerationTaskSyncMode;
  createdAt: string;
};

function mapLocalTask(task: MockGenerationTask | null): GenerationTask | null {
  if (!task) {
    return null;
  }

  return {
    generatedRecipeSlug: task.generatedRecipeSlug,
    sourcePlatform: task.sourcePlatform,
    sourceUrl: task.sourceUrl,
    status: task.status,
    syncMode: "local",
    createdAt: task.createdAt,
    completedAt: task.status === "completed" ? task.createdAt : null,
  };
}

function mapSupabaseTask(
  task: SupabaseGenerationTaskRow | null,
): GenerationTask | null {
  if (!task) {
    return null;
  }

  return {
    completedAt: task.completed_at,
    generatedRecipeSlug: task.generated_recipe_id
      ? DEFAULT_GENERATED_RECIPE_SLUG
      : DEFAULT_GENERATED_RECIPE_SLUG,
    id: task.id,
    sourcePlatform: task.source_platform ?? "mock",
    sourceUrl: task.source_url,
    status: task.status,
    syncMode: "cloud",
    createdAt: task.created_at ?? new Date().toISOString(),
  };
}

function getLocalGenerationTask(): GenerationTask | null {
  return mapLocalTask(readMockGenerationTask());
}

export async function getLatestGenerationTask(): Promise<GenerationTask | null> {
  const user = await getCurrentUser();

  if (user) {
    const cloudTask = await tryGetLatestGenerationTaskFromSupabase(user.id);

    if (cloudTask.ok && cloudTask.data) {
      return mapSupabaseTask(cloudTask.data);
    }
  }

  return getLocalGenerationTask();
}

export async function createMockGenerationTask(
  sourceUrl: string,
): Promise<GenerationTask> {
  const localTask = saveMockGenerationTask(sourceUrl);
  const user = await getCurrentUser();

  if (!user) {
    return mapLocalTask(localTask) as GenerationTask;
  }

  const cloudTask = await tryCreateGenerationTaskInSupabase(user.id, sourceUrl);

  if (!cloudTask.ok || !cloudTask.data) {
    return {
      ...(mapLocalTask(localTask) as GenerationTask),
      syncMode: "fallback",
    };
  }

  return mapSupabaseTask(cloudTask.data) as GenerationTask;
}

export async function completeMockGenerationTask(): Promise<GenerationTask | null> {
  const user = await getCurrentUser();

  if (user) {
    const latestCloudTask = await tryGetLatestGenerationTaskFromSupabase(user.id);

    if (latestCloudTask.ok && latestCloudTask.data?.id) {
      const completed = await tryCompleteGenerationTaskInSupabase(
        latestCloudTask.data.id,
        DEFAULT_GENERATED_RECIPE_SLUG,
      );

      if (completed.ok) {
        return {
          ...(mapSupabaseTask(latestCloudTask.data) as GenerationTask),
          completedAt: new Date().toISOString(),
          generatedRecipeSlug: DEFAULT_GENERATED_RECIPE_SLUG,
          status: "completed",
        };
      }
    }
  }

  completeStoredMockGenerationTask();
  return getLocalGenerationTask();
}

export async function getLatestGeneratedRecipeSlug(): Promise<string> {
  const user = await getCurrentUser();

  if (user) {
    const cloudRecipeSlug = await tryGetLatestGeneratedRecipeSlugFromSupabase(
      user.id,
    );

    if (cloudRecipeSlug.ok && cloudRecipeSlug.data) {
      return cloudRecipeSlug.data;
    }
  }

  return getLocalGenerationTask()?.generatedRecipeSlug ?? DEFAULT_GENERATED_RECIPE_SLUG;
}
