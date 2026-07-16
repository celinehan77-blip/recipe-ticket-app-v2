import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

const STORE_NAME = "recipe-generation-jobs";
const JOB_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const handler = async (request: Request, context: Context) => {
  const jobId = context.params.jobId || "";

  if (request.method !== "GET" || !JOB_ID_PATTERN.test(jobId)) {
    return Response.json({ error: "invalid_job", status: "failed" }, { status: 400 });
  }

  const store = getStore({ consistency: "strong", name: STORE_NAME });
  const job = await store.get(`jobs/${jobId}`, { type: "json" });

  if (!job) {
    return Response.json(
      { status: "pending" },
      { headers: { "Cache-Control": "no-store" }, status: 202 },
    );
  }

  return Response.json(job, {
    headers: { "Cache-Control": "no-store" },
    status: (job as { status?: string }).status === "completed" ? 200 : 202,
  });
};

export default handler;

export const config: Config = {
  path: "/api/generation-status/:jobId",
};
