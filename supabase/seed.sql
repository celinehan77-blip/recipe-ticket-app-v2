-- Recipe Ticket seed data
-- Run this file after schema.sql.
-- It inserts the current mockData baseline without connecting the frontend.

insert into public.stations (
  slug,
  name_zh,
  name_en,
  description,
  category_type,
  icon,
  accent_color,
  recipe_count,
  average_time,
  difficulty,
  sort_order
) values
  (
    'chicken',
    '羽禽驿站',
    'Poultry Station',
    '探索鸡肉的 100+ 种可能',
    'poultry',
    'bird',
    'sage',
    128,
    25,
    '简单',
    1
  ),
  (
    'pasture',
    '牧场驿站',
    'Pasture Station',
    '从牛肉到羊肉的浓郁风味',
    'pasture',
    'beef',
    'caramel',
    96,
    40,
    '中等',
    2
  ),
  (
    'seafood',
    '海味码头',
    'Seafood Harbor',
    '属于海鲜的鲜甜旅程',
    'seafood',
    'fish',
    'blue',
    84,
    30,
    '简单',
    3
  )
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'kung-pao-chicken',
  stations.id,
  '宫保鸡丁',
  'Kung Pao Chicken',
  '酸甜微辣，香脆可口。鸡肉嫩滑，花生香脆，干辣椒与花椒的香气在口中层层绽放。',
  'mock',
  25,
  '简单',
  '川味',
  '鸡肉 · 花生 · 干辣椒 · 花椒',
  523,
  'illustration',
  false
from public.stations
where stations.slug = 'chicken'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'huang-men-chicken',
  stations.id,
  '黄焖鸡',
  'Braised Chicken',
  '鸡腿肉与香菇慢焖入味，汤汁浓郁，适合拌饭。',
  'mock',
  35,
  '简单',
  '鲁味',
  '鸡腿肉 · 香菇 · 青椒',
  318,
  'illustration',
  false
from public.stations
where stations.slug = 'chicken'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'spicy-chicken',
  stations.id,
  '辣子鸡',
  'Spicy Chicken',
  '鸡块炸香后与大量干辣椒翻炒，干香麻辣。',
  'mock',
  30,
  '中等',
  '川味',
  '鸡腿肉 · 干辣椒 · 花椒',
  286,
  'illustration',
  false
from public.stations
where stations.slug = 'chicken'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'beef-stew',
  stations.id,
  '土豆炖牛肉',
  'Beef Stew',
  '牛肉炖至软烂，土豆吸满汤汁，适合慢慢享用。',
  'mock',
  90,
  '中等',
  '家常',
  '牛肉 · 土豆 · 胡萝卜',
  412,
  'illustration',
  false
from public.stations
where stations.slug = 'pasture'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'black-pepper-beef',
  stations.id,
  '黑椒牛柳',
  'Black Pepper Beef',
  '牛柳滑嫩入味，黑椒香气明亮，彩椒和洋葱带出清甜。',
  'mock',
  28,
  '中等',
  '黑椒香',
  '牛里脊 · 彩椒 · 洋葱 · 黑胡椒',
  248,
  'illustration',
  false
from public.stations
where stations.slug = 'pasture'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'tomato-beef-brisket',
  stations.id,
  '番茄牛腩',
  'Tomato Beef Brisket',
  '番茄炖出柔和酸甜，牛腩软烂，汤汁适合拌饭或配面。',
  'mock',
  85,
  '中等',
  '酸甜浓郁',
  '牛腩 · 番茄 · 土豆 · 洋葱',
  356,
  'illustration',
  false
from public.stations
where stations.slug = 'pasture'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'steamed-fish',
  stations.id,
  '清蒸鱼',
  'Steamed Fish',
  '保留鱼肉鲜甜，葱姜去腥，热油激发香气。',
  'mock',
  20,
  '简单',
  '鲜香',
  '鲜鱼 · 葱姜 · 蒸鱼豉油',
  196,
  'illustration',
  false
from public.stations
where stations.slug = 'seafood'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'garlic-vermicelli-shrimp',
  stations.id,
  '蒜蓉粉丝虾',
  'Garlic Vermicelli Shrimp',
  '鲜虾铺在粉丝上蒸熟，蒜蓉酱汁渗入粉丝，鲜香轻盈。',
  'mock',
  22,
  '简单',
  '蒜香鲜甜',
  '鲜虾 · 粉丝 · 蒜蓉 · 葱花',
  274,
  'illustration',
  false
from public.stations
where stations.slug = 'seafood'
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  station_id,
  title_zh,
  title_en,
  description,
  source_platform,
  time_minutes,
  difficulty,
  flavor,
  main_ingredient,
  saved_count,
  cover_type,
  is_generated
)
select
  'pan-fried-ribbonfish',
  stations.id,
  '香煎带鱼',
  'Pan-fried Ribbonfish',
  '带鱼煎至两面金黄，外层微酥，鱼肉细嫩，适合家常晚餐。',
  'mock',
  26,
  '中等',
  '咸香酥脆',
  '带鱼 · 姜片 · 葱段 · 椒盐',
  221,
  'illustration',
  false
from public.stations
where stations.slug = 'seafood'
on conflict (slug) do nothing;

-- Full ingredients and seasonings for 宫保鸡丁.

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, '鸡腿肉', '300g', 'main', '切丁后腌制', 1
from public.recipes
where recipes.slug = 'kung-pao-chicken'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = 'main'
      and ingredients.sort_order = 1
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('花生', '50g', 'side', '增香酥脆', 1),
    ('干辣椒', '8个', 'side', '香辣提味', 2),
    ('葱段', '20g', 'side', '清香提鲜', 3),
    ('花椒', '1小勺', 'side', '麻香点睛', 4),
    ('生抽', '2勺', 'seasoning', '咸鲜底味', 1),
    ('老抽', '1勺', 'seasoning', '辅助上色', 2),
    ('糖', '1勺', 'seasoning', '平衡酸辣', 3),
    ('盐', '1勺', 'seasoning', '按口味调整', 4),
    ('淀粉', '1勺', 'seasoning', '锁住肉汁', 5),
    ('料酒', '1勺', 'seasoning', '去腥增香', 6)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'kung-pao-chicken'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

-- Simplified ingredients for the other initial recipes.

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('鸡腿肉', '350g', 'main', '切块', 1),
    ('香菇', '6朵', 'side', '增香', 1),
    ('青椒', '1个', 'side', '出锅前加入', 2),
    ('生抽', '2勺', 'seasoning', '调味', 1),
    ('黄豆酱', '1勺', 'seasoning', '增加酱香', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'huang-men-chicken'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('鸡腿肉', '350g', 'main', '切小块', 1),
    ('干辣椒', '一碗', 'side', '营造香辣底味', 1),
    ('花椒', '1小把', 'side', '增加麻香', 2),
    ('盐', '适量', 'seasoning', '调味', 1),
    ('料酒', '1勺', 'seasoning', '去腥', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'spicy-chicken'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('牛腩', '500g', 'main', '切块焯水', 1),
    ('土豆', '2个', 'side', '切滚刀块', 1),
    ('胡萝卜', '1根', 'side', '增加甜味', 2),
    ('生抽', '2勺', 'seasoning', '调味', 1),
    ('八角', '1个', 'seasoning', '增香', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'beef-stew'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('牛里脊', '300g', 'main', '逆纹切条', 1),
    ('彩椒', '1个', 'side', '切条', 1),
    ('洋葱', '半个', 'side', '增加甜味', 2),
    ('黑胡椒', '1勺', 'seasoning', '现磨更香', 1),
    ('生抽', '1勺', 'seasoning', '调味', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'black-pepper-beef'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('牛腩', '500g', 'main', '焯水去腥', 1),
    ('番茄', '3个', 'side', '炒出沙', 1),
    ('土豆', '1个', 'side', '增加厚度', 2),
    ('番茄膏', '1勺', 'seasoning', '加强酸甜', 1),
    ('生抽', '2勺', 'seasoning', '调味', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'tomato-beef-brisket'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('鲜鱼', '1条', 'main', '处理干净', 1),
    ('葱丝', '适量', 'side', '出锅装饰', 1),
    ('姜片', '6片', 'side', '去腥', 2),
    ('蒸鱼豉油', '2勺', 'seasoning', '提鲜', 1),
    ('热油', '1勺', 'seasoning', '激香', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'steamed-fish'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('鲜虾', '12只', 'main', '开背去虾线', 1),
    ('粉丝', '1把', 'side', '提前泡软', 1),
    ('蒜蓉', '4勺', 'side', '炒香一半', 2),
    ('蒸鱼豉油', '2勺', 'seasoning', '提鲜', 1),
    ('热油', '1勺', 'seasoning', '激香', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'garlic-vermicelli-shrimp'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

insert into public.ingredients (recipe_id, name, amount, group_type, note, sort_order)
select recipes.id, seed.name, seed.amount, seed.group_type, seed.note, seed.sort_order
from public.recipes
cross join (
  values
    ('带鱼', '400g', 'main', '切段擦干', 1),
    ('姜片', '6片', 'side', '去腥', 1),
    ('葱段', '适量', 'side', '增香', 2),
    ('盐', '适量', 'seasoning', '腌底味', 1),
    ('椒盐', '1勺', 'seasoning', '出锅撒', 2)
) as seed(name, amount, group_type, note, sort_order)
where recipes.slug = 'pan-fried-ribbonfish'
  and not exists (
    select 1 from public.ingredients
    where ingredients.recipe_id = recipes.id
      and ingredients.group_type = seed.group_type
      and ingredients.sort_order = seed.sort_order
      and ingredients.name = seed.name
  );

-- Full recipe steps for 宫保鸡丁.

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, seed.title, seed.description, seed.duration, seed.tips, seed.sort_order
from public.recipes
cross join (
  values
    ('腌制鸡肉', '鸡腿肉切丁，加入生抽、料酒、淀粉抓匀腌制', '3 分钟', '鸡丁不要切太大，方便快速成熟。', 1),
    ('调制宫保汁', '生抽、老抽、糖、醋、料酒、淀粉、清水调匀', '2 分钟', '提前调好汁，避免炒制时手忙脚乱。', 2),
    ('爆香干辣椒和花椒', '热油下花椒炸香，加入干辣椒段炒出香味', '1 分钟', '火不要太大，避免干辣椒发苦。', 3),
    ('下鸡丁翻炒', '倒入鸡丁快速翻炒至变色，保持肉质嫩滑', '5 分钟', '快速翻炒，鸡肉刚变色即可继续下一步。', 4),
    ('加入花生收汁出锅', '倒入宫保汁和花生，淋入锅中翻炒均匀即可', '2 分钟', '花生最后加入，口感更脆。', 5)
) as seed(title, description, duration, tips, sort_order)
where recipes.slug = 'kung-pao-chicken'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = seed.sort_order
  );

-- Simplified steps for the other initial recipes.

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, '煎香鸡块', '鸡腿肉下锅煎至微黄。', '5 分钟', '先煎再焖，香气更足。', 1
from public.recipes
where recipes.slug = 'huang-men-chicken'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = 1
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, '炸香鸡块', '鸡块炸至外层微焦。', '8 分钟', '复炸一次口感更干香。', 1
from public.recipes
where recipes.slug = 'spicy-chicken'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = 1
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, '慢炖牛肉', '牛肉加香料炖至软烂。', '70 分钟', '小火慢炖更入味。', 1
from public.recipes
where recipes.slug = 'beef-stew'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = 1
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, seed.title, seed.description, seed.duration, seed.tips, seed.sort_order
from public.recipes
cross join (
  values
    ('腌制牛柳', '牛柳加入生抽、黑胡椒和淀粉抓匀。', '8 分钟', '少量油封住牛肉表面，口感更嫩。', 1),
    ('快炒配菜', '彩椒和洋葱大火快速翻炒至断生。', '3 分钟', '保持脆感，不要炒太久。', 2),
    ('合炒收香', '牛柳回锅，加入黑椒汁翻炒均匀。', '4 分钟', '最后再补黑胡椒，香气更明显。', 3)
) as seed(title, description, duration, tips, sort_order)
where recipes.slug = 'black-pepper-beef'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = seed.sort_order
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, seed.title, seed.description, seed.duration, seed.tips, seed.sort_order
from public.recipes
cross join (
  values
    ('炒香番茄', '番茄和洋葱炒出汁水。', '8 分钟', '番茄炒软后汤底更浓。', 1),
    ('加入牛腩慢炖', '放入牛腩和热水，小火炖至软烂。', '65 分钟', '用热水炖，肉质更稳定。', 2),
    ('加入土豆收汁', '土豆入锅炖至软糯，收至汤汁浓厚。', '12 分钟', '最后按口味补盐。', 3)
) as seed(title, description, duration, tips, sort_order)
where recipes.slug = 'tomato-beef-brisket'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = seed.sort_order
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, '上锅清蒸', '鱼身铺姜片，蒸至刚熟。', '10 分钟', '不要蒸太久，保持鱼肉细嫩。', 1
from public.recipes
where recipes.slug = 'steamed-fish'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = 1
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, seed.title, seed.description, seed.duration, seed.tips, seed.sort_order
from public.recipes
cross join (
  values
    ('处理鲜虾', '鲜虾开背去虾线，粉丝泡软铺底。', '8 分钟', '开背后更容易入味。', 1),
    ('铺蒜蓉上锅', '蒜蓉铺在虾背上，大火蒸熟。', '6 分钟', '虾变红即可，避免过老。', 2),
    ('淋热油收香', '撒葱花，淋入热油和蒸鱼豉油。', '1 分钟', '热油能激发蒜香和葱香。', 3)
) as seed(title, description, duration, tips, sort_order)
where recipes.slug = 'garlic-vermicelli-shrimp'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = seed.sort_order
  );

insert into public.recipe_steps (recipe_id, title, description, duration, tips, sort_order)
select recipes.id, seed.title, seed.description, seed.duration, seed.tips, seed.sort_order
from public.recipes
cross join (
  values
    ('腌制带鱼', '带鱼用盐、姜片腌制去腥。', '10 分钟', '下锅前擦干表面更容易煎脆。', 1),
    ('煎至金黄', '中火煎至两面金黄定型。', '10 分钟', '不要频繁翻动，避免破皮。', 2),
    ('撒椒盐出锅', '撒椒盐和葱段，趁热装盘。', '1 分钟', '趁热吃口感最好。', 3)
) as seed(title, description, duration, tips, sort_order)
where recipes.slug = 'pan-fried-ribbonfish'
  and not exists (
    select 1 from public.recipe_steps
    where recipe_steps.recipe_id = recipes.id
      and recipe_steps.sort_order = seed.sort_order
  );
