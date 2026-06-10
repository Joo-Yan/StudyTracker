# StudyTracker — UI 岗位面试准备 / UI Position Interview Prep

> 项目技术栈：Next.js 15 · React 19 · TypeScript · Tailwind CSS · Radix UI · Framer Motion · Recharts · Zustand · Supabase
>
> Tech stack: Next.js 15 · React 19 · TypeScript · Tailwind CSS · Radix UI · Framer Motion · Recharts · Zustand · Supabase

---

## 一、项目介绍类问题 / Project Introduction

### Q1. 请介绍一下你的项目。/ Tell me about this project.

**中文参考答案：**

StudyTracker 是一个全栈个人生产力平台，将习惯打卡、OKR 目标管理、项目管理、内容库、数据分析和交互式学习中心整合在一个应用中。技术栈是 Next.js 15 + React 19 + TypeScript，UI 层用 Tailwind CSS 和 Radix UI 做无障碍组件，Framer Motion 处理动画，Recharts 做数据可视化，状态管理用 Zustand。整体有 9 个功能模块、25+ 个 REST API 端点，Learn 模块完全客户端化，无需后端。

**English reference:**

StudyTracker is a full-stack personal productivity platform that unifies habit tracking, OKR management, project management, a content library, analytics, and an interactive learn center in one app. The frontend is built with Next.js 15, React 19, TypeScript, Tailwind CSS (utility-first styling), Radix UI (accessible headless components), Framer Motion (animations), and Recharts (data visualization). State is managed via Zustand. The app has 9 feature modules and 25+ REST endpoints; the Learn module is fully client-side with no backend required.

---

### Q2. 为什么选择这些技术栈？/ Why did you choose this tech stack?

**中文参考答案：**

- **Tailwind CSS**：Utility-first 方案让我在不写独立 CSS 文件的情况下维持样式一致性，配合 `cn()`（clsx + tailwind-merge）解决条件类名冲突；暗色模式只需 `dark:` 前缀。
- **Radix UI**：提供无障碍（ARIA）的 headless 组件（Dialog、Select、Dropdown、Tabs 等），我只需关注视觉层，键盘导航和 focus 管理由库负责。
- **Framer Motion**：声明式动画 API，`AnimatePresence` 处理组件挂载/卸载时的过渡，避免了手写 CSS 动画的复杂状态管理。
- **Recharts**：基于 SVG、React 友好，可组合的图表组件，方便定制 tooltip 和颜色主题。
- **Zustand**：相比 Redux 更轻量，Learn 模块的多章节进度、语言切换都用 Zustand + localStorage 持久化，避免了不必要的后端请求。

**English reference:**

- **Tailwind CSS**: Utility-first keeps styles co-located with markup; `cn()` (clsx + tailwind-merge) resolves conditional class conflicts; dark mode is a single `dark:` prefix away.
- **Radix UI**: Provides accessible headless primitives (Dialog, Select, Dropdown, Tabs…). I own the visual layer; keyboard navigation, focus trapping, and ARIA are handled by the library.
- **Framer Motion**: Declarative animation API. `AnimatePresence` manages mount/unmount transitions without manual CSS animation state machines.
- **Recharts**: SVG-based, composable React chart components that are easy to theme and extend with custom tooltips.
- **Zustand**: Lightweight alternative to Redux. The Learn module's chapter progress and language preference are persisted to localStorage through Zustand middleware — no backend round-trips needed.

---

## 二、UI/UX 设计决策 / UI/UX Design Decisions

### Q3. 你是如何处理响应式设计的？/ How did you handle responsive design?

**中文参考答案：**

全站使用 Tailwind 的断点前缀（`sm:` / `md:` / `lg:`）做移动优先设计。布局上用 CSS Grid 和 Flexbox：Dashboard 的卡片网格在移动端是单列，在 `md:` 以上变为 2-3 列。侧边栏在小屏时折叠为抽屉式（由 hamburger 菜单触发，`isMobileMenuOpen` 状态控制），大屏时常驻展示。Recharts 图表全部用 `ResponsiveContainer` 包裹，运行时读取父容器宽度，自动 reflow。Heatmap 在移动端用 `overflow-x: auto` 横向滚动，避免格子被压缩变形。

**English reference:**

The entire app uses Tailwind's breakpoint prefixes (`sm:` / `md:` / `lg:`) with a mobile-first approach. Dashboard card grids are single-column on mobile and expand to 2-3 columns above `md:`. The sidebar collapses to a drawer (triggered by a hamburger menu, controlled by `isMobileMenuOpen` state) on small screens and stays persistent on desktop. All Recharts charts are wrapped in `ResponsiveContainer` to reflow automatically at any viewport width. The habit heatmap uses `overflow-x: auto` on mobile so cells scroll horizontally rather than compress.

---

### Q4. 暗色模式是怎么实现的？/ How did you implement dark mode?

**中文参考答案：**

通过 Tailwind 的 `darkMode: 'class'` 策略，在 `<html>` 根节点挂载 `dark` 类名。颜色 token 在 `globals.css` 中以 CSS 变量定义（`--background`、`--foreground`、`--card` 等），组件只引用这些语义变量而非具体颜色值，所以切换主题只需替换根节点的类名，无需改动组件代码。切换逻辑存在 Zustand store 中，持久化到 localStorage，避免刷新后闪白屏（FOUC）。

**English reference:**

Tailwind's `darkMode: 'class'` strategy is used. Color tokens are defined as CSS custom properties (`--background`, `--foreground`, `--card`, etc.) in `globals.css`. Components reference semantic variable names only, so toggling the `dark` class on `<html>` is sufficient — no component-level changes needed. The theme preference is stored in Zustand and persisted to localStorage to prevent flash-of-unstyled-content (FOUC) on page refresh.

---

### Q5. 描述一个你认为最复杂的 UI 组件。/ Describe the most complex UI component you built.

**推荐回答：GitHub 风格 Heatmap（habit-heatmap.tsx）**

**中文参考答案：**

Habit Heatmap 是比较有挑战性的。需要解决：

1. **数据转换**：把后端返回的 `{ date, completed }` 日志数组转换成按周分组的二维矩阵（行 = 星期几，列 = 第几周）。
2. **CSS Grid 渲染**：每个格子颜色按 `completed` 状态分级（`opacity-20` / `opacity-50` / `opacity-80` / 完整色）。
3. **Tooltip**：悬停时用 Radix Tooltip 展示具体日期和打卡状态。
4. **列对齐偏移**：计算"今天是周几"来决定起始列的偏移量，确保 Day-of-week 标签与格子列完全对齐——这是最容易出 bug 的地方。
5. **响应式截断**：在窄屏时动态减少显示的周数，防止溢出。

最棘手的是列对齐：`getDay()` 返回 0（周日），而我希望以周一为起始，`(day + 6) % 7` 才能正确映射。差一格会导致整列错位。

**English reference:**

The habit heatmap was the most challenging. I had to:

1. **Data transformation**: Transform `{ date, completed }` log arrays from the API into a 2D week-matrix (rows = day-of-week, columns = week index).
2. **CSS Grid rendering**: Render each cell with four opacity tiers based on completion state (`opacity-20` / `opacity-50` / `opacity-80` / full color).
3. **Tooltip**: Show a Radix Tooltip on hover with the specific date and completion status.
4. **Column alignment offset**: Compute the starting-column offset from the current day-of-week so day labels align correctly with grid columns — the most bug-prone part.
5. **Responsive truncation**: Dynamically reduce visible week count on narrow viewports to prevent overflow.

The trickiest issue: `getDay()` returns 0 for Sunday, but I wanted Monday as week-start. The fix was `(day + 6) % 7`. One cell off would misalign the entire column.

---

### Q6. 你怎么做组件的可复用性设计？/ How did you design for component reusability?

**中文参考答案：**

项目在 `src/components/ui/` 维护了一套基础组件（Button、Badge、Card、Input、Select 等），通过 `class-variance-authority (cva)` 定义 variant 和 size 变体，`cn()` 合并外部传入的 className。业务组件（如 HabitCard）只组合这些基础组件，不自己实现底层样式逻辑。Dialog 封装成各模块自己的 `CreateXxxDialog`，内部复用同一套 Form + Input 模式。Learn 模块的章节组件是组合式 DSL：`SectionBlock`、`KeyConcept`、`AnalogyCard`、`CodeViewer`、`Quiz` 组合使用，章节作者不需要写原始 JSX。

**English reference:**

The `src/components/ui/` directory holds base primitives (Button, Badge, Card, Input, Select…) built with `class-variance-authority (cva)` for variant/size props and `cn()` for external className merging. Feature components (e.g., HabitCard) compose these primitives rather than re-implementing low-level styles. Dialogs follow a `CreateXxxDialog` pattern per module, all reusing the same Form + Input structure. The Learn module's chapter components form a composable DSL — `SectionBlock`, `KeyConcept`, `AnalogyCard`, `CodeViewer`, `Quiz` — so chapter authors assemble blocks rather than write raw JSX.

---

## 三、状态管理 / State Management

### Q7. 你是如何分层管理状态的？/ How did you layer your state management?

**中文参考答案：**

三层分离：

1. **服务端状态**（数据库数据）：`fetch` + React `useState`/`useEffect`，每个模块组件内管理自己的 loading/error 状态，CRUD 后手动重新 fetch。规模足够时可引入 TanStack Query 替代。
2. **局部 UI 状态**：弹窗开关、tab 选中、筛选条件等用组件内 `useState`，不上提。
3. **全局持久化状态**：Learn 模块的章节进度和语言偏好、暗色模式偏好用 Zustand store + `persist` middleware 存入 localStorage，跨会话保留。

**English reference:**

Three distinct layers:

1. **Server state** (database data): `fetch` + React `useState`/`useEffect` per module component, with local loading/error state; manual re-fetch after mutations. TanStack Query would be the next step at scale.
2. **Local UI state**: Modal open/close, active tab, filter values — component-level `useState`, not hoisted.
3. **Global persisted state**: Learn module progress and language preference, dark mode setting — Zustand store with `persist` middleware to localStorage, survives page refresh.

---

### Q8. Zustand 相比 Redux 的优势是什么？/ What advantages does Zustand have over Redux?

**中文参考答案：**

Zustand 的 store 是一个普通函数，没有 reducer / action type / dispatch 模板代码。Learn 模块的整个 store（进度追踪 + 语言切换 + localStorage 同步）大约 30 行。`persist` middleware 一行代码实现持久化。选择器是直接解构，不需要 `mapStateToProps`。对这个项目体量，Redux 的模板代码会显著增加维护负担，而且 Zustand 的 devtools 集成同样完善。

**English reference:**

Zustand defines stores as plain functions — no reducers, action types, or dispatch boilerplate. The Learn module's entire store (progress tracking, language toggle, localStorage sync) fits in ~30 lines. Zustand's `persist` middleware adds localStorage persistence in one line. Selectors are plain destructuring — no `mapStateToProps`. For this project's scale, Redux would have added significant boilerplate without architectural benefit, and Zustand's devtools integration is equally solid.

---

## 四、性能优化 / Performance

### Q9. 你做了哪些前端性能优化？/ What frontend performance optimizations did you make?

**中文参考答案：**

1. **防抖（Debounce）**：Life Compass 自动保存用 300ms debounce，避免每次击键触发 API 请求。
2. **条件渲染**：Analytics 页面的图表只在 tab 激活时渲染，避免首屏挂载所有 Recharts 实例。
3. **动态导入**：Learn 模块每个章节用 `next/dynamic` 懒加载，初始 bundle 只包含当前章节，其余按需拆分。
4. **客户端化**：Learn 模块完全静态，无 API 请求，所有交互首屏后即时响应。
5. **Tailwind Purge**：生产构建只输出用到的 class，CSS bundle 极小。
6. **touch-action**：移动端习惯打卡按钮加 `touch-action: manipulation`，消除 iOS 300ms 点击延迟，避免双击触发问题。

**English reference:**

1. **Debounce**: Life Compass auto-save uses a 300ms debounce to prevent per-keystroke API calls.
2. **Conditional rendering**: Analytics charts render only when their tab is active, avoiding mounting all Recharts instances on initial load.
3. **Dynamic imports**: Each Learn module chapter uses `next/dynamic` for lazy loading — only the current chapter is in the initial bundle.
4. **Client-side isolation**: The Learn module is fully static — no API calls — so all interactions after first load are instant.
5. **Tailwind Purge**: Production builds only emit used utility classes, keeping the CSS bundle minimal.
6. **touch-action**: Habit completion buttons use `touch-action: manipulation` to eliminate the 300ms iOS tap delay and prevent double-fire on some browsers.

---

## 五、无障碍与交互体验 / Accessibility & Interaction

### Q10. 你是如何保证 UI 的无障碍性的？/ How did you ensure UI accessibility?

**中文参考答案：**

主要依赖 Radix UI 的 headless 组件，内置：键盘导航（Tab/Arrow keys）、Focus trapping（Dialog 打开时焦点锁定在弹窗内，关闭后恢复触发元素焦点）、ARIA 属性（`role`、`aria-label`、`aria-expanded`、`aria-haspopup` 等）、`Escape` 关闭行为。视觉层面，Tailwind 的 `focus-visible:` 变体确保只在键盘导航时显示 focus ring（鼠标点击不显示），两个主题下颜色对比度均符合 WCAG AA。

**English reference:**

The primary mechanism is Radix UI's headless primitives, which provide: keyboard navigation (Tab/Arrow keys), focus trapping inside Dialogs (focus returns to the trigger on close), ARIA attributes (`role`, `aria-label`, `aria-expanded`, `aria-haspopup`…), and Escape-to-close behavior out of the box. Visually, Tailwind's `focus-visible:` variant shows focus rings only during keyboard navigation (not mouse clicks). Color contrast meets WCAG AA in both light and dark themes.

---

### Q11. Framer Motion 在项目中的具体应用场景？/ How did you specifically use Framer Motion?

**中文参考答案：**

1. **页面/模块过渡**：用 `AnimatePresence` + `motion.div` 做模块间淡入淡出，避免硬切换的视觉跳跃。
2. **列表入场/退场**：Idea Board 和 Content Library 卡片新增时 `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }` 入场，删除时退场动画。
3. **进度条**：OKR Key Result 进度条用 `motion.div` 做宽度过渡，数值变化有流畅的视觉反馈。
4. **翻转卡片**：Learn 模块的 flip card 用 Framer Motion 的 3D `rotateY` 动画实现正反面切换。
5. **Sidebar 动画**：移动端侧边栏抽屉用 `x: -100%` → `x: 0` 做滑入效果。

所有动画都是功能性的（表示状态变化），没有纯装饰性的动效。

**English reference:**

1. **Module transitions**: `AnimatePresence` + `motion.div` for fade transitions between modules, preventing hard visual cuts.
2. **List item enter/exit**: Cards in Idea Board and Content Library animate in (`opacity: 0, y: 20` → `opacity: 1, y: 0`) on add, and animate out on delete.
3. **Progress bars**: OKR Key Result progress bars use `motion.div` with width transitions for smooth visual feedback on value changes.
4. **Flip cards**: Learn module flip cards use Framer Motion's 3D `rotateY` for front/back toggling.
5. **Sidebar drawer**: Mobile sidebar uses `x: -100%` → `x: 0` slide-in animation.

Every animation is functional (signals state change) — none are purely decorative.

---

## 六、数据可视化 / Data Visualization

### Q12. Analytics 模块的图表是怎么设计的？/ How did you design the Analytics charts?

**中文参考答案：**

Analytics 模块提供 7/30/90 天时间窗口筛选，后端 `/api/stats?days=30` 返回聚合数据，前端用 Recharts 渲染 6 种图表类型：

- **LineChart**：习惯完成率趋势（每日完成数 / 总习惯数）
- **BarChart**：每周模式热力图（按星期几分组的完成次数）
- **PieChart / RadialBarChart**：OKR 状态分布
- **AreaChart**：内容完成时间线（按类型分色）
- **自定义 CSS Grid Heatmap**：90 天习惯打卡热力图（不用库，自己实现，更灵活）

所有 Tooltip 用 Recharts 的 `content` prop 完全自定义，配合 Tailwind 样式和暗色模式适配。颜色 palette 抽成常量，确保各图表色彩一致。条纹/颜色语义对应业务状态（如 OKR `in_progress` → 蓝色，`completed` → 绿色）。

**English reference:**

The Analytics module offers 7/30/90-day time windows. The `/api/stats?days=30` endpoint returns aggregated data; Recharts renders 6 chart types:

- **LineChart**: Habit completion rate trend (completed / total per day)
- **BarChart**: Weekly pattern heatmap grouped by day-of-week
- **PieChart / RadialBarChart**: OKR status distribution
- **AreaChart**: Content completion timeline colored by type
- **Custom CSS Grid Heatmap**: 90-day habit grid built from scratch (no library — more control, fewer deps)

All tooltips use Recharts' custom `content` prop styled with Tailwind, adapted for dark mode. A shared color palette constant keeps chart colors semantically consistent (e.g., OKR `in_progress` → blue, `completed` → green).

---

## 七、工程实践 / Engineering Practices

### Q13. 你的组件文件结构是怎么组织的？/ How did you organize your component file structure?

**中文参考答案：**

```
src/
  components/
    ui/           # 基础无状态组件（Button, Card, Badge, Input…）
    habits/       # Habit 模块业务组件（HabitCard, CreateHabitDialog, HabitHeatmap）
    okr/          # OKR 模块业务组件
    projects/     # Projects 模块业务组件
    stats/        # Analytics 图表组件
    learn/        # Learn 模块（章节组件、交互组件、i18n 内容）
    shared/       # 跨模块复用（TagFilter, TagInput, AuthGate）
    layout/       # 布局骨架（Sidebar, Header, AppShell）
```

模块边界清晰，不同模块的组件不直接引用彼此，交叉逻辑走 `shared/` 或 API 层。

**English reference:**

Clear module boundaries: feature components live under their own folder and don't directly import from other feature folders. Cross-cutting concerns go through `shared/` or the API layer. `ui/` primitives have no business logic — they're pure presentation.

---

### Q14. TypeScript 在 UI 层是如何发挥作用的？/ How did TypeScript help on the UI layer?

**中文参考答案：**

1. **Props 类型**：所有组件有接口定义，IDE 自动补全，类型不匹配编译报错，减少运行时 bug。
2. **API 响应类型**：Prisma 生成的模型类型直接在前端复用，fetch 拿到的数据类型与 DB schema 保持同步。
3. **Union type 替代魔法字符串**：OKR status、Habit frequency、Content type 等用 TypeScript union 定义，拼写错误编译期即发现。
4. **CVA variant 类型**：`cva` 生成的 variant 类型注入组件 props，调用时 IDE 提示可用的 variant 值，无法传入无效 variant。

**English reference:**

1. **Prop interfaces**: All component props are typed; IDEs autocomplete and TypeScript catches mismatches at compile time.
2. **API response types**: Prisma-generated model types are reused on the frontend, keeping client types in sync with the DB schema automatically.
3. **Union types over magic strings**: OKR status, habit frequency, content type, etc. are TypeScript unions — typos are caught at compile time.
4. **CVA variant types**: `cva`-generated variant types flow into component props, so callers get IDE autocomplete for valid variant values and can't pass invalid ones.

---

## 八、行为/情景类问题 / Behavioral Questions

### Q15. 开发过程中遇到的最大 UI 挑战是什么？/ What was the biggest UI challenge?

**推荐回答：Heatmap 列对齐 + 移动端 touch 事件**

**中文参考答案：**

两个印象深刻的挑战：

**Heatmap 列对齐**：第一次实现时某些月末日期会错位，因为 `getDay()` 返回的 0（周日）和我想要的 Monday-first 周起始冲突。把生成矩阵打印出来对比日历后发现了 off-by-one，`(day + 6) % 7` 解决。这让我意识到日期处理必须有单元测试覆盖边界情况。

**移动端 touch 双击**：iOS Safari 上习惯打卡按钮偶发双击，触发两次日志写入。根因是 300ms 点击延迟机制——浏览器等待判断是否双击。加 `touch-action: manipulation` 告诉浏览器"不考虑双击"，延迟消失，问题解决。

**English reference:**

Two memorable ones:

**Heatmap column alignment**: My first implementation misaligned dates at month boundaries because `getDay()` returns 0 for Sunday, conflicting with my Monday-first week assumption. I printed the generated matrix and compared against a real calendar, found the off-by-one, and fixed it with `(day + 6) % 7`. This reinforced the need for unit tests on date boundary cases.

**Mobile touch double-fire**: On iOS Safari, habit completion buttons occasionally fired twice, writing duplicate logs. The root cause was the 300ms tap delay — the browser waiting to detect a double-tap. Adding `touch-action: manipulation` told the browser to skip the double-tap check, eliminating the delay and the double-fire.

---

### Q16. 如果让你重构这个项目，你会改变什么？/ If you could refactor this project, what would you change?

**中文参考答案：**

1. **引入 TanStack Query**：替换手写的 fetch + useState，获得自动缓存、后台刷新和乐观更新，减少重复 loading/error 代码。
2. **React Hook Form + Zod**：统一表单验证，目前各模块 Dialog 的表单验证是分散的手写逻辑。
3. **Storybook**：为 `ui/` 基础组件建立 Storybook，支持独立开发和视觉回归测试。
4. **测试覆盖**：从一开始写 Vitest 单元测试，Heatmap 日期计算这类逻辑应该有测试守护，手动测试太脆了。

**English reference:**

1. **TanStack Query**: Replace manual fetch + useState with automatic caching, background refresh, and optimistic updates — eliminating redundant loading/error boilerplate.
2. **React Hook Form + Zod**: Centralize form validation; currently each module's Dialog has its own ad-hoc validation logic.
3. **Storybook**: Set up Storybook for `ui/` primitives to enable isolated development and visual regression testing.
4. **Test coverage**: Write Vitest unit tests from day one. Date-calculation logic like the heatmap matrix should be protected by tests — manual testing is too fragile.

---

### Q17. 这个项目体现了你对 UI 开发哪些理解？/ What does this project reflect about your UI development understanding?

**中文参考答案：**

几个核心认知：

- **视觉一致性靠系统，不靠记忆**：颜色 token、spacing scale、组件 variant 必须在设计系统层定义，临时决定会导致不一致蔓延。
- **无障碍是初始设计约束，不是事后补丁**：早期选 Radix UI 就是为了让键盘导航和 ARIA 从一开始就正确，而不是功能完成后再回头修。
- **状态分层很重要**：服务端状态、局部 UI 状态、持久化偏好三类状态的管理策略完全不同，混在一起会带来很多 bug。
- **动画应服务体验，而非炫技**：项目里所有 Framer Motion 动画都是功能性的（表示状态变化、减少视觉跳跃），没有纯装饰性动效。
- **组件边界要清晰**：`ui/` 层不能有业务逻辑，业务组件不能重新发明 UI 原语，`shared/` 是有意识的跨模块边界。

**English reference:**

Key realizations:

- **Visual consistency requires a system, not memory**: Color tokens, spacing scales, and component variants must be defined at the design-system layer — ad-hoc decisions cause inconsistency to spread.
- **Accessibility is a design constraint, not an afterthought**: Choosing Radix UI early meant keyboard navigation and ARIA were correct from day one, not retrofitted after feature completion.
- **State has layers**: Server state, local UI state, and persisted preferences require completely different management strategies — conflating them causes bugs.
- **Animation should serve experience, not show off**: Every Framer Motion animation in this project is functional (signals state changes, softens transitions) — none are decorative.
- **Component boundaries must be deliberate**: `ui/` primitives carry no business logic; feature components don't reinvent UI primitives; `shared/` is the intentional cross-module boundary.

---

## 九、追问应对 / Follow-up Handling

### Q18. 你对 CSS-in-JS 和 Tailwind 的看法？/ What's your view on CSS-in-JS vs Tailwind?

**中文：** CSS-in-JS（styled-components）的优势是动态样式与 JS 完全集成、prop 驱动样式直观；劣势是运行时开销和 SSR 复杂度。Tailwind 构建时生成静态 CSS，无运行时成本，但条件样式依赖 `cva`/`cn()`。对有设计规范的团队项目，Tailwind + CVA 在性能、可预测性和 AI 辅助开发友好度上更优；对需要高度动态主题的产品，CSS-in-JS 更合适。

**English:** CSS-in-JS (styled-components) excels at prop-driven dynamic styles fully integrated with JS, but has runtime overhead and SSR complexity. Tailwind generates static CSS at build time — zero runtime cost — though conditional styles rely on `cva`/`cn()`. For team projects with a design system, Tailwind + CVA wins on performance, predictability, and AI-tooling friendliness. For products needing highly dynamic runtime theming, CSS-in-JS is more appropriate.

---

### Q19. 你怎么看待 AI 辅助开发？/ What's your take on AI-assisted development?

**中文：** AI 工具极大加速了样板代码生成和方案探索，但理解代码在做什么、为什么这么做、如何 debug 仍然是开发者的核心责任。这个项目我通过 AI 快速搭建骨架，但每个核心决策（架构选型、组件设计、状态分层）都是理解权衡后做出的判断。Heatmap 的 bug 也是我自己 debug 的——AI 生成代码不等于 AI 负责正确性。AI 是放大器，不是替代品。

**English:** AI tools significantly accelerated boilerplate generation and solution exploration, but understanding *what* the code does, *why*, and *how to debug it* remains the developer's core responsibility. In this project, AI helped me scaffold quickly, but every key decision — architecture, component design, state layering — was a judgment call I made after understanding the trade-offs. The heatmap bug was mine to debug — AI-generated code doesn't mean AI-guaranteed correctness. AI is a force multiplier, not a substitute.

---

### Q20. 下一步你想在这个项目上做什么？/ What's your next step for this project?

**中文：** 三个方向：① 引入 TanStack Query 优化数据获取层；② 用 Playwright 做 E2E 测试覆盖核心用户流程（注册 → 创建习惯 → 打卡 → 看 Analytics）；③ 把 Learn 模块做成独立的开源项目，用 MDX 替代硬编码内容，支持社区贡献章节。

**English:** Three directions: ① Introduce TanStack Query to optimize the data-fetching layer. ② Add Playwright E2E tests covering the core user flows (sign up → create habit → log → view analytics). ③ Extract the Learn module as a standalone open-source project, replacing hard-coded content with MDX to enable community-contributed chapters.

---

## 十、快速答题卡 / Quick Reference Cards

| 问题类型 | 推荐切入点 |
|---|---|
| 介绍项目 | 9 模块 → 技术栈选型理由 → 最有挑战的组件（Heatmap） |
| UI 挑战 | Heatmap 列对齐 / iOS touch 双击 / Radix 无障碍 / 暗色模式 token |
| 状态管理 | 三层分离：服务端 fetch / 局部 useState / Zustand 持久化 |
| 性能 | Debounce / 条件渲染 / 动态导入 / Tailwind Purge / touch-action |
| 技术决策 | Radix（无障碍优先）/ Zustand（轻量）/ CVA（variant 类型安全）|
| 反思 | TanStack Query / React Hook Form + Zod / Storybook / Vitest |

| Question Type | Recommended Entry Point |
|---|---|
| Project intro | 9 modules → tech stack rationale → hardest component (Heatmap) |
| UI challenge | Heatmap alignment / iOS touch double-fire / Radix a11y / dark mode tokens |
| State management | 3-layer separation: server fetch / local useState / Zustand + localStorage |
| Performance | Debounce / conditional render / dynamic imports / Tailwind Purge / touch-action |
| Tech decisions | Radix (a11y-first) / Zustand (lightweight) / CVA (variant type safety) |
| Retrospective | TanStack Query / React Hook Form + Zod / Storybook / Vitest |

---

*更新于 2026-04-09 / Updated 2026-04-09*
