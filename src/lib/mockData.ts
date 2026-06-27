import {
  CalendarDays,
  Home,
  Map,
  Star,
  UserRound,
} from "lucide-react";
import type {
  LoadingStep,
  RecentRecipe,
  RecipeDetail,
  Station,
  StationRecipe,
  TabItem,
} from "@/types";

export const tabs: TabItem[] = [
  { key: "home", label: "首页", href: "/", icon: Home },
  { key: "favorites", label: "收藏", href: "/flavor-map", icon: Star },
  { key: "flavor-map", label: "风味地图", href: "/flavor-map", icon: Map },
  { key: "plan", label: "计划", href: "/flavor-map", icon: CalendarDays },
  { key: "profile", label: "我的", href: "/flavor-map", icon: UserRound },
];

export const recentRecipes: RecentRecipe[] = [
  { title: "宫保鸡丁", subtitle: "酸甜微辣 · 25 分钟" },
  { title: "黄焖鸡", subtitle: "浓郁下饭 · 35 分钟" },
  { title: "番茄牛腩", subtitle: "柔和酸香 · 90 分钟" },
];

export const loadingSteps: LoadingStep[] = [
  { label: "收到旅程信息", active: true },
  { label: "提取视频内容", active: true },
  { label: "识别食材与调料", active: true },
  { label: "整理烹饪步骤", active: true },
  { label: "生成收藏卡片", active: false },
];

export const stations: Station[] = [
  {
    id: "chicken",
    stationNo: "01",
    title: "羽禽驿站",
    englishTitle: "Poultry Station",
    subtitle: "探索鸡肉的 100+ 种可能",
    recipes: 128,
    averageTime: "25 分钟",
    difficulty: "简单",
    tone: "sage",
  },
  {
    id: "pasture",
    stationNo: "02",
    title: "牧场驿站",
    englishTitle: "Pasture Station",
    subtitle: "从牛肉到羊肉的浓郁风味",
    recipes: 96,
    averageTime: "40 分钟",
    difficulty: "中等",
    tone: "caramel",
  },
  {
    id: "seafood",
    stationNo: "03",
    title: "海味码头",
    englishTitle: "Seafood Harbor",
    subtitle: "属于海鲜的鲜甜旅程",
    recipes: 84,
    averageTime: "30 分钟",
    difficulty: "简单",
    tone: "blue",
  },
];

export const kungPaoRecipe: RecipeDetail = {
  no: "01",
  title: "宫保鸡丁",
  englishTitle: "Kung Pao Chicken",
  description:
    "酸甜微辣，香脆可口。鸡肉嫩滑，花生香脆，干辣椒与花椒的香气在口中层层绽放。",
  tag: "川菜经典",
  servings: "2 人份",
  stats: [
    { label: "烹饪时间", value: "25", suffix: "分钟" },
    { label: "难度等级", value: "中等" },
    { label: "口味特点", value: "微辣" },
    { label: "主食材", value: "鸡肉" },
    { label: "收藏人数", value: "523" },
  ],
  ingredientGroups: [
    {
      id: "main",
      title: "主食材",
      items: [{ name: "鸡腿肉", amount: "300g" }],
    },
    {
      id: "side",
      title: "配料",
      items: [
        { name: "花生", amount: "50g" },
        { name: "干辣椒", amount: "8个" },
        { name: "葱段", amount: "20g" },
        { name: "花椒", amount: "1小勺" },
      ],
    },
    {
      id: "seasoning",
      title: "调味料",
      items: [
        { name: "生抽", amount: "2勺" },
        { name: "老抽", amount: "1勺" },
        { name: "糖", amount: "1勺" },
        { name: "盐", amount: "1勺" },
        { name: "淀粉", amount: "1勺" },
        { name: "料酒", amount: "1勺" },
      ],
    },
  ],
  steps: [
    {
      id: "01",
      title: "腌制鸡肉",
      description: "鸡腿肉切丁，加入生抽、料酒、淀粉抓匀腌制",
      minutes: "3 分钟",
    },
    {
      id: "02",
      title: "调制宫保汁",
      description: "生抽、老抽、糖、醋、料酒、淀粉、清水调匀",
      minutes: "2 分钟",
    },
    {
      id: "03",
      title: "爆香干辣椒和花椒",
      description: "热油下花椒炸香，加入干辣椒段炒出香味",
      minutes: "1 分钟",
    },
    {
      id: "04",
      title: "下鸡丁翻炒",
      description: "倒入鸡丁快速翻炒至变色，保持肉质嫩滑",
      minutes: "5 分钟",
    },
    {
      id: "05",
      title: "加入花生收汁出锅",
      description: "倒入宫保汁和花生，淋入锅中翻炒均匀即可",
      minutes: "2 分钟",
    },
  ],
};

export const chickenStationRecipes: StationRecipe[] = [
  {
    id: "huang-men-chicken",
    title: "黄焖鸡",
    englishTitle: "Braised Chicken",
    subtitle: "醇香浓郁 · 汤汁下饭",
    minutes: "35 分钟",
    difficulty: "简单",
    flavor: "鲁味",
    tags: ["鸡肉", "浓郁", "砂锅"],
    ingredients: ["鸡腿肉", "香菇", "青椒"],
  },
  {
    id: "kung-pao-chicken",
    title: "宫保鸡丁",
    englishTitle: "Kung Pao Chicken",
    subtitle: "酸甜微辣 · 花生香脆 · 鸡肉嫩滑",
    minutes: "25 分钟",
    difficulty: "简单",
    flavor: "川味",
    tags: ["鸡肉", "微辣", "下饭菜"],
    ingredients: ["鸡肉", "花生", "干辣椒", "花椒"],
  },
  {
    id: "spicy-chicken",
    title: "辣子鸡",
    englishTitle: "Spicy Chicken",
    subtitle: "麻辣过瘾 · 回味无穷",
    minutes: "30 分钟",
    difficulty: "中等",
    flavor: "川味",
    tags: ["鸡肉", "重辣", "干香"],
    ingredients: ["鸡腿肉", "干辣椒", "花椒"],
  },
];
