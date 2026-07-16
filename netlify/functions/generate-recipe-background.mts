import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import { generateRecipeFromShareLink } from "../../src/lib/generation/generateRecipeFromShareLink";
import { normalizeShareUrl } from "../../src/lib/media/extractAudio";
import { checkRateLimit } from "../../src/lib/security/rateLimit";

const STORE_NAME = "recipe-generation-jobs";
const JOB_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getJobKey(jobId: string) {
  return `jobs/${jobId}`;
}

const handler = async (request: Request, context: Context) => {
  const store = getStore({ consistency: "strong", name: STORE_NAME });
  let jobId = "";

  try {
    const body = (await request.json()) as {
      jobId?: unknown;
      sourceUrl?: unknown;
    };
    jobId = typeof body.jobId === "string" ? body.jobId : "";
    const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl : "";

    if (!JOB_ID_PATTERN.test(jobId) || !sourceUrl || sourceUrl.length > 2048) {
      return;
    }

    const existing = await store.get(getJobKey(jobId), { type: "json" }) as {
      status?: string;
    } | null;
    if (
      existing?.status === "processing" ||
      existing?.status === "completed" ||
      existing?.status === "failed"
    ) {
      return;
    }

    const rateLimit = checkRateLimit(`background:${context.ip}`, {
      limit: 3,
      windowMs: 10 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      await store.setJSON(getJobKey(jobId), {
        errorCode: "rate_limited",
        status: "failed",
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const normalized = normalizeShareUrl(sourceUrl);
    await store.setJSON(getJobKey(jobId), {
      createdAt: new Date().toISOString(),
      sourceHash: normalized.sourceHash,
      status: "processing",
      updatedAt: new Date().toISOString(),
    });

    const generated = await generateRecipeFromShareLink(normalized.canonicalUrl);
    await store.setJSON(getJobKey(jobId), {
      createdAt: new Date().toISOString(),
      result: {
        draft: generated.draft,
        error: null,
        errorCode: null,
        generation: {
          asrModel: generated.asr.model,
          asrProvider: generated.asr.provider,
          durationSeconds: generated.durationSeconds,
          processingTimeMs:
            generated.stages.at(-1)?.completedAtMs ??
            generated.asr.processingTimeMs,
          sourceHash: generated.sourceHash,
          stages: generated.stages,
          usedAsrFallback: generated.asr.usedFallback,
        },
        model: Netlify.env.get("DEEPSEEK_MODEL") || "deepseek-v4-flash",
        ok: true,
        provider: "deepseek",
        source: {
          canonicalUrl: generated.canonicalUrl,
          extractor: "combined",
          platform: "xiaohongshu",
          warnings: generated.asr.warnings,
        },
        usedFallback: false,
      },
      sourceHash: generated.sourceHash,
      status: "completed",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    if (JOB_ID_PATTERN.test(jobId)) {
      try {
        await store.setJSON(getJobKey(jobId), {
          errorCode: "generation_failed",
          status: "failed",
          updatedAt: new Date().toISOString(),
        });
      } catch {
        console.error("[recipe-pipeline] failed to persist background status");
      }
    }
  }
};

export default handler;

export const config: Config = {
  path: "/api/generate-recipe-background",
};
