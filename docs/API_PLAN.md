# Recipe Ticket API Plan

本文件规划未来前端需要的 API（数据接口，用来让前端和后端交换数据）。本轮不实现 API、不接 Supabase、不创建真实数据库连接。

## 设计原则

- API 先覆盖当前 MVP 已有页面和核心闭环。
- 当前 `mockData` 和 `localStorage` 未来逐步替换为 API 数据。
- 前端页面结构暂时不变，先保证数据来源可以平滑切换。
- 生成任务、AI 解析、小红书 / 抖音解析放在后续阶段实现。

## 1. 获取所有驿站

`GET /api/stations`

用途：获取风味地图里的所有分类 / 驿站。

请求参数：无。

返回数据大概结构：

```json
{
  "stations": [
    {
      "id": "station-chicken",
      "slug": "chicken",
      "name_zh": "羽禽驿站",
      "name_en": "Poultry Station",
      "description": "探索鸡肉的 100+ 种可能",
      "category_type": "poultry",
      "icon": "bird",
      "accent_color": "sage",
      "recipe_count": 128,
      "average_time": "25 分钟",
      "difficulty": "简单",
      "sort_order": 1
    }
  ]
}
```

当前前端对应功能：
- `/flavor-map` 风味地图三张主体票根。
- 底部 Tab 进入风味地图后的分类展示。

## 2. 获取某个驿站下的菜谱

`GET /api/stations/:slug/recipes`

用途：读取某个驿站分类下的菜谱列表。

请求参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| slug | path | 驿站标识，例如 `chicken`、`pasture`、`seafood` |

返回数据大概结构：

```json
{
  "station": {
    "id": "station-chicken",
    "slug": "chicken",
    "name_zh": "羽禽驿站",
    "name_en": "Poultry Station"
  },
  "recipes": [
    {
      "id": "recipe-kung-pao-chicken",
      "slug": "kung-pao-chicken",
      "title_zh": "宫保鸡丁",
      "title_en": "Kung Pao Chicken",
      "description": "酸甜微辣，香脆可口。",
      "time_minutes": 25,
      "difficulty": "简单",
      "flavor": "川味",
      "main_ingredient": "鸡肉 · 花生 · 干辣椒 · 花椒",
      "cover_type": "illustration"
    }
  ]
}
```

当前前端对应功能：
- `/station/[slug]` 动态 Station 页面。
- Station 页面里点击菜谱进入详情页。

## 3. 获取菜谱详情

`GET /api/recipes/:slug`

用途：获取一道菜谱的完整详情，包括核心信息、食材、调料和步骤。

请求参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| slug | path | 菜谱标识，例如 `kung-pao-chicken` |

返回数据大概结构：

```json
{
  "recipe": {
    "id": "recipe-kung-pao-chicken",
    "slug": "kung-pao-chicken",
    "station_id": "station-chicken",
    "title_zh": "宫保鸡丁",
    "title_en": "Kung Pao Chicken",
    "description": "酸甜微辣，香脆可口。",
    "source_url": null,
    "source_platform": "mock",
    "time_minutes": 25,
    "difficulty": "简单",
    "flavor": "川味",
    "main_ingredient": "鸡肉 · 花生 · 干辣椒 · 花椒",
    "saved_count": 523,
    "cover_type": "illustration",
    "is_generated": false,
    "ingredients": [
      {
        "id": "kung-main-chicken",
        "name": "鸡腿肉",
        "amount": "300g",
        "group_type": "main",
        "note": "切丁后腌制",
        "sort_order": 1
      }
    ],
    "steps": [
      {
        "id": "kung-step-01",
        "title": "腌制鸡肉",
        "description": "鸡腿肉切丁，加入生抽、料酒、淀粉抓匀腌制",
        "duration": "3 分钟",
        "tips": "鸡丁不要切太大，方便快速成熟。",
        "sort_order": 1
      }
    ],
    "is_favorite": false
  }
}
```

当前前端对应功能：
- `/recipe/[slug]` 菜谱详情页。
- 生成流程最终进入的 `/recipe/kung-pao-chicken`。
- 收藏按钮需要 `is_favorite` 判断当前用户是否已收藏。

## 4. 创建生成任务

`POST /api/generation-tasks`

用途：用户粘贴链接后，创建一个后端生成任务。

请求参数：

```json
{
  "source_url": "https://example.com/video",
  "source_platform": "unknown"
}
```

返回数据大概结构：

```json
{
  "task": {
    "id": "task-uuid",
    "source_url": "https://example.com/video",
    "source_platform": "unknown",
    "status": "pending",
    "generated_recipe_id": null,
    "error_message": null,
    "created_at": "2026-06-29T00:00:00.000Z",
    "completed_at": null
  }
}
```

当前前端对应功能：
- `/` 首页粘贴链接。
- 点击“生成菜谱”后从当前 `saveMockGenerationTask` 切换为创建真实任务。

## 5. 获取生成任务状态

`GET /api/generation-tasks/:id`

用途：Loading 页面轮询生成任务状态，判断是否完成或失败。

请求参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| id | path | 生成任务 ID |

返回数据大概结构：

```json
{
  "task": {
    "id": "task-uuid",
    "status": "completed",
    "generated_recipe_id": "recipe-kung-pao-chicken",
    "generated_recipe_slug": "kung-pao-chicken",
    "error_message": null,
    "created_at": "2026-06-29T00:00:00.000Z",
    "completed_at": "2026-06-29T00:00:08.000Z"
  }
}
```

当前前端对应功能：
- `/loading` 生成中页面。
- 当前模拟跳转 `/recipe/kung-pao-chicken`，未来改为根据任务结果跳转。

## 6. 收藏菜谱

`POST /api/favorites`

用途：把一道菜加入当前用户收藏。

请求参数：

```json
{
  "recipe_id": "recipe-kung-pao-chicken"
}
```

返回数据大概结构：

```json
{
  "favorite": {
    "id": "favorite-uuid",
    "recipe_id": "recipe-kung-pao-chicken",
    "created_at": "2026-06-29T00:00:00.000Z"
  }
}
```

当前前端对应功能：
- `/recipe/[slug]` 菜谱详情页“加入收藏”按钮。

## 7. 取消收藏

`DELETE /api/favorites/:recipeId`

用途：从当前用户收藏中移除一道菜。

请求参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| recipeId | path | 菜谱 ID |

返回数据大概结构：

```json
{
  "success": true,
  "recipe_id": "recipe-kung-pao-chicken"
}
```

当前前端对应功能：
- `/recipe/[slug]` 菜谱详情页“已收藏”状态再次点击取消。
- 未来收藏页也可以增加移除收藏能力。

## 8. 获取我的收藏

`GET /api/favorites`

用途：获取当前用户收藏的菜谱列表。

请求参数：无。用户身份未来由登录态确定。

返回数据大概结构：

```json
{
  "favorites": [
    {
      "id": "favorite-uuid",
      "created_at": "2026-06-29T00:00:00.000Z",
      "recipe": {
        "id": "recipe-kung-pao-chicken",
        "slug": "kung-pao-chicken",
        "title_zh": "宫保鸡丁",
        "title_en": "Kung Pao Chicken",
        "description": "酸甜微辣，香脆可口。",
        "time_minutes": 25,
        "difficulty": "简单",
        "flavor": "川味",
        "main_ingredient": "鸡肉 · 花生 · 干辣椒 · 花椒"
      }
    }
  ]
}
```

当前前端对应功能：
- `/favorites` 我的收藏页。
- 当前 `getFavoriteRecipeSlugs` 未来替换为这个接口。

## 9. 获取我的本地 / 用户数据概览

`GET /api/me/summary`

用途：获取我的页需要的轻量数据汇总。

请求参数：无。用户身份未来由登录态确定。

返回数据大概结构：

```json
{
  "summary": {
    "favorite_count": 1,
    "generated_count": 1,
    "recent_generated": {
      "id": "recipe-kung-pao-chicken",
      "slug": "kung-pao-chicken",
      "title_zh": "宫保鸡丁"
    },
    "recent_favorite": {
      "id": "recipe-kung-pao-chicken",
      "slug": "kung-pao-chicken",
      "title_zh": "宫保鸡丁"
    },
    "mode": "Recipe Ticket MVP",
    "data_source": "Supabase"
  }
}
```

当前前端对应功能：
- `/me` 我的页。
- 当前 `localStorage` 统计未来替换为这个接口。

## 接入顺序建议

1. 先接 `GET /api/stations` 和 `GET /api/stations/:slug/recipes`，替换风味地图和 Station 数据。
2. 再接 `GET /api/recipes/:slug`，替换菜谱详情数据。
3. 再接收藏相关 API，替换 `localStorage favorites`。
4. 最后接生成任务 API 和 AI 解析，替换 `mockGenerationTask`。

