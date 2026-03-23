import type { Locale } from "./i18n";

interface Annotation {
  line: number;
  en: string;
  zh: string;
}

export interface CodeSample {
  id: string;
  filename: string;
  language: string;
  code: string;
  annotations: Annotation[];
  highlightLines?: number[];
}

export function getAnnotations(
  sample: CodeSample,
  locale: Locale
): { line: number; text: string }[] {
  return sample.annotations.map((a) => ({
    line: a.line,
    text: a[locale],
  }));
}

export const codeSamples: Record<string, CodeSample> = {
  apiRouteExample: {
    id: "apiRouteExample",
    filename: "src/app/api/habits/route.ts",
    language: "typescript",
    code: `export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(habits);
}`,
    annotations: [
      {
        line: 1,
        en: "This function handles GET requests to /api/habits — like a waiter receiving an order",
        zh: "这个函数处理对 /api/habits 的 GET 请求——就像服务员接收点单",
      },
      {
        line: 3,
        en: "Check who is making the request (authentication)",
        zh: "检查是谁在发起请求（身份认证）",
      },
      {
        line: 8,
        en: "Query the database for this user's habits using Prisma ORM",
        zh: "使用 Prisma ORM 查询该用户的习惯数据",
      },
      {
        line: 13,
        en: "Send the data back to the browser as JSON",
        zh: "将数据以 JSON 格式发送回浏览器",
      },
    ],
    highlightLines: [1, 8, 13],
  },

  reactComponentExample: {
    id: "reactComponentExample",
    filename: "src/components/ui/button.tsx",
    language: "tsx",
    code: `const Button = ({ children, variant = "default", onClick }) => {
  return (
    <button
      className={buttonVariants({ variant })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
    annotations: [
      {
        line: 1,
        en: "A React component is a reusable building block — like a LEGO brick",
        zh: "React 组件是可复用的构建块——就像一块乐高积木",
      },
      {
        line: 4,
        en: "className applies styles — Tailwind CSS generates these from utility classes",
        zh: "className 用于应用样式——Tailwind CSS 从工具类生成这些样式",
      },
      {
        line: 7,
        en: "{children} is whatever you put between <Button>...</Button> tags",
        zh: "{children} 是你放在 <Button>...</Button> 标签之间的内容",
      },
    ],
    highlightLines: [1, 4, 7],
  },

  pageRouteExample: {
    id: "pageRouteExample",
    filename: "src/app/(app)/habits/page.tsx",
    language: "tsx",
    code: `export default function HabitsPage() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch("/api/habits")
      .then(res => res.json())
      .then(data => setHabits(data));
  }, []);

  return (
    <div>
      <h1>My Habits</h1>
      {habits.map(habit => (
        <Card key={habit.id}>{habit.name}</Card>
      ))}
    </div>
  );
}`,
    annotations: [
      {
        line: 1,
        en: "This file at app/(app)/habits/page.tsx automatically becomes the /habits page",
        zh: "这个文件位于 app/(app)/habits/page.tsx，自动成为 /habits 页面",
      },
      {
        line: 4,
        en: "useEffect runs after the page loads — it fetches data from our API",
        zh: "useEffect 在页面加载后运行——它从我们的 API 获取数据",
      },
      {
        line: 5,
        en: "fetch() sends a request to the backend — this is the frontend talking to the backend",
        zh: "fetch() 向后端发送请求——这就是前端与后端的对话",
      },
      {
        line: 13,
        en: ".map() loops through each habit and creates a Card component for it",
        zh: ".map() 遍历每个习惯并为其创建一个 Card 组件",
      },
    ],
    highlightLines: [1, 5, 13],
  },

  folderStructureExample: {
    id: "folderStructureExample",
    filename: "Project Root",
    language: "plaintext",
    code: `StudyTracker/
├── src/
│   ├── app/          ← Pages & API routes
│   ├── components/   ← Reusable UI pieces
│   └── lib/          ← Utilities & helpers
├── prisma/           ← Database schema
├── package.json      ← Dependencies list
└── next.config.ts    ← Framework settings`,
    annotations: [
      {
        line: 2,
        en: "src/ contains all the source code you write",
        zh: "src/ 包含你编写的所有源代码",
      },
      {
        line: 3,
        en: "app/ is special — its folder structure directly maps to URL paths",
        zh: "app/ 是特殊的——它的文件夹结构直接映射为 URL 路径",
      },
      {
        line: 6,
        en: "prisma/ defines what data your app stores (like a spreadsheet template)",
        zh: "prisma/ 定义你的应用存储什么数据（就像电子表格模板）",
      },
      {
        line: 7,
        en: "package.json lists every library your project depends on",
        zh: "package.json 列出了项目依赖的每一个库",
      },
    ],
    highlightLines: [3, 6, 7],
  },
};
