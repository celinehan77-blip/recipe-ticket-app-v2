import type { ParsedRecipeDraft } from "@/types/ai";

const explicitEmphasisPattern =
  /(一定|必须|千万|切记|不要|不能|不可|别|否则|要不然)/;
const heatPattern =
  /(中小火|中大火|中高火|最小火|小火|中火|大火|高火|低火|\d{2,3}度)/g;
const durationPattern =
  /(\d+(?:\.\d+)?(?:[-到至~]\d+(?:\.\d+)?)?(?:秒|分钟|小时|天)|半小时|过夜|一晚上)/g;

function normalizeEvidence(value: string) {
  return value
    .normalize("NFKC")
    .replace(/(\d{2,3})(?:°C|℃|度)/gi, "$1度")
    .replace(/半个?小时/g, "30分钟")
    .replace(/一(?:个)?小时/g, "1小时")
    .replace(/[～~至到]/g, "-")
    .replace(/(大约|约|左右|至少|最低|总共|一共)/g, "")
    .replace(/\s+/g, "")
    .replace(/[，。！？、；：,.!?;:()（）]/g, "")
    .toLowerCase();
}

function normalizeAmountEvidence(value: string) {
  const chineseNumbers: Record<string, string> = {
    一: "1",
    二: "2",
    两: "2",
    三: "3",
    四: "4",
    五: "5",
    六: "6",
    七: "7",
    八: "8",
    九: "9",
    十: "10",
  };

  return normalizeEvidence(value)
    .replace(/([一二两三四五六七八九十])(?=(?:个|只|颗|粒|片|块|根|勺|杯))/g, (
      number,
    ) => chineseNumbers[number] ?? number)
    .replace(/半(?=(?:勺|汤匙|茶匙|杯))/g, "1/2")
    .replace(/(\d+(?:\.\d+)?)g\b/g, "$1克")
    .replace(/(\d+(?:\.\d+)?)ml\b/g, "$1毫升");
}

function markEstimatedAmounts(draft: ParsedRecipeDraft, source: string) {
  let markedEstimate = false;
  const normalizedClauses = source
    .split(/[。！？；\n]/)
    .map(normalizeAmountEvidence);
  const markItem = <T extends ParsedRecipeDraft["ingredients"][number]>(item: T) => {
    const normalizedAmount = normalizeAmountEvidence(item.amount);
    const normalizedName = normalizeAmountEvidence(item.name);
    const isVague = /^(适量|少许|按需|若干)$/.test(normalizedAmount);
    const hasNumber = /\d/.test(normalizedAmount);
    const isGrounded = normalizedClauses.some(
      (clause) =>
        clause.includes(normalizedName) && clause.includes(normalizedAmount),
    );

    if (isVague || !hasNumber || isGrounded) {
      return item;
    }

    markedEstimate = true;
    return {
      ...item,
      note: [item.note, "AI估算（按2人份）"].filter(Boolean).join("；"),
    };
  };

  const ingredients = draft.ingredients.map(markItem);
  const seasonings = draft.seasonings.map(markItem);

  return { ingredients, markedEstimate, seasonings };
}

function uniqueMatches(value: string, pattern: RegExp) {
  return Array.from(new Set(value.match(pattern) ?? []));
}

function isDurationGrounded(duration: string, source: string) {
  if (!duration || duration === "未说明") {
    return true;
  }

  const normalizedDuration = normalizeEvidence(duration);
  const normalizedSource = normalizeEvidence(source);

  if (normalizedSource.includes(normalizedDuration)) {
    return true;
  }

  const durationTokens = uniqueMatches(normalizedDuration, durationPattern);

  return (
    durationTokens.length > 0 &&
    durationTokens.every((token) => normalizedSource.includes(token))
  );
}

function isHeatGrounded(heat: string, source: string) {
  if (!heat || heat === "未说明") {
    return true;
  }

  const normalizedHeat = normalizeEvidence(heat);
  const normalizedSource = normalizeEvidence(source);
  const heatTokens = uniqueMatches(normalizedHeat, heatPattern);

  if (heatTokens.length === 0) {
    return normalizedSource.includes(normalizedHeat);
  }

  return heatTokens.every((token) => normalizedSource.includes(token));
}

function bigrams(value: string) {
  const normalized = normalizeEvidence(value).replace(
    /(一定|必须|千万|切记|不要|不能|不可|否则|要不然)/g,
    "",
  );
  const result = new Set<string>();

  for (let index = 0; index < normalized.length - 1; index += 1) {
    result.add(normalized.slice(index, index + 2));
  }

  return result;
}

function isTipGrounded(tip: string, source: string) {
  if (!tip) {
    return true;
  }

  const emphasizedClauses = source
    .split(/[。！？；\n]/)
    .map((clause) => clause.trim())
    .filter((clause) => explicitEmphasisPattern.test(clause));
  const tipBigrams = bigrams(tip);

  return emphasizedClauses.some((clause) => {
    const clauseBigrams = bigrams(clause);
    return Array.from(tipBigrams).some((token) => clauseBigrams.has(token));
  });
}

export function groundParsedRecipeDraft(
  draft: ParsedRecipeDraft,
  sourceText: string | undefined,
): ParsedRecipeDraft {
  if (!sourceText?.trim()) {
    return draft;
  }

  let removedDuration = false;
  let removedHeat = false;
  let removedTip = false;
  const steps = draft.steps.map((step) => {
    const groundedDuration = isDurationGrounded(step.duration, sourceText);
    const groundedHeat = isHeatGrounded(step.heat, sourceText);
    const groundedTip = isTipGrounded(step.tips, sourceText);

    removedDuration ||= !groundedDuration;
    removedHeat ||= !groundedHeat;
    removedTip ||= !groundedTip;

    return {
      ...step,
      duration: groundedDuration ? step.duration : "未说明",
      heat: groundedHeat ? step.heat : "未说明",
      tips: groundedTip ? step.tips : "",
    };
  });
  const warnings = [...draft.warnings];
  const estimatedAmounts = markEstimatedAmounts(draft, sourceText);

  if (removedDuration) {
    warnings.push("原文未明确的步骤时间已标记为未说明。");
  }

  if (removedHeat) {
    warnings.push("原文未明确的步骤火候已标记为未说明。");
  }

  if (removedTip) {
    warnings.push("缺少原文强调依据的步骤提示已移除。");
  }

  if (estimatedAmounts.markedEstimate) {
    warnings.push("原文未提供的数值用量已标记为按2人份AI估算。");
  }

  return {
    ...draft,
    ingredients: estimatedAmounts.ingredients,
    seasonings: estimatedAmounts.seasonings,
    steps,
    warnings: Array.from(new Set(warnings)),
  };
}
