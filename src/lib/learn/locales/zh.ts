import type { LocaleContent } from "../i18n";

export const zh: LocaleContent = {
  ui: {
    title: "了解这个网站是如何搭建的",
    subtitle: "一份交互式的 Web 开发入门指南",
    backToApp: "返回应用",
    language: "中",
    nextChapter: "下一章",
    prevChapter: "上一章",
    progress: "学习进度",
    chaptersCompleted: "章已完成",
    markComplete: "标记完成",
    completed: "已完成",
    startLearning: "开始学习",
    overview: "课程概览",
    chapterLabel: "第{n}章",
    expandAll: "全部展开",
    collapseAll: "全部折叠",
    clickToExplore: "点击文件夹展开，点击 ? 查看说明",
    quizTitle: "测试你的知识",
  },
  chapters: {
    "what-is-a-web-app": {
      title: "什么是 Web 应用？",
      description: "通过餐厅类比理解网站的基本组成部分。",
      content: "",
      sections: {
        intro: {
          title: "不只是一个网页",
          body: "当你访问像这样的网站时，你不只是在看一个静态文档——你在与一个 **Web 应用** 互动。你可以登录、创建习惯、追踪进度、查看图表。所有这些都需要多个系统在幕后协同工作。",
        },
        analogy: {
          title: "餐厅类比",
          analogyTitle: "把 Web 应用想象成一家餐厅",
          analogyBody:
            "**餐厅大堂** 就是前端——你看到和交互的部分：菜单、桌子、装潢。**厨房** 就是后端——真正干活的地方：处理订单、烹饪食物、管理食材。**服务员** 就是 API——他们把你的订单从餐桌送到厨房，再把食物端回来给你。",
        },
        threeparts: {
          title: "每个 Web 应用的三个组成部分",
          frontend: {
            term: "前端（客户端）",
            definition:
              "所有在浏览器中运行的东西——你点击的按钮、阅读的文字、看到的颜色和布局。使用 HTML、CSS 和 JavaScript 构建。",
          },
          backend: {
            term: "后端（服务器）",
            definition:
              "运行在远程计算机上的程序，负责处理请求、与数据库通信并返回数据。你永远看不到它的直接界面。",
          },
          api: {
            term: "API（应用程序编程接口）",
            definition:
              "前端和后端之间约定好的沟通语言。当你点击「保存习惯」时，前端通过 API 发送一条消息，后端就知道该如何处理了。",
          },
        },
        howItWorks: {
          title: "当你访问这个网站时发生了什么？",
          steps: [
            "你输入网址或点击链接——浏览器向服务器发送请求",
            "服务器返回 HTML、CSS 和 JavaScript 文件——这就是前端代码",
            "浏览器执行 JavaScript，让页面变得可交互",
            "当你做某个操作（比如勾选一个习惯），前端向 API 发送请求",
            "服务器上的 API 路由处理请求并与数据库通信",
            "数据库存储或检索数据",
            "服务器发回响应，前端更新你看到的界面",
          ],
        },
        realExample: {
          title: "这个网站的真实代码示例",
          body: "这是 StudyTracker 中处理加载习惯数据的真实代码。这就是「厨房」处理「订单」的过程：",
        },
        tip: "不用担心看不懂每一行代码。重要的是理解这个模式：前端请求，后端处理，数据库存储。",
      },
    },
    "project-structure": {
      title: "项目的蓝图：文件结构",
      description: "探索一个真实项目中的文件和文件夹是如何组织的。",
      content: "",
      sections: {
        intro: {
          title: "为什么组织很重要",
          body: "一个 Web 应用可能有成百上千个文件。如果没有良好的组织，查找和修改代码就像在一个没有目录系统的图书馆里找一本特定的书。让我们来看看 StudyTracker 是如何组织代码的。",
        },
        analogy: {
          title: "建筑类比",
          analogyTitle: "把项目想象成一栋建筑",
          analogyBody:
            "**根文件夹** 就是建筑本身。**src/** 是主楼层，所有活动都在这里发生。在 src 里面，**app/** 就像不同的房间（每个页面是一个房间）。**components/** 是家具仓库——可以放在任何房间的可复用部件。**lib/** 是工具间——到处都会用到的工具和辅助函数。",
        },
        overview: {
          title: "顶层视图",
          body: "这是 StudyTracker 项目的顶层结构。点击文件夹来探索里面的内容：",
        },
        appDir: {
          title: "app/ 目录——网站的「房间」",
          body: "在 Next.js 中，**app/** 里面的文件夹结构直接决定了网站的 URL。一个位于 `app/habits/page.tsx` 的文件会自动成为 `/habits` 页面。这叫做**基于文件的路由**。",
        },
        routeGroups: {
          title: "路由组：不改变 URL 的组织方式",
          body: "注意到那些用圆括号包裹的文件夹了吗，比如 `(app)` 和 `(auth)`？这些是**路由组**——它们帮助组织代码但不影响 URL。`(app)/` 里的所有页面共享相同的侧边栏和头部。`(auth)/` 里的页面共享更简洁的登录布局。",
          term: "路由组",
          definition:
            "用圆括号包裹的文件夹（如 `(app)`），将页面分组以共享布局，但不会添加到 URL 路径中。`/habits` 虽然在 `(app)/habits/` 里面，但 URL 只是 `/habits`，而不是 `/(app)/habits`。",
        },
        modules: {
          title: "StudyTracker 的 9 个模块",
          body: "StudyTracker 被组织成 9 个独立的功能模块，每个都有自己的页面、API 路由和组件：",
          list: [
            { name: "仪表盘", desc: "你一天的概览" },
            { name: "习惯", desc: "每日习惯追踪与热力图" },
            { name: "待办事项", desc: "带优先级的任务列表" },
            { name: "OKR 目标", desc: "目标与关键结果" },
            { name: "项目", desc: "带里程碑的项目管理" },
            { name: "内容", desc: "学习资源库" },
            { name: "想法", desc: "想法捕捉与分类" },
            { name: "人生罗盘", desc: "个人使命与价值观" },
            { name: "统计", desc: "跨模块的数据分析" },
          ],
        },
        codeExample: {
          title: "文件如何变成页面",
          body: "下面展示了一个简单的页面文件——文件路径决定 URL，函数返回用户看到的内容：",
        },
        tip: "最重要的一点：在 Next.js 中，**文件夹 = URL**。如果你想在 `/recipes` 添加一个新页面，只需创建 `app/recipes/page.tsx` 文件。",
      },
    },
    frontend: {
      title: "你看到的界面：前端",
      description: "了解 HTML、CSS、JavaScript、React 组件和 Tailwind CSS。",
      content: "",
      sections: {
        intro: {
          title: "什么是前端？",
          body: "**前端** 是在浏览器中运行的一切——你看到和交互的按钮、文字、颜色和布局。当你打开 StudyTracker 时，浏览器会下载 HTML、CSS 和 JavaScript 文件，然后把它们渲染成你看到的页面。",
        },
        analogy: {
          title: "三个层次",
          analogyTitle: "把网站想象成一个人",
          analogyBody:
            "**HTML** 是骨骼——它定义结构（标题、段落、按钮）。**CSS** 是衣服和装扮——它控制外观（颜色、间距、字体）。**JavaScript** 是大脑和肌肉——它让一切变得可交互（点击、动画、数据加载）。",
        },
        react: {
          title: "React：用组件搭建界面",
          body: "React 让你不必写一个巨大的 HTML 文件，而是把 UI 拆分成小的、可复用的**组件**。一个 `Button`、一个 `Card`、一个 `Sidebar`——每个都是组件。你把它们像乐高积木一样组合在一起，构建出完整的页面。",
          term: "组件",
          definition:
            "一个自包含的 UI 部件，管理自己的外观和行为。组件可以接收 **props**（输入属性）并维护 **state**（随时间变化的内部数据）。",
        },
        tailwind: {
          title: "Tailwind CSS：不离开代码就能设计样式",
          body: "传统 CSS 需要在单独的文件中写样式。**Tailwind CSS** 采用了不同的方法——你直接在 HTML/JSX 中使用预设的工具类。不用在 CSS 文件中写 `.button { background-color: blue; padding: 8px 16px; }`，只需在元素上写 `className=\"bg-blue-500 px-4 py-2\"`。",
          example:
            "StudyTracker 中的每个视觉元素都用 Tailwind 类来设计样式。把 `bg-blue-500` 改成 `bg-red-500`，按钮就变红了——即时反馈！",
        },
        nextjs: {
          title: "Next.js：整合一切的框架",
          body: "**Next.js** 是一个 React 框架，在此基础上增加了强大的功能：基于文件的路由（文件夹 = URL）、服务端渲染（更快的页面加载）、API 路由（前后端在同一个项目）、自动代码拆分（只加载你需要的）。",
        },
        playground: {
          title: "动手试试：组件实验室",
          body: "下面是一个包含真实 StudyTracker UI 组件的实验室。改变它们的 **props**（属性），实时观察输出的变化：",
        },
        codeExample: {
          title: "组件是如何工作的",
          body: "这是一个简化的 React 组件——它接收 props 并返回 JSX（JavaScript 中类似 HTML 的语法）：",
        },
        tip: "StudyTracker 中的每个页面都由**组件**构建而成。仅仪表盘页面就使用了 15+ 个组件——`Card`、`Progress`、`Badge`、`Button` 等等。学会用组件思考是理解现代前端开发的关键。",
      },
    },
    "backend-and-api": {
      title: "幕后的大脑：后端与 API",
      description: "了解服务器如何处理请求并与前端通信。",
      content: "",
      sections: {
        intro: {
          title: "什么是后端？",
          body: "**后端** 是运行在服务器上的那部分应用——不是在用户的浏览器中。它处理敏感操作，比如检查密码、从数据库读取数据和处理业务逻辑。用户永远看不到后端代码。",
        },
        analogy: {
          title: "再看厨房类比",
          analogyTitle: "餐厅的厨房团队",
          analogyBody:
            "如果前端是餐厅大堂，**后端就是厨房**。当顾客（用户）点餐（点击按钮），服务员（API）把订单送到厨房。厨师（服务器代码）准备菜品（处理数据），从储藏室（数据库）取材料，再通过服务员把做好的菜端回去。",
        },
        api: {
          title: "API 路由：前端和后端之间的服务员",
          body: "**API**（应用程序编程接口）是两个程序之间通信的一组规则。在 StudyTracker 中，API 路由在 `app/api/` 中，处理特定的操作。当前端调用 `fetch(\"/api/habits\")` 时，服务器上对应的路由函数会处理请求并返回数据。",
          term: "REST API",
          definition:
            "一种使用 HTTP 方法组织 API 端点的惯例：**GET** 读取数据，**POST** 创建数据，**PUT** 更新数据，**DELETE** 删除数据。每个 URL + 方法的组合代表一个特定的操作。",
        },
        requestCycle: {
          title: "请求/响应循环",
          body: "前端和后端之间的每次交互都遵循这个模式：浏览器发送一个**请求**（包含 URL、方法、头部和可选的正文），服务器处理后发回**响应**（包含状态码和数据）。看下面的动画了解详细过程：",
        },
        architecture: {
          title: "StudyTracker 各部分如何连接",
          body: "点击下方图表中的每个节点，了解它在应用架构中扮演什么角色：",
        },
        explorer: {
          title: "试一试：API 探索器",
          body: "下面是一个模拟的 API 探索器。选择一个端点，点击**发送**，查看服务器会返回什么。这类似于开发者每天使用的 Postman 工具：",
        },
        tip: "在 Next.js 中，前端和后端在**同一个项目**里。页面在 `app/(app)/`，API 路由在 `app/api/`。这被称为**全栈框架**——你不需要单独的后端项目。",
      },
    },
    database: {
      title: "记住一切：数据库",
      description: "理解数据是如何存储、组织和检索的。",
      content: "",
      sections: {
        intro: {
          title: "为什么需要数据库？",
          body: "当你创建一个习惯、写一个待办或追踪一个项目时，这些数据需要存在一个**永久**的地方。如果只存在浏览器内存中，关闭标签页一切就消失了。**数据库**是一个专门的程序，将数据存储在服务器上，使其在不同会话、设备和时间中持久存在。",
        },
        analogy: {
          title: "电子表格类比",
          analogyTitle: "把数据库想象成一组电子表格",
          analogyBody:
            "每个**表**就像一个工作表——`Habit`、`Todo`、`Project`。每**行**是一条记录（一个特定的习惯）。每**列**是一个属性（标题、颜色、频率）。关键区别：数据库强制执行结构（每个习惯必须有标题），并能高效处理数百万行数据。",
        },
        prisma: {
          title: "Prisma：用 JavaScript 与数据库对话",
          body: "StudyTracker 不写原始 SQL 查询，而是使用 **Prisma ORM**——一个让你用 JavaScript/TypeScript 方法与数据库交互的工具。`prisma.habit.findMany()` 会变成 `SELECT * FROM Habit`。这提供了类型安全、自动补全，且没有 SQL 注入风险。",
          term: "ORM（对象关系映射）",
          definition:
            "在编程语言的对象和数据库的表之间进行转换的中间层。不用写 `SELECT * FROM habits WHERE userId = '123'`，只需写 `prisma.habit.findMany({ where: { userId: '123' } })`。",
        },
        schema: {
          title: "Schema：你的数据蓝图",
          body: "**Prisma schema**（在 `prisma/schema.prisma` 中）定义了数据库中的每个表、列、类型和关系。当你修改 schema 并运行 `prisma migrate` 时，Prisma 会自动生成 SQL 来更新数据库结构。",
        },
        relationships: {
          title: "表之间如何关联",
          body: "不同表中的数据通过**外键**连接。`HabitLog` 有一个 `habitId` 字段指向特定的 `Habit`。这意味着一个习惯可以有多条日志——**一对多关系**。点击下面的表格来探索 StudyTracker 的数据模型：",
        },
        tip: "StudyTracker 的 9 个模块共有 **13 个数据库表**。最复杂的关系在 OKR 模块中：一个 `Objective` 有多个 `KeyResult`，每个 `KeyResult` 有多个 `CheckIn` 记录——三级层次结构。",
      },
    },
    authentication: {
      title: "你是谁？认证系统",
      description: "了解登录系统如何工作并保护你的数据安全。",
      content: "",
      sections: {
        intro: {
          title: "为什么认证很重要",
          body: "没有认证，任何人都能查看和修改你的数据。**认证**回答「你是谁？」这个问题——它验证你的身份，让应用知道哪些习惯、待办和项目属于你。",
        },
        analogy: {
          title: "酒店类比",
          analogyTitle: "认证就像酒店房卡",
          analogyBody:
            "当你办理入住（登录）时，前台（Supabase Auth）验证你的身份并给你一张**房卡**（JWT 令牌）。每次你要进入房间（访问页面），你刷卡（发送令牌）。酒店门锁（中间件）检查卡是否有效且对应正确的房间。",
        },
        concepts: {
          title: "关键认证概念",
          jwt: {
            term: "JWT（JSON Web Token）",
            definition:
              "一个紧凑的签名令牌，包含你的用户 ID 和过期时间。服务器无需查询数据库就能验证它——签名证明它没有被篡改。",
          },
          middleware: {
            term: "中间件",
            definition:
              "在页面加载**之前**运行的代码。在 StudyTracker 中，中间件读取你的 JWT cookie，将未认证用户重定向到 `/login`。它是门口的保安。",
          },
          oauth: {
            term: "OAuth",
            definition:
              "一种协议，允许你使用现有账号（Google、GitHub）登录。不需要创建新密码，而是将认证委托给受信任的提供商。",
          },
        },
        flow: {
          title: "认证流程",
          body: "观看登录 StudyTracker 时的分步流程——从输入凭据到访问受保护页面：",
        },
        protection: {
          title: "两层保护",
          body: "StudyTracker 使用**两层**认证验证：(1) **中间件**在任何页面加载前检查你的 JWT——如果无效，你会被重定向到 `/login`。(2) **API 路由**在返回数据前独立验证 JWT——即使有人绕过中间件，数据仍然受保护。",
        },
        tip: "永远不要在 `localStorage` 中存储敏感数据（密码、令牌）——页面上的任何 JavaScript 都能访问它。StudyTracker 使用 **HTTP-only cookies** 存储 JWT，JavaScript 无法读取，从而防止 XSS 攻击。",
      },
    },
    "tech-stack": {
      title: "技术选型：选择你的工具",
      description: "对比各种框架和工具，了解我们为什么做出这样的选择。",
      content: "",
      sections: {
        intro: {
          title: "什么是技术栈？",
          body: "**技术栈**是构建项目所使用的语言、框架、库和工具的组合。StudyTracker 的技术栈：**Next.js**（框架）、**React**（UI 库）、**TypeScript**（语言）、**Tailwind CSS**（样式）、**Prisma**（数据库工具包）、**PostgreSQL**（数据库）和 **Supabase**（认证 + 托管）。每个选择都有取舍。",
        },
        comparisons: {
          title: "关键对比",
          body: "点击每张卡片翻转查看优缺点。每种技术都有优势和劣势——最佳选择取决于你项目的需求：",
          cards: [
            {
              front: { title: "Next.js", subtitle: "带 SSR、路由、API 路由的 React 框架" },
              back: {
                pros: "基于文件的路由、服务器组件、内置 API、优秀的开发体验、Vercel 集成",
                cons: "供应商锁定顾虑、复杂的心智模型（服务器 vs 客户端）、构建时间可能增长",
              },
            },
            {
              front: { title: "PostgreSQL", subtitle: "符合 ACID 标准的关系型数据库" },
              back: {
                pros: "坚如磐石的可靠性、复杂查询、关系、30+ 年的实战检验",
                cons: "水平扩展较难、需要 schema 迁移、比 NoSQL 设置更复杂",
              },
            },
            {
              front: { title: "Tailwind CSS", subtitle: "工具优先的 CSS 框架" },
              back: {
                pros: "快速原型开发、一致的设计、极小的生产包、无需命名约定",
                cons: "冗长的类名字符串、工具类名学习曲线、提取复杂主题较难",
              },
            },
            {
              front: { title: "TypeScript", subtitle: "带静态类型检查的 JavaScript" },
              back: {
                pros: "编译时捕获错误、优秀的自动补全、自文档化代码",
                cons: "额外的编译步骤、冗长的泛型类型、类型系统学习曲线",
              },
            },
          ],
        },
        decision: {
          title: "选择你自己的技术栈",
          body: "回答几个问题，获取个性化的技术推荐。这个交互式引导考虑了你的项目类型、规模和团队经验：",
        },
        why: {
          title: "为什么 StudyTracker 选择了这个技术栈",
          body: "我们的技术选择基于三个优先级：(1) **开发体验**——TypeScript + Prisma 在错误到达生产环境前就捕获它们。(2) **全栈简洁性**——Next.js 让我们在一个项目中保持前端、后端和 API。(3) **可靠性**——PostgreSQL 和 Supabase Auth 经过了大规模实战验证。",
        },
        tip: "没有「最好的」技术栈——只有对**你的项目**最合适的技术栈。个人博客不需要和银行应用一样的工具。从你熟悉的开始，当遇到真正的限制时再升级，而不是假想的限制。",
      },
    },
    deployment: {
      title: "从代码到上线：部署",
      description: "看看电脑上的代码如何变成任何人都能访问的网站。",
      content: "",
      sections: {
        intro: {
          title: "什么是部署？",
          body: "**部署**是将代码从本地电脑搬到互联网上，让所有人都能访问的过程。当你输入一个 URL 看到网站时，就是有人把代码部署到了一台 24/7 运行的服务器上。",
        },
        analogy: {
          title: "出版类比",
          analogyTitle: "部署就像出版一本书",
          analogyBody:
            "你在电脑上写好手稿（代码）。出版社（Vercel）拿到你的手稿，排版（构建），印刷副本（部署到服务器），然后分发到全球各地的书店（CDN 边缘网络）。读者（用户）可以从最近的书店获取你的书。",
        },
        vercel: {
          title: "Vercel：我们的部署平台",
          body: "StudyTracker 使用 **Vercel**——Next.js 背后的公司。当你推送代码到 GitHub 时，Vercel 自动检测、构建项目并部署。这叫做**持续部署**（CD）。无需手动上传，无需服务器配置。",
        },
        envVars: {
          title: "环境变量：保护秘密安全",
          body: "你的应用需要秘密信息——数据库 URL、API 密钥、认证令牌。这些作为**环境变量**存储在 Vercel 上，不在代码中。本地的 `.env` 文件存放开发环境的秘密，但生产环境的秘密只存在服务器上。",
          term: "环境变量",
          definition:
            "存储在代码之外的键值对，用于为不同环境配置应用。`DATABASE_URL` 在本地指向测试数据库，在 Vercel 上指向生产数据库——同样的代码，不同的配置。",
        },
        simulator: {
          title: "观看部署过程",
          body: "点击下面的按钮模拟完整的部署过程——从 git push 到网站上线：",
        },
        cicd: {
          title: "CI/CD：每一步都自动化",
          body: "**CI**（持续集成）在你推送代码时自动运行测试和检查。**CD**（持续部署）在所有检查通过后部署构建。它们共同确保有问题的代码永远不会到达生产环境。Vercel 处理 CD；你可以通过 GitHub Actions 添加 CI。",
        },
        tip: "从 Vercel 的免费套餐开始——对个人项目和学习来说已经足够慷慨。你可以获得 HTTPS、自定义域名、预览部署（每个 PR 都有自己的 URL）和边缘缓存。只有需要团队功能或更高流量限制时才考虑付费计划。",
      },
    },
  },
};
