import { getCurrentUser } from "@/lib/auth/session";
import {
  completeMockGenerationTaskWithSlug,
  failMockGenerationTaskWithSlug,
  readLatestGeneratedRecipeSlug,
  readMockGenerationTask,
  saveMockGenerationTask,
  type MockGenerationTask,
} from "@/lib/mockGenerationTask";
import {
  tryCompleteGenerationTaskInSupabase,
  tryCreateGenerationTaskInSupabase,
  tryFailGenerationTaskInSupabase,
  tryGetLatestGeneratedRecipeSlugFromSupabase,
  tryGetLatestGenerationTaskFromSupabase,
  type SupabaseGenerationTaskRow,
  type SupabaseGenerationTaskStatus,
} from "@/lib/data/supabase/generationTasks";

const DEFAULT_GENERATED_RECIPE_SLUG = "kung-pao-chicken";

export type GenerationTaskSyncMode = "local" | "cloud" | "fallback";

export type GenerationTaskFailureCode =
  | "ai_provider_failed"
  | "ai_fallback_used"
  | "recipe_save_failed"
  | "generation_task_update_failed"
  | "unknown";

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
    completedAt: task.completedAt ?? null,
  };
}

function mapSupabaseTask(
  task: SupabaseGenerationTaskRow | null,
  generatedRecipeSlug = DEFAULT_GENERATED_RECIPE_SLUG,
): GenerationTask | null {
  if (!task) {
    return null;
  }

  return {
    completedAt: task.completed_at,
    generatedRecipeSlug,
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
      const cloudRecipeSlug = cloudTask.data.generated_recipe_id
        ? await tryGetLatestGeneratedRecipeSlugFromSupabase(user.id)
        : { data: null, ok: true };

      return mapSupabaseTask(
        cloudTask.data,
        cloudRecipeSlug.data ?? DEFAULT_GENERATED_RECIPE_SLUG,
      );
    }
  }

  return getLocalGenerationTask();
}

export async function createMockGenerationTask(
  sourceUrl: string,
  sourcePlatform = "mock",
): Promise<GenerationTask> {
  const localTask = saveMockGenerationTask(sourceUrl, sourcePlatform);
  const user = await getCurrentUser();

  if (!user) {
    return mapLocalTask(localTask) as GenerationTask;
  }

  const cloudTask = await tryCreateGenerationTaskInSupabase(
    user.id,
    sourceUrl,
    sourcePlatform,
  );

  if (!cloudTask.ok || !cloudTask.data) {
    return {
      ...(mapLocalTask(localTask) as GenerationTask),
      syncMode: "fallback",
    };
  }

  return mapSupabaseTask(cloudTask.data) as GenerationTask;
}

export async function completeMockGenerationTask(
  generatedRecipeSlug?: string,
  taskId?: string,
): Promise<GenerationTask | null> {
  const user = await getCurrentUser();
  const safeSlug =
    generatedRecipeSlug ||
    readLatestGeneratedRecipeSlug() ||
    DEFAULT_GENERATED_RECIPE_SLUG;

  completeMockGenerationTaskWithSlug(safeSlug);

  if (user && taskId) {
    const cloudTaskId = taskId;

    if (cloudTaskId) {
      const completed = await tryCompleteGenerationTaskInSupabase(
        cloudTaskId,
        safeSlug,
      );

      if (completed.ok) {
        return {
          ...(getLocalGenerationTask() as GenerationTask),
          completedAt: new Date().toISOString(),
          generatedRecipeSlug: safeSlug,
          id: cloudTaskId,
          status: "completed",
          syncMode: "cloud",
        };
      }
    }
  }

  const localTask = getLocalGenerationTask();
  return localTask && user ? { ...localTask, syncMode: "fallback" } : localTask;
}

export async function failGenerationTask(
  errorCode: GenerationTaskFailureCode,
  generatedRecipeSlug = DEFAULT_GENERATED_RECIPE_SLUG,
  taskId?: string,
): Promise<GenerationTask | null> {
  failMockGenerationTaskWithSlug(generatedRecipeSlug, errorCode);
  const user = await getCurrentUser();

  if (user && taskId) {
    const failed = await tryFailGenerationTaskInSupabase(taskId, errorCode);
    const localTask = getLocalGenerationTask();

    if (localTask) {
      return {
        ...localTask,
        id: taskId,
        syncMode: failed.ok ? "cloud" : "fallback",
      };
    }
  }

  return getLocalGenerationTask();
}

export async function getLatestGeneratedRecipeSlug(): Promise<string> {
  const localRecipeSlug = readLatestGeneratedRecipeSlug();

  if (localRecipeSlug) {
    return localRecipeSlug;
  }

  const user = await getCurrentUser();

  if (user) {
    const cloudRecipeSlug = await tryGetLatestGeneratedRecipeSlugFromSupabase(
      user.id,
    );

    if (cloudRecipeSlug.ok && cloudRecipeSlug.data) {
      return cloudRecipeSlug.data;
    }
  }

  return (
    getLocalGenerationTask()?.generatedRecipeSlug ??
    DEFAULT_GENERATED_RECIPE_SLUG
  );
}
