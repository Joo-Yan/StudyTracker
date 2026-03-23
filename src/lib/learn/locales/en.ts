export const en = {
  ui: {
    title: "Learn How This Site Works",
    subtitle: "An interactive guide to understanding web development",
    backToApp: "Back to App",
    language: "EN",
    nextChapter: "Next Chapter",
    prevChapter: "Previous Chapter",
    progress: "Progress",
    chaptersCompleted: "chapters completed",
    markComplete: "Mark as Complete",
    completed: "Completed",
    startLearning: "Start Learning",
    overview: "Course Overview",
    chapterLabel: "Chapter {n}",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    clickToExplore: "Click folders to explore, click ? for details",
    quizTitle: "Test Your Knowledge",
  },
  chapters: {
    "what-is-a-web-app": {
      title: "What Is a Web Application?",
      description:
        "Understand the fundamental building blocks of a website using a restaurant analogy.",
      content: "",
      sections: {
        intro: {
          title: "More Than Just a Web Page",
          body: "When you visit a website like this one, you're not just looking at a static document — you're interacting with a **web application**. You can log in, create habits, track progress, and see charts. All of this requires multiple systems working together behind the scenes.",
        },
        analogy: {
          title: "The Restaurant Analogy",
          analogyTitle: "Think of a web app like a restaurant",
          analogyBody:
            "The **dining room** is the frontend — it's what you see and interact with: the menu, the tables, the decor. The **kitchen** is the backend — it's where the real work happens: processing orders, cooking food, and managing ingredients. The **waiter** is the API — they carry your order from the table to the kitchen, and bring food back to you.",
        },
        threeparts: {
          title: "The Three Parts of Every Web App",
          frontend: {
            term: "Frontend (Client)",
            definition:
              "Everything that runs in your browser — the buttons you click, the text you read, the colors and layout. Built with HTML, CSS, and JavaScript.",
          },
          backend: {
            term: "Backend (Server)",
            definition:
              "A program running on a remote computer that processes requests, talks to the database, and sends back data. You never see it directly.",
          },
          api: {
            term: "API (Application Programming Interface)",
            definition:
              "The agreed-upon language between frontend and backend. When you click 'Save Habit', the frontend sends a message via the API, and the backend knows exactly how to handle it.",
          },
        },
        howItWorks: {
          title: "What Happens When You Visit This Site?",
          steps: [
            "You type the URL or click a link — your browser sends a request to the server",
            "The server sends back HTML, CSS, and JavaScript files — this is the frontend code",
            "Your browser runs the JavaScript, which makes the page interactive",
            "When you do something (like check off a habit), the frontend sends a request to the API",
            "The API route on the server processes it and talks to the database",
            "The database stores or retrieves the data",
            "The server sends a response back, and the frontend updates what you see",
          ],
        },
        realExample: {
          title: "A Real Example from This Site",
          body: 'Here\'s actual code from StudyTracker that handles loading your habits. This is the "kitchen" processing an "order":',
        },
        tip: "Don't worry about understanding every line of code. The important thing is the pattern: the frontend asks, the backend processes, the database stores.",
      },
    },
    "project-structure": {
      title: "The Blueprint: Project Structure",
      description:
        "Explore how files and folders are organized in a real project.",
      content: "",
      sections: {
        intro: {
          title: "Why Organization Matters",
          body: "A web application can have hundreds or thousands of files. Without good organization, finding and changing code would be like searching for a specific book in a library with no catalog system. Let's explore how StudyTracker organizes its code.",
        },
        analogy: {
          title: "The Building Analogy",
          analogyTitle: "Think of the project like a building",
          analogyBody:
            "The **root folder** is the building itself. **src/** is the main floor where all the action happens. Inside src, **app/** is like the different rooms (each page is a room). **components/** is the furniture warehouse — reusable pieces that can go in any room. **lib/** is the utility closet — tools and helpers used everywhere.",
        },
        overview: {
          title: "The Top-Level View",
          body: "Here's what the StudyTracker project looks like at the top level. Click on folders to explore what's inside:",
        },
        appDir: {
          title: 'The app/ Directory — "Rooms" of Your Website',
          body: "In Next.js, the folder structure inside **app/** directly determines your website's URLs. A file at `app/habits/page.tsx` automatically becomes the `/habits` page. This is called **file-based routing**.",
        },
        routeGroups: {
          title: "Route Groups: Organizing Without Changing URLs",
          body: "Notice folders wrapped in parentheses like `(app)` and `(auth)`? These are **route groups** — they help organize code without affecting the URL. All pages inside `(app)/` share the same sidebar and header. Pages in `(auth)/` share a simpler login layout.",
          term: "Route Group",
          definition:
            "A folder wrapped in parentheses (e.g., `(app)`) that groups pages together for shared layouts without adding to the URL path. `/habits` lives inside `(app)/habits/` but the URL is just `/habits`, not `/(app)/habits`.",
        },
        modules: {
          title: "The 9 Modules of StudyTracker",
          body: "StudyTracker is organized into 9 distinct features, each with its own page, API routes, and components:",
          list: [
            { name: "Dashboard", desc: "Overview of your day" },
            { name: "Habits", desc: "Daily habit tracking with heatmaps" },
            { name: "Todos", desc: "Task list with priorities" },
            { name: "OKR Goals", desc: "Objectives & Key Results" },
            { name: "Projects", desc: "Project management with milestones" },
            { name: "Content", desc: "Learning resource library" },
            { name: "Ideas", desc: "Idea capture & categorization" },
            { name: "Life Compass", desc: "Personal mission & values" },
            { name: "Stats", desc: "Analytics across all modules" },
          ],
        },
        codeExample: {
          title: "How a File Becomes a Page",
          body: "Here's how a simple page file works — the file path determines the URL, and the function returns what the user sees:",
        },
        tip: "The most important thing to remember: in Next.js, **folders = URLs**. If you want to add a new page at `/recipes`, you create a file at `app/recipes/page.tsx`.",
      },
    },
    frontend: {
      title: "The Face You See: Frontend",
      description:
        "Learn about HTML, CSS, JavaScript, React components, and Tailwind CSS.",
      content: "",
      sections: {
        intro: {
          title: "What Is the Frontend?",
          body: "The **frontend** is everything that runs in your browser — the buttons, text, colors, and layout you see and interact with. When you open StudyTracker, your browser downloads HTML, CSS, and JavaScript files, then renders them into the page you see.",
        },
        analogy: {
          title: "The Three Layers",
          analogyTitle: "Think of a website like a person",
          analogyBody:
            "**HTML** is the skeleton — it defines the structure (headings, paragraphs, buttons). **CSS** is the clothing and makeup — it controls how things look (colors, spacing, fonts). **JavaScript** is the brain and muscles — it makes things interactive (clicks, animations, data loading).",
        },
        react: {
          title: "React: Building with Components",
          body: "Instead of writing one giant HTML file, React lets you break your UI into small, reusable pieces called **components**. A `Button`, a `Card`, a `Sidebar` — each is a component. You compose them together like LEGO bricks to build entire pages.",
          term: "Component",
          definition:
            "A self-contained piece of UI that manages its own appearance and behavior. Components can receive **props** (inputs) and maintain **state** (internal data that changes over time).",
        },
        tailwind: {
          title: "Tailwind CSS: Styling Without Leaving Your Code",
          body: "Traditional CSS means writing styles in a separate file. **Tailwind CSS** takes a different approach — you apply pre-built utility classes directly in your HTML/JSX. Instead of writing `.button { background-color: blue; padding: 8px 16px; }` in a CSS file, you write `className=\"bg-blue-500 px-4 py-2\"` right on the element.",
          example:
            "Every visual element in StudyTracker is styled with Tailwind classes. Change `bg-blue-500` to `bg-red-500` and the button turns red — instant feedback!",
        },
        nextjs: {
          title: "Next.js: The Framework That Ties It All Together",
          body: "**Next.js** is a React framework that adds powerful features on top: file-based routing (folders = URLs), server-side rendering (faster page loads), API routes (backend in the same project), and automatic code splitting (only load what you need).",
        },
        playground: {
          title: "Try It Yourself: Component Playground",
          body: "Below is a live playground with actual StudyTracker UI components. Change their **props** (properties) and watch how the output changes in real time:",
        },
        codeExample: {
          title: "How a Component Works",
          body: "Here's a simplified React component — it receives props and returns JSX (HTML-like syntax in JavaScript):",
        },
        tip: "Every page in StudyTracker is built from **components**. The Dashboard page alone uses 15+ components — `Card`, `Progress`, `Badge`, `Button`, and more. Learning to think in components is the key to understanding modern frontend development.",
      },
    },
    "backend-and-api": {
      title: "The Brain Behind the Scenes: Backend & API",
      description:
        "Discover how the server processes requests and communicates with the frontend.",
      content: "",
      sections: {
        intro: {
          title: "What Is the Backend?",
          body: "The **backend** is the part of your application that runs on a server — not in the user's browser. It handles sensitive operations like checking passwords, reading from the database, and processing business logic. Users never see backend code directly.",
        },
        analogy: {
          title: "The Kitchen Analogy Revisited",
          analogyTitle: "The kitchen staff of your restaurant",
          analogyBody:
            "If the frontend is the dining room, the **backend is the kitchen**. When a customer (user) places an order (clicks a button), the waiter (API) carries it to the kitchen. The chef (server code) prepares the dish (processes data), gets ingredients from the pantry (database), and sends the finished plate back through the waiter.",
        },
        api: {
          title: "API Routes: The Waiter Between Frontend & Backend",
          body: "An **API** (Application Programming Interface) is a set of rules for how two programs talk to each other. In StudyTracker, API routes live in `app/api/` and handle specific operations. When the frontend calls `fetch(\"/api/habits\")`, the corresponding route function on the server processes the request and returns data.",
          term: "REST API",
          definition:
            "A convention for organizing API endpoints using HTTP methods: **GET** reads data, **POST** creates data, **PUT** updates data, **DELETE** removes data. Each URL + method combination represents a specific action.",
        },
        requestCycle: {
          title: "The Request/Response Cycle",
          body: "Every interaction between frontend and backend follows this pattern: the browser sends a **request** (with a URL, method, headers, and optional body), the server processes it, and sends back a **response** (with a status code and data). Watch the animation below to see this in action:",
        },
        architecture: {
          title: "How StudyTracker's Parts Connect",
          body: "Click on each node in the diagram below to understand what role it plays in the application architecture:",
        },
        explorer: {
          title: "Try It: API Explorer",
          body: "Below is a simulated API explorer. Select an endpoint, click **Send**, and see what the server would return. This is similar to tools like Postman that developers use every day:",
        },
        tip: "In Next.js, frontend and backend live in the **same project**. Pages go in `app/(app)/`, API routes go in `app/api/`. This is called a **full-stack framework** — you don't need a separate backend project.",
      },
    },
    database: {
      title: "Remembering Everything: The Database",
      description:
        "Understand how data is stored, organized, and retrieved.",
      content: "",
      sections: {
        intro: {
          title: "Why Do We Need a Database?",
          body: "When you create a habit, write a todo, or track a project, that data needs to live somewhere **permanent**. If we only stored it in the browser's memory, everything would vanish when you close the tab. A **database** is a specialized program that stores data on a server so it persists across sessions, devices, and time.",
        },
        analogy: {
          title: "The Spreadsheet Analogy",
          analogyTitle: "Think of a database like a collection of spreadsheets",
          analogyBody:
            "Each **table** is like a sheet — `Habit`, `Todo`, `Project`. Each **row** is one entry (one specific habit). Each **column** is a property (title, color, frequency). The key difference: databases enforce structure (every habit MUST have a title) and handle millions of rows efficiently.",
        },
        prisma: {
          title: "Prisma: Speaking to the Database in JavaScript",
          body: "Instead of writing raw SQL queries, StudyTracker uses **Prisma ORM** — a tool that lets you interact with the database using JavaScript/TypeScript methods. `prisma.habit.findMany()` becomes `SELECT * FROM Habit`. This gives you type safety, autocompletion, and no risk of SQL injection.",
          term: "ORM (Object-Relational Mapping)",
          definition:
            "A layer that translates between your programming language's objects and the database's tables. Instead of `SELECT * FROM habits WHERE userId = '123'`, you write `prisma.habit.findMany({ where: { userId: '123' } })`.",
        },
        schema: {
          title: "The Schema: Your Data Blueprint",
          body: "The **Prisma schema** (in `prisma/schema.prisma`) defines every table, column, type, and relationship in your database. When you change the schema and run `prisma migrate`, Prisma automatically generates the SQL to update your database structure.",
        },
        relationships: {
          title: "How Tables Connect",
          body: "Data in different tables is linked through **foreign keys**. A `HabitLog` has a `habitId` field that points to a specific `Habit`. This means one habit can have many logs — a **one-to-many relationship**. Click the tables below to explore StudyTracker's data model:",
        },
        tip: "StudyTracker has **13 database tables** across its 9 modules. The most complex relationships are in the OKR module: an `Objective` has many `KeyResult` entries, and each `KeyResult` has many `CheckIn` records — a three-level hierarchy.",
      },
    },
    authentication: {
      title: "Who Are You? Authentication",
      description:
        "Learn how login systems work and keep your data secure.",
      content: "",
      sections: {
        intro: {
          title: "Why Authentication Matters",
          body: "Without authentication, anyone could see and modify your data. **Authentication** answers the question \"Who are you?\" — it verifies your identity so the app knows which habits, todos, and projects belong to you.",
        },
        analogy: {
          title: "The Hotel Analogy",
          analogyTitle: "Authentication is like a hotel key card",
          analogyBody:
            "When you check in (login), the front desk (Supabase Auth) verifies your identity and gives you a **key card** (JWT token). Every time you want to enter your room (access a page), you swipe the card (send the token). The hotel door (middleware) checks if the card is valid and for the right room.",
        },
        concepts: {
          title: "Key Authentication Concepts",
          jwt: {
            term: "JWT (JSON Web Token)",
            definition:
              "A compact, signed token that contains your user ID and expiration time. The server can verify it without looking up a database — the signature proves it hasn't been tampered with.",
          },
          middleware: {
            term: "Middleware",
            definition:
              "Code that runs **before** a page loads. In StudyTracker, the middleware reads your JWT cookie and redirects unauthenticated users to `/login`. It's the bouncer at the door.",
          },
          oauth: {
            term: "OAuth",
            definition:
              "A protocol that lets you log in using an existing account (Google, GitHub). Instead of creating a new password, you delegate authentication to a trusted provider.",
          },
        },
        flow: {
          title: "The Authentication Flow",
          body: "Watch the step-by-step flow of what happens when you log in to StudyTracker — from entering your credentials to accessing protected pages:",
        },
        protection: {
          title: "Two Layers of Protection",
          body: "StudyTracker uses **two layers** of auth verification: (1) **Middleware** checks your JWT before any page loads — if invalid, you're redirected to `/login`. (2) **API routes** independently verify the JWT before returning data — even if someone bypasses the middleware, the data stays protected.",
        },
        tip: "Never store sensitive data (passwords, tokens) in `localStorage` — it's accessible to any JavaScript on the page. StudyTracker uses **HTTP-only cookies** for JWT storage, which JavaScript cannot read, protecting against XSS attacks.",
      },
    },
    "tech-stack": {
      title: "Choosing Your Tools: The Tech Stack",
      description:
        "Compare frameworks and tools, and understand why we chose ours.",
      content: "",
      sections: {
        intro: {
          title: "What Is a Tech Stack?",
          body: "A **tech stack** is the combination of languages, frameworks, libraries, and tools used to build a project. StudyTracker's stack is: **Next.js** (framework), **React** (UI library), **TypeScript** (language), **Tailwind CSS** (styling), **Prisma** (database toolkit), **PostgreSQL** (database), and **Supabase** (auth + hosting). Each choice has trade-offs.",
        },
        comparisons: {
          title: "Key Comparisons",
          body: "Click each card to flip it and see the pros and cons. Every technology has strengths and weaknesses — the best choice depends on your project's needs:",
          cards: [
            {
              front: { title: "Next.js", subtitle: "React framework with SSR, routing, API routes" },
              back: {
                pros: "File-based routing, server components, built-in API, great DX, Vercel integration",
                cons: "Vendor lock-in concerns, complex mental model (server vs client), build times can grow",
              },
            },
            {
              front: { title: "PostgreSQL", subtitle: "Relational database with ACID compliance" },
              back: {
                pros: "Rock-solid reliability, complex queries, relationships, 30+ years of battle-testing",
                cons: "Harder to scale horizontally, requires schema migrations, more setup than NoSQL",
              },
            },
            {
              front: { title: "Tailwind CSS", subtitle: "Utility-first CSS framework" },
              back: {
                pros: "Fast prototyping, consistent design, tiny production bundle, no naming conventions needed",
                cons: "Verbose class strings, learning curve for utility names, harder to extract complex themes",
              },
            },
            {
              front: { title: "TypeScript", subtitle: "JavaScript with static type checking" },
              back: {
                pros: "Catches bugs at compile time, excellent autocompletion, self-documenting code",
                cons: "Extra compilation step, verbose generic types, learning curve for type system",
              },
            },
          ],
        },
        decision: {
          title: "Choose Your Own Stack",
          body: "Answer a few questions to get a personalized technology recommendation. This interactive guide considers your project type, scale, and team experience:",
        },
        why: {
          title: "Why StudyTracker Chose This Stack",
          body: "Our tech choices were driven by three priorities: (1) **Developer experience** — TypeScript + Prisma catch errors before they reach production. (2) **Full-stack simplicity** — Next.js lets us keep frontend, backend, and API in one project. (3) **Proven reliability** — PostgreSQL and Supabase Auth are battle-tested at scale.",
        },
        tip: "There is no \"best\" tech stack — only the best stack **for your project**. A personal blog doesn't need the same tools as a banking app. Start with what you know, and upgrade when you hit real limitations, not hypothetical ones.",
      },
    },
    deployment: {
      title: "From Code to Live Website: Deployment",
      description:
        "See how code on your computer becomes a website anyone can visit.",
      content: "",
      sections: {
        intro: {
          title: "What Is Deployment?",
          body: "**Deployment** is the process of taking your code from your local computer and making it accessible on the internet. When you type a URL and see a website, someone has deployed that code to a server that's running 24/7.",
        },
        analogy: {
          title: "The Publishing Analogy",
          analogyTitle: "Deployment is like publishing a book",
          analogyBody:
            "You write the manuscript (code) on your computer. The publisher (Vercel) takes your manuscript, typesets it (builds), prints copies (deploys to servers), and distributes them to bookstores worldwide (CDN edge network). Readers (users) can then access your book from their nearest bookstore.",
        },
        vercel: {
          title: "Vercel: Our Deployment Platform",
          body: "StudyTracker uses **Vercel** — the company behind Next.js. When you push code to GitHub, Vercel automatically detects it, builds your project, and deploys it. This is called **Continuous Deployment** (CD). No manual upload, no server configuration.",
        },
        envVars: {
          title: "Environment Variables: Keeping Secrets Safe",
          body: "Your app needs secrets — database URLs, API keys, auth tokens. These are stored as **environment variables** on Vercel, NOT in your code. The `.env` file on your local machine holds your development secrets, but production secrets live only on the server.",
          term: "Environment Variable",
          definition:
            "A key-value pair stored outside your code that configures your app for different environments. `DATABASE_URL` points to your test database locally and your production database on Vercel — same code, different config.",
        },
        simulator: {
          title: "Watch a Deployment Happen",
          body: "Click the button below to simulate the full deployment process — from git push to a live website:",
        },
        cicd: {
          title: "CI/CD: Automation at Every Step",
          body: "**CI** (Continuous Integration) runs tests and checks automatically when you push code. **CD** (Continuous Deployment) deploys the build if all checks pass. Together, they ensure that broken code never reaches production. Vercel handles CD; you can add CI via GitHub Actions.",
        },
        tip: "Start with Vercel's free tier — it's generous enough for personal projects and learning. You get HTTPS, custom domains, preview deployments (every PR gets its own URL), and edge caching. Only consider paid plans when you need team features or higher traffic limits.",
      },
    },
  },
};
