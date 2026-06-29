# Supabase 只读接入阶段说明

本阶段只做 Supabase 只读接入第一步。

当前页面仍然保持原来的视觉、布局、配色和动画，只把公共菜谱数据的数据来源改成：

```text
页面 / 组件
→ src/lib/data/
→ 优先读取 Supabase
→ 失败或为空时 fallback 到 mockData
```

页面不会直接 import Supabase client。

## 本轮只读接入了哪些数据

已接入 Supabase 只读读取：

- `stations`
- `recipes`
- `ingredients`
- `recipe_steps`

这些数据用于：

- 风味地图
- Station 页面
- 菜谱详情页
- 搜索页

## fallback 策略

fallback 是备用数据策略。

当前规则：

1. Supabase 未配置时，继续使用 `mockData`。
2. Supabase 查询失败时，继续使用 `mockData`。
3. Supabase 返回空数组时，继续使用 `mockData`。
4. 某道菜缺少完整食材或步骤时，用 `mockData` 补齐。

这样做的目的，是保证演示稳定。即使数据库暂时不可用，前端页面也不会崩溃。

## 当前哪些数据仍然使用 localStorage

以下功能本轮没有切到 Supabase，仍然使用浏览器本地存储 `localStorage`：

- 收藏功能
- 收藏页
- 我的页收藏数量
- 最近生成任务
- 首页生成任务
- loading 完成状态

localStorage 是浏览器本地存储，用来先在当前电脑上保存演示数据。

## 为什么现在不接 favorites

现在不把 favorites 接入 Supabase，原因是：

1. 当前还没有登录系统。
2. Supabase 的 `favorites` 表需要 `user_id`，用来区分是谁收藏的菜谱。
3. 没有登录时直接写云端收藏，容易造成用户数据混乱。
4. 当前 MVP 演示阶段，localStorage 更稳定，也更容易回退。

所以本阶段只读公共数据，不写用户私有数据。

## 为什么现在不接 generation_tasks

`generation_tasks` 后续会用于真实生成任务，例如解析小红书或抖音链接、调用 AI、生成菜谱。

当前还没有接 AI，也没有登录系统，所以生成任务继续保留在 localStorage。

## 后续建议顺序

建议按这个顺序继续：

1. 先验证 `stations / recipes` 只读读取稳定。
2. 再继续验证 recipe detail 的食材和步骤读取稳定。
3. 再做登录。
4. 登录完成后，再把 favorites 切到 Supabase。
5. 最后再做 generation_tasks 和 AI 解析。

这样每一步都能单独验收，出问题时也容易定位。

## 当前阶段完成后的预期

- 页面视觉不变化。
- 原有动效不变化。
- Chicken Station Cover Flow 不变化。
- 首页生成流程不变化。
- 收藏逻辑不变化。
- 数据层已经具备 Supabase 只读能力。
- Supabase 不可用时，页面仍然可以通过 mockData 正常打开。
