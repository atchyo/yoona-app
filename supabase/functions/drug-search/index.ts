import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

interface DrugMatch {
  id: string;
  source: string;
  productName: string;
  manufacturer?: string;
  ingredients: Array<{ name: string; amount?: string }>;
  dosageForm?: string;
  efficacy?: string;
  usage?: string;
  warnings: string[];
  interactions: string[];
  confidence: number;
}

interface HealthFunctionalFoodListItem {
  id: string;
  productName: string;
  manufacturer?: string;
  statementNo?: string;
  absoluteIndex: number;
}

let healthFunctionalFoodCache:
  | { expiresAt: number; items: HealthFunctionalFoodListItem[] }
  | null = null;
const HEALTH_FUNCTIONAL_FOOD_PAGE_SIZE = 100;
const HEALTH_FUNCTIONAL_FOOD_MAX_PAGES = 25;
const HEALTH_FUNCTIONAL_FOOD_CACHE_TTL_MS = 1000 * 60 * 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return jsonResponse({ error: "query is required" }, 400);
  }

  const mfdsPermitMatches = await searchMfdsPermit(query);
  const mfdsEasyMatches = await searchMfdsEasyDrug(query);
  const healthFunctionalFoodMatches =
    looksLikeSupplementQuery(query) || mfdsPermitMatches.length + mfdsEasyMatches.length < 2
      ? await searchHealthFunctionalFood(query)
      : [];

  const matches = [
    ...mfdsPermitMatches,
    ...mfdsEasyMatches,
    ...healthFunctionalFoodMatches,
    ...(await searchRxNorm(query)),
  ]
    .sort((a, b) => compareMatches(query, a, b))
    .slice(0, 10);

  return jsonResponse({ matches });
});

async function searchMfdsPermit(query: string): Promise<DrugMatch[]> {
  const serviceKey = Deno.env.get("DATA_GO_KR_SERVICE_KEY");
  if (!serviceKey) return [];

  const payload = await fetchDataGoKrJson(
    "https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService07/getDrugPrdtPrmsnInq07",
    "serviceKey",
    serviceKey,
    {
      type: "json",
      item_name: query,
      numOfRows: "5",
      pageNo: "1",
    },
  );
  const items = normalizeItems(extractItems(payload));

  return items.map((item: Record<string, string>, index: number) => ({
    id: `mfds-permit-${item.ITEM_SEQ || index}`,
    source: "mfds_permit",
    productName: item.ITEM_NAME || query,
    manufacturer: item.ENTP_NAME,
    ingredients: parseIngredients(item.MAIN_ITEM_INGR || item.MAIN_INGR || ""),
    dosageForm: item.CHART,
    efficacy: item.EE_DOC_DATA,
    usage: item.UD_DOC_DATA,
    warnings: compactTextList([item.NB_DOC_DATA]),
    interactions: [],
    confidence: 0.9,
  }));
}

async function searchMfdsEasyDrug(query: string): Promise<DrugMatch[]> {
  const serviceKey = Deno.env.get("DATA_GO_KR_SERVICE_KEY");
  if (!serviceKey) return [];

  const payload = await fetchDataGoKrJson(
    "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList",
    "ServiceKey",
    serviceKey,
    {
      type: "json",
      itemName: query,
      numOfRows: "5",
      pageNo: "1",
    },
  );
  const items = normalizeItems(extractItems(payload));

  return items.map((item: Record<string, string>, index: number) => ({
    id: `mfds-easy-${item.itemSeq || index}`,
    source: "mfds_easy",
    productName: item.itemName || query,
    manufacturer: item.entpName,
    ingredients: [],
    dosageForm: undefined,
    efficacy: item.efcyQesitm,
    usage: item.useMethodQesitm,
    warnings: compactTextList([item.atpnWarnQesitm, item.atpnQesitm, item.seQesitm]),
    interactions: compactTextList([item.intrcQesitm]),
    confidence: 0.78,
  }));
}

async function searchHealthFunctionalFood(query: string): Promise<DrugMatch[]> {
  const serviceKey = Deno.env.get("DATA_GO_KR_SERVICE_KEY");
  if (!serviceKey) return [];

  const items = await loadHealthFunctionalFoodIndex(serviceKey);
  const normalizedQuery = normalizeName(query);

  const candidates = items
    .filter((item) => {
      const normalizedProductName = normalizeName(item.productName);
      const normalizedManufacturer = normalizeName(item.manufacturer || "");
      return (
        normalizedProductName.includes(normalizedQuery) ||
        normalizedManufacturer.includes(normalizedQuery)
      );
    })
    .sort((left, right) => compareMatches(query, toHealthListMatch(left), toHealthListMatch(right)))
    .slice(0, 5);

  const detailedMatches = await Promise.all(
    candidates.map((item) => fetchHealthFunctionalFoodDetail(item, serviceKey)),
  );

  return detailedMatches
    .filter((match): match is DrugMatch => Boolean(match))
    .sort((a, b) => compareMatches(query, a, b));
}

async function searchRxNorm(query: string): Promise<DrugMatch[]> {
  if (/[가-힣]/.test(query)) return [];

  const url = new URL("https://rxnav.nlm.nih.gov/REST/approximateTerm.json");
  url.searchParams.set("term", query);
  url.searchParams.set("maxEntries", "5");
  const response = await fetch(url);
  if (!response.ok) return [];
  const payload = await response.json();
  const candidates = (payload?.approximateGroup?.candidate || []).filter((candidate: Record<string, string>) => {
    const score = Number(candidate.score || 0);
    return score >= 55;
  });

  return candidates.map((candidate: Record<string, string>) => ({
    id: `rxnorm-${candidate.rxcui}`,
    source: "rxnorm",
    productName: candidate.name || query,
    ingredients: [{ name: candidate.name || query }],
    warnings: [],
    interactions: [],
    confidence: Number(candidate.score || 0) / 100,
  }));
}

function normalizeItems(items: unknown): Array<Record<string, string>> {
  if (!items) return [];
  if (Array.isArray(items)) return items as Array<Record<string, string>>;
  if (Array.isArray((items as { item?: unknown[] }).item)) {
    return (items as { item: Array<Record<string, string>> }).item;
  }
  if ((items as { item?: unknown }).item) return [(items as { item: Record<string, string> }).item];
  return [];
}

function extractItems(payload: unknown): unknown {
  const body =
    (payload as { response?: { body?: { items?: unknown } } })?.response?.body ||
    (payload as { body?: { items?: unknown } })?.body;

  return body?.items;
}

function extractTotalCount(payload: unknown): number {
  const rawValue =
    (payload as { response?: { body?: { totalCount?: string | number } } })?.response?.body
      ?.totalCount ||
    (payload as { body?: { totalCount?: string | number } })?.body?.totalCount ||
    0;

  return Number(rawValue || 0);
}

async function fetchDataGoKrJson(
  baseUrl: string,
  serviceKeyName: string,
  serviceKey: string,
  params: Record<string, string>,
): Promise<unknown> {
  const keyCandidates = Array.from(
    new Set([serviceKey, safeDecode(serviceKey)]).values(),
  ).filter(Boolean);

  for (const key of keyCandidates) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([name, value]) => {
      url.searchParams.set(name, value);
    });
    url.searchParams.set(serviceKeyName, key);

    const response = await fetch(url);
    if (!response.ok) continue;

    const payload = await response.json();
    const resultCode = String(
      (payload as { response?: { header?: { resultCode?: string } } })?.response?.header?.resultCode ||
        (payload as { header?: { resultCode?: string } })?.header?.resultCode ||
        "",
    );

    if (resultCode && resultCode !== "00") continue;
    return payload;
  }

  return {};
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseIngredients(value: string): Array<{ name: string; amount?: string }> {
  return value
    .split(/[,\n;]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ name: part }));
}

function compactTextList(values: Array<string | undefined>): string[] {
  return values.map((value) => value?.trim()).filter(Boolean) as string[];
}

function parseFunctionalClaims(value: string): Array<{ name: string; amount?: string }> {
  const cleaned = value
    .replace(/<[^>]+>/g, " ")
    .replace(/[\r\n]+/g, " ")
    .trim();

  if (!cleaned) return [];

  return cleaned
    .split(/[,.·]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1)
    .slice(0, 3)
    .map((part) => ({ name: part }));
}

function compareMatches(query: string, left: DrugMatch, right: DrugMatch): number {
  const scoreGap = matchPriority(query, right.productName) - matchPriority(query, left.productName);
  if (scoreGap !== 0) return scoreGap;
  return right.confidence - left.confidence;
}

function matchPriority(query: string, productName: string): number {
  const normalizedQuery = normalizeName(query);
  const normalizedProductName = normalizeName(productName);

  if (!normalizedQuery || !normalizedProductName) return 0;
  if (normalizedProductName === normalizedQuery) return 5;
  if (normalizedProductName.startsWith(normalizedQuery)) return 4;
  if (normalizedProductName.includes(normalizedQuery)) return 3;
  if (normalizedQuery.split(/\s+/).every((token) => normalizedProductName.includes(token))) return 2;
  return 1;
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[\s\-_/()[\].,]/g, "");
}

function looksLikeSupplementQuery(query: string): boolean {
  return /(비타민|오메가|마그네슘|유산균|프로바이오틱|루테인|아연|칼슘|철분|밀크씨슬|홍삼|크릴|비오틴|콜라겐|코큐텐|코엔자임|글루코사민|msm|vitamin|omega|probiotic|magnesium|lutein|zinc|calcium|iron|collagen)/i.test(
    query,
  );
}

function toHealthListMatch(item: HealthFunctionalFoodListItem): DrugMatch {
  return {
    id: item.id,
    source: "mfds_health",
    productName: item.productName,
    manufacturer: item.manufacturer,
    ingredients: [],
    warnings: [],
    interactions: [],
    confidence: 0.62,
  };
}

async function loadHealthFunctionalFoodIndex(
  serviceKey: string,
): Promise<HealthFunctionalFoodListItem[]> {
  if (healthFunctionalFoodCache && healthFunctionalFoodCache.expiresAt > Date.now()) {
    return healthFunctionalFoodCache.items;
  }

  const items: HealthFunctionalFoodListItem[] = [];
  let totalCount = Number.POSITIVE_INFINITY;

  for (let pageNo = 1; pageNo <= HEALTH_FUNCTIONAL_FOOD_MAX_PAGES; pageNo += 1) {
    const payload = await fetchDataGoKrJson(
      "https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsList01",
      "ServiceKey",
      serviceKey,
      {
        type: "json",
        numOfRows: String(HEALTH_FUNCTIONAL_FOOD_PAGE_SIZE),
        pageNo: String(pageNo),
      },
    );

    const pageItems = normalizeItems(extractItems(payload));
    if (!pageItems.length) break;

    totalCount = extractTotalCount(payload) || totalCount;

    pageItems.forEach((item: Record<string, string>, index: number) => {
      items.push({
        id: `mfds-health-${item.STTEMNT_NO || `${pageNo}-${index}`}`,
        productName: item.PRDUCT || "",
        manufacturer: item.ENTRPS,
        statementNo: item.STTEMNT_NO,
        absoluteIndex: (pageNo - 1) * HEALTH_FUNCTIONAL_FOOD_PAGE_SIZE + index,
      });
    });

    if (items.length >= totalCount || pageItems.length < HEALTH_FUNCTIONAL_FOOD_PAGE_SIZE) {
      break;
    }
  }

  healthFunctionalFoodCache = {
    expiresAt: Date.now() + HEALTH_FUNCTIONAL_FOOD_CACHE_TTL_MS,
    items,
  };

  return items;
}

async function fetchHealthFunctionalFoodDetail(
  item: HealthFunctionalFoodListItem,
  serviceKey: string,
): Promise<DrugMatch | null> {
  const payload = await fetchDataGoKrJson(
    "https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsItem01",
    "ServiceKey",
    serviceKey,
    {
      type: "json",
      numOfRows: "1",
      pageNo: String(item.absoluteIndex + 1),
    },
  );

  const detail = normalizeItems(extractItems(payload))[0] as Record<string, string> | undefined;
  const productName = detail?.PRDUCT || item.productName;
  if (!productName) return null;

  return {
    id: item.id,
    source: "mfds_health",
    productName,
    manufacturer: detail?.ENTRPS || item.manufacturer,
    ingredients: parseFunctionalClaims(detail?.MAIN_FNCTN || detail?.BASE_STANDARD || ""),
    dosageForm: detail?.SUNGSANG,
    efficacy: detail?.MAIN_FNCTN,
    usage: detail?.SRV_USE,
    warnings: compactTextList([detail?.INTAKE_HINT1, detail?.PRSRV_PD, detail?.DISTB_PD]),
    interactions: [],
    confidence: normalizeName(productName) === normalizeName(item.productName) ? 0.8 : 0.68,
  };
}
