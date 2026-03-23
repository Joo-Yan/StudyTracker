import type { QuizQuestion } from "@/components/learn/interactive/quiz";

export const quizData: Record<string, QuizQuestion[]> = {
  "what-is-a-web-app": [
    {
      question: {
        en: "In the restaurant analogy, what does the API represent?",
        zh: "在餐厅类比中，API 代表什么？",
      },
      options: [
        { en: "The dining room", zh: "餐厅大堂" },
        { en: "The kitchen", zh: "厨房" },
        { en: "The waiter", zh: "服务员" },
        { en: "The menu", zh: "菜单" },
      ],
      correctIndex: 2,
      explanation: {
        en: "The API is like the waiter — it carries requests from the frontend (dining room) to the backend (kitchen) and brings responses back.",
        zh: "API 就像服务员——它将请求从前端（餐厅大堂）传递到后端（厨房），并将响应带回来。",
      },
    },
    {
      question: {
        en: "Which part of a web app runs in your browser?",
        zh: "Web 应用的哪个部分在你的浏览器中运行？",
      },
      options: [
        { en: "Backend", zh: "后端" },
        { en: "Database", zh: "数据库" },
        { en: "Frontend", zh: "前端" },
        { en: "Server", zh: "服务器" },
      ],
      correctIndex: 2,
      explanation: {
        en: "The frontend (HTML, CSS, JavaScript) runs in your browser. The backend and database run on the server.",
        zh: "前端（HTML、CSS、JavaScript）在你的浏览器中运行。后端和数据库运行在服务器上。",
      },
    },
    {
      question: {
        en: "What happens when you click 'Save Habit' in StudyTracker?",
        zh: "当你在 StudyTracker 中点击「保存习惯」时会发生什么？",
      },
      options: [
        { en: "Data is saved directly in the browser", zh: "数据直接保存在浏览器中" },
        { en: "The frontend sends a request to the API, which saves to the database", zh: "前端向 API 发送请求，API 将数据保存到数据库" },
        { en: "The database connects directly to the browser", zh: "数据库直接连接到浏览器" },
        { en: "Nothing happens until you refresh the page", zh: "在刷新页面之前什么都不会发生" },
      ],
      correctIndex: 1,
      explanation: {
        en: "The frontend sends a fetch() request to an API route, which processes it and saves the data to the database via Prisma.",
        zh: "前端发送 fetch() 请求到 API 路由，API 处理请求并通过 Prisma 将数据保存到数据库。",
      },
    },
  ],

  "project-structure": [
    {
      question: {
        en: "In Next.js, how do you create a page at the URL /habits?",
        zh: "在 Next.js 中，如何创建 URL 为 /habits 的页面？",
      },
      options: [
        { en: "Add a route in a config file", zh: "在配置文件中添加路由" },
        { en: "Create app/habits/page.tsx", zh: "创建 app/habits/page.tsx" },
        { en: "Register it in package.json", zh: "在 package.json 中注册" },
        { en: "Write a function called habits()", zh: "写一个叫 habits() 的函数" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Next.js uses file-based routing. A file at app/habits/page.tsx automatically becomes the /habits page.",
        zh: "Next.js 使用基于文件的路由。位于 app/habits/page.tsx 的文件会自动成为 /habits 页面。",
      },
    },
    {
      question: {
        en: "What is a route group (e.g., (app)) in Next.js?",
        zh: "Next.js 中的路由组（如 (app)）是什么？",
      },
      options: [
        { en: "A folder that adds to the URL path", zh: "一个添加到 URL 路径的文件夹" },
        { en: "A folder for organizing code without affecting URLs", zh: "一个组织代码但不影响 URL 的文件夹" },
        { en: "A special API directory", zh: "一个特殊的 API 目录" },
        { en: "A test folder", zh: "一个测试文件夹" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Route groups (folders in parentheses) organize code and share layouts without adding segments to the URL path.",
        zh: "路由组（圆括号文件夹）组织代码并共享布局，但不会在 URL 路径中添加段。",
      },
    },
    {
      question: {
        en: "Where do reusable UI building blocks live in the project?",
        zh: "可复用的 UI 构建块放在项目的哪里？",
      },
      options: [
        { en: "src/app/", zh: "src/app/" },
        { en: "src/lib/", zh: "src/lib/" },
        { en: "src/components/", zh: "src/components/" },
        { en: "prisma/", zh: "prisma/" },
      ],
      correctIndex: 2,
      explanation: {
        en: "Components live in src/components/ — organized by feature (habits/, stats/) and shared utilities (ui/, layout/).",
        zh: "组件在 src/components/ 中——按功能组织（habits/、stats/）和共享工具（ui/、layout/）。",
      },
    },
  ],

  frontend: [
    {
      question: {
        en: "What are the three layers of frontend technology?",
        zh: "前端技术的三个层次是什么？",
      },
      options: [
        { en: "React, Vue, Angular", zh: "React、Vue、Angular" },
        { en: "HTML, CSS, JavaScript", zh: "HTML、CSS、JavaScript" },
        { en: "Frontend, Backend, Database", zh: "前端、后端、数据库" },
        { en: "Node.js, Express, MongoDB", zh: "Node.js、Express、MongoDB" },
      ],
      correctIndex: 1,
      explanation: {
        en: "HTML provides structure, CSS provides styling, and JavaScript provides interactivity. All other frontend tools build on these three.",
        zh: "HTML 提供结构，CSS 提供样式，JavaScript 提供交互。所有其他前端工具都建立在这三者之上。",
      },
    },
    {
      question: {
        en: "What is a React component?",
        zh: "什么是 React 组件？",
      },
      options: [
        { en: "A CSS file", zh: "一个 CSS 文件" },
        { en: "A reusable piece of UI that manages its own appearance and behavior", zh: "一个管理自身外观和行为的可复用 UI 部件" },
        { en: "A database table", zh: "一个数据库表" },
        { en: "A server-side function", zh: "一个服务器端函数" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Components are self-contained UI building blocks. They receive props (inputs) and can maintain state (internal data).",
        zh: "组件是自包含的 UI 构建块。它们接收 props（输入）并可以维护 state（内部数据）。",
      },
    },
    {
      question: {
        en: "How does Tailwind CSS differ from traditional CSS?",
        zh: "Tailwind CSS 与传统 CSS 有什么不同？",
      },
      options: [
        { en: "It uses a separate CSS file for each component", zh: "它为每个组件使用单独的 CSS 文件" },
        { en: "It applies utility classes directly in HTML/JSX", zh: "它直接在 HTML/JSX 中使用工具类" },
        { en: "It only works with Vue.js", zh: "它只能和 Vue.js 一起使用" },
        { en: "It generates CSS at runtime in the browser", zh: "它在浏览器中运行时生成 CSS" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Tailwind uses utility classes like bg-blue-500 and px-4 directly on elements, instead of writing styles in separate CSS files.",
        zh: "Tailwind 使用如 bg-blue-500 和 px-4 这样的工具类直接应用在元素上，而不是在单独的 CSS 文件中编写样式。",
      },
    },
  ],

  "backend-and-api": [
    {
      question: {
        en: "What HTTP method is used to CREATE new data?",
        zh: "哪个 HTTP 方法用于创建新数据？",
      },
      options: [
        { en: "GET", zh: "GET" },
        { en: "POST", zh: "POST" },
        { en: "DELETE", zh: "DELETE" },
        { en: "PATCH", zh: "PATCH" },
      ],
      correctIndex: 1,
      explanation: {
        en: "POST is used to create new resources. GET reads, PUT/PATCH updates, and DELETE removes.",
        zh: "POST 用于创建新资源。GET 读取，PUT/PATCH 更新，DELETE 删除。",
      },
    },
    {
      question: {
        en: "Where do API routes live in a Next.js project?",
        zh: "API 路由在 Next.js 项目中的位置？",
      },
      options: [
        { en: "src/components/api/", zh: "src/components/api/" },
        { en: "src/app/api/", zh: "src/app/api/" },
        { en: "src/lib/api/", zh: "src/lib/api/" },
        { en: "api/ at the project root", zh: "项目根目录的 api/" },
      ],
      correctIndex: 1,
      explanation: {
        en: "API routes are defined in src/app/api/ using route.ts files. They run on the server and handle HTTP requests.",
        zh: "API 路由在 src/app/api/ 中使用 route.ts 文件定义。它们在服务器上运行并处理 HTTP 请求。",
      },
    },
    {
      question: {
        en: "Why is Next.js called a 'full-stack framework'?",
        zh: "为什么 Next.js 被称为「全栈框架」？",
      },
      options: [
        { en: "It includes a database", zh: "它包含数据库" },
        { en: "It handles both frontend pages and backend API routes in one project", zh: "它在一个项目中同时处理前端页面和后端 API 路由" },
        { en: "It replaces all other frameworks", zh: "它替代了所有其他框架" },
        { en: "It runs on all operating systems", zh: "它在所有操作系统上运行" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Next.js is full-stack because you write both frontend (pages) and backend (API routes) in the same project — no separate server needed.",
        zh: "Next.js 是全栈的，因为你在同一个项目中编写前端（页面）和后端（API 路由）——不需要单独的服务器。",
      },
    },
  ],

  database: [
    {
      question: {
        en: "What is an ORM?",
        zh: "什么是 ORM？",
      },
      options: [
        { en: "A type of database", zh: "一种数据库类型" },
        { en: "A layer that translates between programming objects and database tables", zh: "在编程对象和数据库表之间进行转换的中间层" },
        { en: "A frontend framework", zh: "一个前端框架" },
        { en: "An authentication protocol", zh: "一种认证协议" },
      ],
      correctIndex: 1,
      explanation: {
        en: "ORM (Object-Relational Mapping) lets you use programming language methods instead of raw SQL. Prisma is the ORM used in StudyTracker.",
        zh: "ORM（对象关系映射）让你使用编程语言的方法而不是原始 SQL。Prisma 是 StudyTracker 中使用的 ORM。",
      },
    },
    {
      question: {
        en: "What is a foreign key?",
        zh: "什么是外键？",
      },
      options: [
        { en: "A password for the database", zh: "数据库的密码" },
        { en: "A field that links one table to another", zh: "一个将一个表连接到另一个表的字段" },
        { en: "The primary identifier of a table", zh: "表的主要标识符" },
        { en: "An encryption key", zh: "一种加密密钥" },
      ],
      correctIndex: 1,
      explanation: {
        en: "A foreign key is a field (like habitId in HabitLog) that references a row in another table, creating a relationship between them.",
        zh: "外键是一个字段（如 HabitLog 中的 habitId），它引用另一个表中的行，在它们之间创建关系。",
      },
    },
    {
      question: {
        en: "Where is the database schema defined in StudyTracker?",
        zh: "StudyTracker 的数据库 schema 定义在哪里？",
      },
      options: [
        { en: "src/lib/schema.ts", zh: "src/lib/schema.ts" },
        { en: "package.json", zh: "package.json" },
        { en: "prisma/schema.prisma", zh: "prisma/schema.prisma" },
        { en: "src/app/api/schema.ts", zh: "src/app/api/schema.ts" },
      ],
      correctIndex: 2,
      explanation: {
        en: "The Prisma schema file defines all tables, columns, types, and relationships. Running 'prisma migrate' applies changes to the database.",
        zh: "Prisma schema 文件定义所有表、列、类型和关系。运行 'prisma migrate' 将更改应用到数据库。",
      },
    },
  ],

  authentication: [
    {
      question: {
        en: "What is a JWT?",
        zh: "什么是 JWT？",
      },
      options: [
        { en: "A database query language", zh: "一种数据库查询语言" },
        { en: "A signed token that proves your identity", zh: "一个证明你身份的签名令牌" },
        { en: "A CSS framework", zh: "一个 CSS 框架" },
        { en: "A type of API request", zh: "一种 API 请求类型" },
      ],
      correctIndex: 1,
      explanation: {
        en: "JWT (JSON Web Token) contains your user ID and is cryptographically signed. The server can verify it without a database lookup.",
        zh: "JWT（JSON Web Token）包含你的用户 ID 并经过加密签名。服务器无需查询数据库就能验证它。",
      },
    },
    {
      question: {
        en: "What does middleware do in StudyTracker?",
        zh: "中间件在 StudyTracker 中做什么？",
      },
      options: [
        { en: "Styles the pages", zh: "为页面添加样式" },
        { en: "Runs before page loads to check authentication", zh: "在页面加载前运行以检查认证" },
        { en: "Manages the database", zh: "管理数据库" },
        { en: "Sends emails", zh: "发送邮件" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Middleware intercepts every request before it reaches a page. It checks for a valid JWT and redirects unauthenticated users to /login.",
        zh: "中间件在请求到达页面之前拦截每个请求。它检查有效的 JWT，并将未认证的用户重定向到 /login。",
      },
    },
    {
      question: {
        en: "Why should you NOT store tokens in localStorage?",
        zh: "为什么不应该在 localStorage 中存储令牌？",
      },
      options: [
        { en: "localStorage is too slow", zh: "localStorage 太慢了" },
        { en: "Any JavaScript on the page can access it, making it vulnerable to XSS", zh: "页面上的任何 JavaScript 都能访问它，容易受到 XSS 攻击" },
        { en: "localStorage doesn't work on mobile", zh: "localStorage 在移动端不工作" },
        { en: "Tokens are too large for localStorage", zh: "令牌对 localStorage 来说太大了" },
      ],
      correctIndex: 1,
      explanation: {
        en: "localStorage is accessible to all JavaScript on the page. HTTP-only cookies are safer because JavaScript cannot read them.",
        zh: "localStorage 对页面上的所有 JavaScript 都可访问。HTTP-only cookies 更安全，因为 JavaScript 无法读取它们。",
      },
    },
  ],

  "tech-stack": [
    {
      question: {
        en: "What is a tech stack?",
        zh: "什么是技术栈？",
      },
      options: [
        { en: "A type of programming language", zh: "一种编程语言" },
        { en: "The combination of tools and technologies used to build a project", zh: "构建项目所使用的工具和技术的组合" },
        { en: "A debugging tool", zh: "一个调试工具" },
        { en: "A version control system", zh: "一个版本控制系统" },
      ],
      correctIndex: 1,
      explanation: {
        en: "A tech stack includes your language, framework, database, hosting, and other tools. There's no single 'best' stack — it depends on your needs.",
        zh: "技术栈包括你的语言、框架、数据库、托管和其他工具。没有单一的「最佳」技术栈——取决于你的需求。",
      },
    },
    {
      question: {
        en: "Why did StudyTracker choose TypeScript over plain JavaScript?",
        zh: "为什么 StudyTracker 选择 TypeScript 而不是纯 JavaScript？",
      },
      options: [
        { en: "TypeScript is faster at runtime", zh: "TypeScript 运行时更快" },
        { en: "TypeScript catches bugs at compile time and provides better autocompletion", zh: "TypeScript 在编译时捕获错误并提供更好的自动补全" },
        { en: "TypeScript is required by Next.js", zh: "Next.js 要求使用 TypeScript" },
        { en: "TypeScript uses less memory", zh: "TypeScript 使用更少内存" },
      ],
      correctIndex: 1,
      explanation: {
        en: "TypeScript adds static type checking on top of JavaScript. It catches errors before they reach production and provides excellent IDE support.",
        zh: "TypeScript 在 JavaScript 之上添加了静态类型检查。它在错误到达生产环境之前捕获它们，并提供出色的 IDE 支持。",
      },
    },
    {
      question: {
        en: "What advantage does PostgreSQL have over NoSQL databases?",
        zh: "PostgreSQL 相比 NoSQL 数据库有什么优势？",
      },
      options: [
        { en: "It's always faster", zh: "它总是更快" },
        { en: "Strong relationships between tables and complex queries", zh: "表之间的强关系和复杂查询" },
        { en: "It doesn't need a schema", zh: "它不需要 schema" },
        { en: "It's easier to set up", zh: "它更容易设置" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Relational databases like PostgreSQL excel at complex data relationships (e.g., habits → logs, objectives → key results) and enforce data integrity.",
        zh: "像 PostgreSQL 这样的关系型数据库擅长复杂的数据关系（如习惯 → 日志、目标 → 关键结果）并确保数据完整性。",
      },
    },
  ],

  deployment: [
    {
      question: {
        en: "What triggers a deployment on Vercel?",
        zh: "什么会触发 Vercel 上的部署？",
      },
      options: [
        { en: "Clicking a deploy button on the website", zh: "在网站上点击部署按钮" },
        { en: "Pushing code to GitHub", zh: "将代码推送到 GitHub" },
        { en: "Restarting your computer", zh: "重启你的电脑" },
        { en: "Updating package.json", zh: "更新 package.json" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Vercel watches your GitHub repository. When you push a new commit, it automatically builds and deploys your project (Continuous Deployment).",
        zh: "Vercel 监视你的 GitHub 仓库。当你推送新提交时，它会自动构建并部署你的项目（持续部署）。",
      },
    },
    {
      question: {
        en: "Why are environment variables important?",
        zh: "为什么环境变量很重要？",
      },
      options: [
        { en: "They make the app run faster", zh: "它们让应用运行更快" },
        { en: "They keep secrets like database URLs out of your code", zh: "它们将数据库 URL 等秘密信息从代码中分离出来" },
        { en: "They are required by JavaScript", zh: "JavaScript 要求使用它们" },
        { en: "They replace CSS variables", zh: "它们替代 CSS 变量" },
      ],
      correctIndex: 1,
      explanation: {
        en: "Environment variables store sensitive data (API keys, database URLs) outside your code. Different environments (dev, production) use different values.",
        zh: "环境变量将敏感数据（API 密钥、数据库 URL）存储在代码之外。不同环境（开发、生产）使用不同的值。",
      },
    },
    {
      question: {
        en: "What is CI/CD?",
        zh: "什么是 CI/CD？",
      },
      options: [
        { en: "A programming language", zh: "一种编程语言" },
        { en: "Continuous Integration / Continuous Deployment — automated testing and deployment", zh: "持续集成 / 持续部署——自动化测试和部署" },
        { en: "A type of database", zh: "一种数据库类型" },
        { en: "A CSS framework", zh: "一个 CSS 框架" },
      ],
      correctIndex: 1,
      explanation: {
        en: "CI runs tests automatically when you push code. CD deploys if tests pass. Together they prevent broken code from reaching production.",
        zh: "CI 在你推送代码时自动运行测试。CD 在测试通过后部署。它们共同防止有问题的代码到达生产环境。",
      },
    },
  ],
};
