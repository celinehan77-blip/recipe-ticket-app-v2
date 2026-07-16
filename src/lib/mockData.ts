import {
  Beef,
  Bird,
  ChefHat,
  CookingPot,
  Fish,
  Flame,
  Home,
  Map,
  Soup,
  Star,
  UserRound,
} from "lucide-react";
import type { LoadingStep, RecentRecipe, Recipe, Station, TabItem } from "@/types";

export const tabItems: TabItem[] = [
  { id: "home", label: "首页", route: "/", icon: Home },
  { id: "favorites", label: "收藏", route: "/favorites", icon: Star },
  { id: "flavor-map", label: "风味地图", route: "/flavor-map", icon: Map },
  { id: "profile", label: "我的", route: "/me", icon: UserRound },
];

export const stations: Station[] = [
  {
    id: "station-chicken",
    slug: "chicken",
    nameZh: "羽禽驿站",
    nameEn: "Poultry Station",
    description: "探索鸡肉的 100+ 种可能",
    recipeCount: 128,
    averageTime: "25 分钟",
    difficulty: "简单",
    categoryType: "poultry",
    accentColor: "sage",
    route: "/station/chicken",
    icon: Bird,
  },
  {
    id: "station-pasture",
    slug: "pasture",
    nameZh: "牧场驿站",
    nameEn: "Pasture Station",
    description: "从牛肉到羊肉的浓郁风味",
    recipeCount: 96,
    averageTime: "40 分钟",
    difficulty: "中等",
    categoryType: "pasture",
    accentColor: "caramel",
    route: "/station/pasture",
    icon: Beef,
  },
  {
    id: "station-seafood",
    slug: "seafood",
    nameZh: "海味码头",
    nameEn: "Seafood Harbor",
    description: "属于海鲜的鲜甜旅程",
    recipeCount: 84,
    averageTime: "30 分钟",
    difficulty: "简单",
    categoryType: "seafood",
    accentColor: "blue",
    route: "/station/seafood",
    icon: Fish,
  },
];

export const recipes: Recipe[] = [
  {
    id: "recipe-huang-men-chicken",
    slug: "huang-men-chicken",
    titleZh: "黄焖鸡",
    titleEn: "Braised Chicken",
    stationId: "station-chicken",
    coverType: "illustration",
    timeMinutes: 35,
    difficulty: "简单",
    flavor: "鲁味",
    mainIngredient: "鸡腿肉 · 香菇 · 青椒",
    tags: ["醇香浓郁", "汤汁下饭"],
    description: "鸡腿肉与香菇慢焖入味，汤汁浓郁，适合拌饭。",
    ingredients: [
      { id: "huang-main-chicken", name: "鸡腿肉", amount: "350g", group: "main", note: "切块" },
      { id: "huang-side-mushroom", name: "香菇", amount: "6朵", group: "side", note: "增香" },
      { id: "huang-side-pepper", name: "青椒", amount: "1个", group: "side", note: "出锅前加入" },
    ],
    seasonings: [
      { id: "huang-season-soy", name: "生抽", amount: "2勺", group: "seasoning", note: "调味" },
      { id: "huang-season-sauce", name: "黄豆酱", amount: "1勺", group: "seasoning", note: "增加酱香" },
    ],
    steps: [
      {
        id: "huang-step-01",
        title: "煎香鸡块",
        description: "鸡腿肉下锅煎至微黄。",
        duration: "5 分钟",
        icon: CookingPot,
        tips: "先煎再焖，香气更足。",
      },
    ],
    savedCount: 318,
  },
  {
    id: "recipe-kung-pao-chicken",
    slug: "kung-pao-chicken",
    titleZh: "宫保鸡丁",
    titleEn: "Kung Pao Chicken",
    stationId: "station-chicken",
    coverType: "illustration",
    timeMinutes: 25,
    difficulty: "简单",
    flavor: "川味",
    mainIngredient: "鸡肉 · 花生 · 干辣椒 · 花椒",
    tags: ["酸甜微辣", "花生香脆", "鸡肉嫩滑"],
    description:
      "酸甜微辣，香脆可口。鸡肉嫩滑，花生香脆，干辣椒与花椒的香气在口中层层绽放。",
    ingredients: [
      { id: "kung-main-chicken", name: "鸡腿肉", amount: "300g", group: "main", note: "切丁后腌制" },
      { id: "kung-side-peanut", name: "花生", amount: "50g", group: "side", note: "增香酥脆" },
      { id: "kung-side-chili", name: "干辣椒", amount: "8个", group: "side", note: "香辣提味" },
      { id: "kung-side-scallion", name: "葱段", amount: "20g", group: "side", note: "清香提鲜" },
      { id: "kung-side-peppercorn", name: "花椒", amount: "1小勺", group: "side", note: "麻香点睛" },
    ],
    seasonings: [
      { id: "kung-season-light-soy", name: "生抽", amount: "2勺", group: "seasoning", note: "咸鲜底味" },
      { id: "kung-season-dark-soy", name: "老抽", amount: "1勺", group: "seasoning", note: "辅助上色" },
      { id: "kung-season-sugar", name: "糖", amount: "1勺", group: "seasoning", note: "平衡酸辣" },
      { id: "kung-season-salt", name: "盐", amount: "1勺", group: "seasoning", note: "按口味调整" },
      { id: "kung-season-starch", name: "淀粉", amount: "1勺", group: "seasoning", note: "锁住肉汁" },
      { id: "kung-season-wine", name: "料酒", amount: "1勺", group: "seasoning", note: "去腥增香" },
    ],
    steps: [
      {
        id: "kung-step-01",
        title: "腌制鸡肉",
        description: "鸡腿肉切丁，加入生抽、料酒、淀粉抓匀腌制",
        duration: "3 分钟",
        icon: ChefHat,
        tips: "鸡丁不要切太大，方便快速成熟。",
      },
      {
        id: "kung-step-02",
        title: "调制宫保汁",
        description: "生抽、老抽、糖、醋、料酒、淀粉、清水调匀",
        duration: "2 分钟",
        icon: Soup,
        tips: "提前调好汁，避免炒制时手忙脚乱。",
      },
      {
        id: "kung-step-03",
        title: "爆香干辣椒和花椒",
        description: "热油下花椒炸香，加入干辣椒段炒出香味",
        duration: "1 分钟",
        icon: Flame,
        tips: "火不要太大，避免干辣椒发苦。",
      },
      {
        id: "kung-step-04",
        title: "下鸡丁翻炒",
        description: "倒入鸡丁快速翻炒至变色，保持肉质嫩滑",
        duration: "5 分钟",
        icon: CookingPot,
        tips: "快速翻炒，鸡肉刚变色即可继续下一步。",
      },
      {
        id: "kung-step-05",
        title: "加入花生收汁出锅",
        description: "倒入宫保汁和花生，淋入锅中翻炒均匀即可",
        duration: "2 分钟",
        icon: Star,
        tips: "花生最后加入，口感更脆。",
      },
    ],
    savedCount: 523,
  },
  {
    id: "recipe-spicy-chicken",
    slug: "spicy-chicken",
    titleZh: "辣子鸡",
    titleEn: "Spicy Chicken",
    stationId: "station-chicken",
    coverType: "illustration",
    timeMinutes: 30,
    difficulty: "中等",
    flavor: "川味",
    mainIngredient: "鸡腿肉 · 干辣椒 · 花椒",
    tags: ["麻辣过瘾", "回味无穷"],
    description: "鸡块炸香后与大量干辣椒翻炒，干香麻辣。",
    ingredients: [
      { id: "spicy-main-chicken", name: "鸡腿肉", amount: "350g", group: "main", note: "切小块" },
      { id: "spicy-side-chili", name: "干辣椒", amount: "一碗", group: "side", note: "营造香辣底味" },
      { id: "spicy-side-peppercorn", name: "花椒", amount: "1小把", group: "side", note: "增加麻香" },
    ],
    seasonings: [
      { id: "spicy-season-salt", name: "盐", amount: "适量", group: "seasoning", note: "调味" },
      { id: "spicy-season-wine", name: "料酒", amount: "1勺", group: "seasoning", note: "去腥" },
    ],
    steps: [
      {
        id: "spicy-step-01",
        title: "炸香鸡块",
        description: "鸡块炸至外层微焦。",
        duration: "8 分钟",
        icon: Flame,
        tips: "复炸一次口感更干香。",
      },
    ],
    savedCount: 286,
  },
  {
    id: "recipe-beef-stew",
    slug: "beef-stew",
    titleZh: "土豆炖牛肉",
    titleEn: "Beef Stew",
    stationId: "station-pasture",
    coverType: "illustration",
    timeMinutes: 90,
    difficulty: "中等",
    flavor: "家常",
    mainIngredient: "牛肉 · 土豆 · 胡萝卜",
    tags: ["浓郁", "软烂", "家常"],
    description: "牛肉炖至软烂，土豆吸满汤汁，适合慢慢享用。",
    ingredients: [
      { id: "beef-main-beef", name: "牛腩", amount: "500g", group: "main", note: "切块焯水" },
      { id: "beef-side-potato", name: "土豆", amount: "2个", group: "side", note: "切滚刀块" },
      { id: "beef-side-carrot", name: "胡萝卜", amount: "1根", group: "side", note: "增加甜味" },
    ],
    seasonings: [
      { id: "beef-season-soy", name: "生抽", amount: "2勺", group: "seasoning", note: "调味" },
      { id: "beef-season-star-anise", name: "八角", amount: "1个", group: "seasoning", note: "增香" },
    ],
    steps: [
      {
        id: "beef-step-01",
        title: "慢炖牛肉",
        description: "牛肉加香料炖至软烂。",
        duration: "70 分钟",
        icon: CookingPot,
        tips: "小火慢炖更入味。",
      },
    ],
    savedCount: 412,
  },
  {
    id: "recipe-black-pepper-beef",
    slug: "black-pepper-beef",
    titleZh: "黑椒牛柳",
    titleEn: "Black Pepper Beef",
    stationId: "station-pasture",
    coverType: "illustration",
    timeMinutes: 28,
    difficulty: "中等",
    flavor: "黑椒香",
    mainIngredient: "牛里脊 · 彩椒 · 洋葱 · 黑胡椒",
    tags: ["黑椒浓郁", "牛肉嫩滑", "快手热炒"],
    description: "牛柳滑嫩入味，黑椒香气明亮，彩椒和洋葱带出清甜。",
    ingredients: [
      { id: "black-pepper-main-beef", name: "牛里脊", amount: "300g", group: "main", note: "逆纹切条" },
      { id: "black-pepper-side-pepper", name: "彩椒", amount: "1个", group: "side", note: "切条" },
      { id: "black-pepper-side-onion", name: "洋葱", amount: "半个", group: "side", note: "增加甜味" },
    ],
    seasonings: [
      { id: "black-pepper-season-pepper", name: "黑胡椒", amount: "1勺", group: "seasoning", note: "现磨更香" },
      { id: "black-pepper-season-soy", name: "生抽", amount: "1勺", group: "seasoning", note: "调味" },
    ],
    steps: [
      {
        id: "black-pepper-step-01",
        title: "腌制牛柳",
        description: "牛柳加入生抽、黑胡椒和淀粉抓匀。",
        duration: "8 分钟",
        icon: ChefHat,
        tips: "少量油封住牛肉表面，口感更嫩。",
      },
      {
        id: "black-pepper-step-02",
        title: "快炒配菜",
        description: "彩椒和洋葱大火快速翻炒至断生。",
        duration: "3 分钟",
        icon: Flame,
        tips: "保持脆感，不要炒太久。",
      },
      {
        id: "black-pepper-step-03",
        title: "合炒收香",
        description: "牛柳回锅，加入黑椒汁翻炒均匀。",
        duration: "4 分钟",
        icon: CookingPot,
        tips: "最后再补黑胡椒，香气更明显。",
      },
    ],
    savedCount: 248,
  },
  {
    id: "recipe-tomato-beef-brisket",
    slug: "tomato-beef-brisket",
    titleZh: "番茄牛腩",
    titleEn: "Tomato Beef Brisket",
    stationId: "station-pasture",
    coverType: "illustration",
    timeMinutes: 85,
    difficulty: "中等",
    flavor: "酸甜浓郁",
    mainIngredient: "牛腩 · 番茄 · 土豆 · 洋葱",
    tags: ["柔和酸香", "汤汁浓厚", "暖胃慢炖"],
    description: "番茄炖出柔和酸甜，牛腩软烂，汤汁适合拌饭或配面。",
    ingredients: [
      { id: "tomato-beef-main-brisket", name: "牛腩", amount: "500g", group: "main", note: "焯水去腥" },
      { id: "tomato-beef-side-tomato", name: "番茄", amount: "3个", group: "side", note: "炒出沙" },
      { id: "tomato-beef-side-potato", name: "土豆", amount: "1个", group: "side", note: "增加厚度" },
    ],
    seasonings: [
      { id: "tomato-beef-season-ketchup", name: "番茄膏", amount: "1勺", group: "seasoning", note: "加强酸甜" },
      { id: "tomato-beef-season-soy", name: "生抽", amount: "2勺", group: "seasoning", note: "调味" },
    ],
    steps: [
      {
        id: "tomato-beef-step-01",
        title: "炒香番茄",
        description: "番茄和洋葱炒出汁水。",
        duration: "8 分钟",
        icon: Soup,
        tips: "番茄炒软后汤底更浓。",
      },
      {
        id: "tomato-beef-step-02",
        title: "加入牛腩慢炖",
        description: "放入牛腩和热水，小火炖至软烂。",
        duration: "65 分钟",
        icon: CookingPot,
        tips: "用热水炖，肉质更稳定。",
      },
      {
        id: "tomato-beef-step-03",
        title: "加入土豆收汁",
        description: "土豆入锅炖至软糯，收至汤汁浓厚。",
        duration: "12 分钟",
        icon: Star,
        tips: "最后按口味补盐。",
      },
    ],
    savedCount: 356,
  },
  {
    id: "recipe-steamed-fish",
    slug: "steamed-fish",
    titleZh: "清蒸鱼",
    titleEn: "Steamed Fish",
    stationId: "station-seafood",
    coverType: "illustration",
    timeMinutes: 20,
    difficulty: "简单",
    flavor: "鲜香",
    mainIngredient: "鲜鱼 · 葱姜 · 蒸鱼豉油",
    tags: ["鲜甜", "清爽", "快手"],
    description: "保留鱼肉鲜甜，葱姜去腥，热油激发香气。",
    ingredients: [
      { id: "fish-main-fish", name: "鲜鱼", amount: "1条", group: "main", note: "处理干净" },
      { id: "fish-side-scallion", name: "葱丝", amount: "适量", group: "side", note: "出锅装饰" },
      { id: "fish-side-ginger", name: "姜片", amount: "6片", group: "side", note: "去腥" },
    ],
    seasonings: [
      { id: "fish-season-soy", name: "蒸鱼豉油", amount: "2勺", group: "seasoning", note: "提鲜" },
      { id: "fish-season-oil", name: "热油", amount: "1勺", group: "seasoning", note: "激香" },
    ],
    steps: [
      {
        id: "fish-step-01",
        title: "上锅清蒸",
        description: "鱼身铺姜片，蒸至刚熟。",
        duration: "10 分钟",
        icon: CookingPot,
        tips: "不要蒸太久，保持鱼肉细嫩。",
      },
    ],
    savedCount: 196,
  },
  {
    id: "recipe-garlic-vermicelli-shrimp",
    slug: "garlic-vermicelli-shrimp",
    titleZh: "蒜蓉粉丝虾",
    titleEn: "Garlic Vermicelli Shrimp",
    stationId: "station-seafood",
    coverType: "illustration",
    timeMinutes: 22,
    difficulty: "简单",
    flavor: "蒜香鲜甜",
    mainIngredient: "鲜虾 · 粉丝 · 蒜蓉 · 葱花",
    tags: ["蒜香浓郁", "鲜甜多汁", "宴客快手"],
    description: "鲜虾铺在粉丝上蒸熟，蒜蓉酱汁渗入粉丝，鲜香轻盈。",
    ingredients: [
      { id: "garlic-shrimp-main-shrimp", name: "鲜虾", amount: "12只", group: "main", note: "开背去虾线" },
      { id: "garlic-shrimp-side-vermicelli", name: "粉丝", amount: "1把", group: "side", note: "提前泡软" },
      { id: "garlic-shrimp-side-garlic", name: "蒜蓉", amount: "4勺", group: "side", note: "炒香一半" },
    ],
    seasonings: [
      { id: "garlic-shrimp-season-soy", name: "蒸鱼豉油", amount: "2勺", group: "seasoning", note: "提鲜" },
      { id: "garlic-shrimp-season-oil", name: "热油", amount: "1勺", group: "seasoning", note: "激香" },
    ],
    steps: [
      {
        id: "garlic-shrimp-step-01",
        title: "处理鲜虾",
        description: "鲜虾开背去虾线，粉丝泡软铺底。",
        duration: "8 分钟",
        icon: ChefHat,
        tips: "开背后更容易入味。",
      },
      {
        id: "garlic-shrimp-step-02",
        title: "铺蒜蓉上锅",
        description: "蒜蓉铺在虾背上，大火蒸熟。",
        duration: "6 分钟",
        icon: CookingPot,
        tips: "虾变红即可，避免过老。",
      },
      {
        id: "garlic-shrimp-step-03",
        title: "淋热油收香",
        description: "撒葱花，淋入热油和蒸鱼豉油。",
        duration: "1 分钟",
        icon: Flame,
        tips: "热油能激发蒜香和葱香。",
      },
    ],
    savedCount: 274,
  },
  {
    id: "recipe-pan-fried-ribbonfish",
    slug: "pan-fried-ribbonfish",
    titleZh: "香煎带鱼",
    titleEn: "Pan-fried Ribbonfish",
    stationId: "station-seafood",
    coverType: "illustration",
    timeMinutes: 26,
    difficulty: "中等",
    flavor: "咸香酥脆",
    mainIngredient: "带鱼 · 姜片 · 葱段 · 椒盐",
    tags: ["外酥里嫩", "咸香下饭", "家常海味"],
    description: "带鱼煎至两面金黄，外层微酥，鱼肉细嫩，适合家常晚餐。",
    ingredients: [
      { id: "ribbonfish-main-fish", name: "带鱼", amount: "400g", group: "main", note: "切段擦干" },
      { id: "ribbonfish-side-ginger", name: "姜片", amount: "6片", group: "side", note: "去腥" },
      { id: "ribbonfish-side-scallion", name: "葱段", amount: "适量", group: "side", note: "增香" },
    ],
    seasonings: [
      { id: "ribbonfish-season-salt", name: "盐", amount: "适量", group: "seasoning", note: "腌底味" },
      { id: "ribbonfish-season-pepper", name: "椒盐", amount: "1勺", group: "seasoning", note: "出锅撒" },
    ],
    steps: [
      {
        id: "ribbonfish-step-01",
        title: "腌制带鱼",
        description: "带鱼用盐、姜片腌制去腥。",
        duration: "10 分钟",
        icon: ChefHat,
        tips: "下锅前擦干表面更容易煎脆。",
      },
      {
        id: "ribbonfish-step-02",
        title: "煎至金黄",
        description: "中火煎至两面金黄定型。",
        duration: "10 分钟",
        icon: Flame,
        tips: "不要频繁翻动，避免破皮。",
      },
      {
        id: "ribbonfish-step-03",
        title: "撒椒盐出锅",
        description: "撒椒盐和葱段，趁热装盘。",
        duration: "1 分钟",
        icon: Star,
        tips: "趁热吃口感最好。",
      },
    ],
    savedCount: 221,
  },
];

export const recipeDetails: Record<string, Recipe> = {
  "kung-pao-chicken": {
    ...(recipes.find((recipe) => recipe.slug === "kung-pao-chicken") as Recipe),
    difficulty: "中等",
    flavor: "微辣",
  },
};

export const kungPaoRecipe = recipeDetails["kung-pao-chicken"];

export const chickenStationRecipes = recipes.filter(
  (recipe) => recipe.stationId === "station-chicken",
);

export function getStationBySlug(slug: string) {
  return stations.find((station) => station.slug === slug) ?? null;
}

export function getRecipesByStationSlug(slug: string) {
  const station = getStationBySlug(slug);

  if (!station) {
    return [];
  }

  return recipes.filter((recipe) => recipe.stationId === station.id);
}

export function getRecipeBySlug(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? null;
}

export function getRecipeDetailBySlug(slug: string) {
  const recipe = recipeDetails[slug] ?? getRecipeBySlug(slug);

  if (!recipe) {
    return null;
  }

  return {
    ...recipe,
    ingredients:
      recipe.ingredients.length > 0
        ? recipe.ingredients
        : [
            {
              id: `${recipe.slug}-fallback-main`,
              name: recipe.mainIngredient.split(" · ")[0] ?? "主食材",
              amount: "适量",
              group: "main" as const,
              note: "按口味准备",
            },
          ],
    seasonings:
      recipe.seasonings.length > 0
        ? recipe.seasonings
        : [
            {
              id: `${recipe.slug}-fallback-seasoning`,
              name: "基础调味",
              amount: "适量",
              group: "seasoning" as const,
              note: "按口味调整",
            },
          ],
    steps:
      recipe.steps.length > 0
        ? recipe.steps
        : [
            {
              id: `${recipe.slug}-fallback-step-01`,
              title: "准备食材",
              description: `准备${recipe.mainIngredient}，并处理成适合烹饪的大小。`,
              duration: "5 分钟",
              icon: ChefHat,
              tips: "提前整理好食材，烹饪时更顺手。",
            },
            {
              id: `${recipe.slug}-fallback-step-02`,
              title: "加热烹饪",
              description: "根据食材特性加热至成熟，保持主要风味。",
              duration: `${Math.max(recipe.timeMinutes - 8, 8)} 分钟`,
              icon: CookingPot,
              tips: "中途观察状态，避免过火。",
            },
            {
              id: `${recipe.slug}-fallback-step-03`,
              title: "调味出锅",
              description: "最后调整味道，装盘后趁热享用。",
              duration: "3 分钟",
              icon: Star,
              tips: "出锅前再确认咸淡。",
            },
          ],
  };
}

export const recentRecipes: RecentRecipe[] = [
  { title: recipes[1].titleZh, subtitle: "酸甜微辣 · 25 分钟" },
  { title: recipes[0].titleZh, subtitle: "浓郁下饭 · 35 分钟" },
  { title: "番茄牛腩", subtitle: "柔和酸香 · 90 分钟" },
];

export const loadingSteps: LoadingStep[] = [
  { label: "正在读取视频内容", active: true },
  { label: "正在提取视频语音", active: true },
  { label: "正在识别食材和做法", active: true },
  { label: "正在整理菜谱", active: true },
  { label: "正在生成收藏票根", active: false },
];
