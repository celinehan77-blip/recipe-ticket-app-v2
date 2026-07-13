"use client";

import { type FormEvent, useState } from "react";
import type { RecipeParseResult } from "@/types/ai";

const defaultRawText = "宫保鸡丁，鸡腿肉切丁，花生，大葱，酸甜微辣。";

export function ParseRecipeTestScreen() {
  const [rawText, setRawText] = useState(defaultRawText);
  const [sourceUrl, setSourceUrl] = useState("");
  const [result, setResult] = useState<RecipeParseResult | null>(null);
  const [resultJson, setResultJson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setResultJson("");

    const response = await fetch("/api/parse-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rawText,
        sourceUrl,
        sourcePlatform: sourceUrl ? "mock" : "manual",
      }),
    });
    const nextResult = (await response.json()) as RecipeParseResult;

    setResult(nextResult);
    setResultJson(JSON.stringify(nextResult.draft ?? nextResult, null, 2));
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fbf8f3] px-5 py-8 text-[#3a2a1d]">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a35]">
          Dev Tool
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Parse Recipe Test</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#75695f]">
          这个页面只用于开发测试 `/api/parse-recipe`。当前 provider 由服务端
          `AI_PROVIDER` 决定，默认使用 Mock Parser。首页生成流程也会调用同一个接口。
        </p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[#5b4737]">
            rawText
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              rows={7}
              className="rounded-xl border border-[#ded3c7] bg-white px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-[#8a5a35]"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#5b4737]">
            sourceUrl
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              className="rounded-xl border border-[#ded3c7] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#8a5a35]"
              placeholder="可选，例如 https://example.com/mock-note"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-xl bg-[#8a5a35] px-5 text-sm font-semibold text-[#fffaf2] disabled:opacity-60"
          >
            {isLoading ? "解析中" : "测试解析"}
          </button>
        </form>

        {result ? (
          <section className="mt-6 grid gap-3 rounded-xl border border-[#ded3c7] bg-white p-4 text-sm text-[#5b4737]">
            <p>
              <span className="font-semibold">provider：</span>
              {result.provider}
            </p>
            <p>
              <span className="font-semibold">usedFallback：</span>
              {String(result.usedFallback)}
            </p>
            <p>
              <span className="font-semibold">error：</span>
              {result.error || "无"}
            </p>
            <p>
              <span className="font-semibold">warnings：</span>
              {result.draft?.warnings?.length
                ? result.draft.warnings.join(" / ")
                : "无"}
            </p>
          </section>
        ) : null}

        <pre className="mt-7 min-h-56 overflow-auto rounded-xl border border-[#ded3c7] bg-[#231b16] p-4 text-xs leading-5 text-[#f9efe2]">
          {resultJson || "draft JSON 会显示在这里。"}
        </pre>
      </div>
    </main>
  );
}
