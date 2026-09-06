import { Phase, CaseStudy } from '../types';

export const SYLLABUS: Record<'foundation' | 'advanced', Phase[]> = {
  foundation: [
    {
      id: "f-p0",
      index: "Phase 0 · Month 1",
      title: "What programming actually is",
      bucket: "core",
      desc: "Computational thinking before any language. Most beginners skip this and can't write a program from a blank file later.",
      items: [
        {
          t: "Learn what a variable, loop, and conditional are, on paper, no computer: write 'steps to make tea' for a very literal robot",
          sub: ["What a variable actually stores", "Sequence vs decision vs repetition", "Why 'literal robot' framing catches hidden assumptions"],
          link: { url: "https://www.khanacademy.org/computing/code-org/computer-science-principles/algorithms-101/a/what-is-an-algorithm", label: "Khan Academy — What is an algorithm", kind: "read" }
        },
        {
          t: "Write 5 more everyday processes as pseudocode (sandwich, budget check, sorting laundry)",
          sub: ["Plain-English step lists", "Spotting the implicit conditionals in daily tasks"],
          link: { url: "https://www.geeksforgeeks.org/dsa/how-to-write-a-pseudo-code/", label: "GeeksforGeeks — How to write pseudocode", kind: "read" }
        },
        { t: "Self-test: write pseudocode for a new task cold, no examples in front of you" },
        {
          t: "Install VS Code and set it up",
          sub: ["Extensions: Python, Pylance", "Integrated terminal basics"],
          link: { url: "https://code.visualstudio.com/docs/setup/setup-overview", label: "VS Code — official setup docs", kind: "docs" }
        },
        {
          t: "Install Python; run your first program and understand every character in it",
          sub: ["print() and the parser", "What .py actually means to your OS"],
          link: { url: "https://docs.python.org/3/using/index.html", label: "Python docs — Using Python", kind: "docs" }
        },
        {
          t: "Learn basic terminal navigation: folders, running a file, no GUI clicking",
          sub: ["cd, ls/dir, pwd", "Running python file.py directly"],
          link: { url: "https://www.freecodecamp.org/news/command-line-for-beginners/", label: "freeCodeCamp — command line basics", kind: "read" }
        },
        {
          t: "Get comfortable reading error messages in VS Code without panicking",
          sub: ["Traceback structure: bottom line first", "SyntaxError vs NameError vs TypeError"],
          link: { url: "https://realpython.com/python-traceback/", label: "Real Python — Understanding tracebacks", kind: "read" }
        },
        {
          t: "Variables and data types: write 10 tiny scripts, each using a different type",
          sub: ["int, float, str, bool", "Type conversion basics"],
          link: { url: "https://docs.python.org/3/tutorial/introduction.html", label: "Python tutorial — an informal introduction", kind: "docs" }
        },
        {
          t: "If/else conditionals: script that reacts differently to user input",
          sub: ["input() and type coercion", "Comparison and logical operators"],
          link: { url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements", label: "Python docs — if statements", kind: "docs" }
        },
        {
          t: "Loops (for, while): one script that counts, one that repeats until a condition is met",
          sub: ["range()", "break and continue", "Infinite-loop bugs and how to spot them"],
          link: { url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements", label: "Python docs — for statements", kind: "docs" }
        },
        {
          t: "Functions: write 5 small functions from scratch",
          sub: ["Parameters vs arguments", "Return values vs print", "Scope basics"],
          link: { url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions", label: "Python docs — defining functions", kind: "docs" }
        },
        { t: "Self-test: write a script that classifies a number as positive/negative/zero, no notes" },
        { t: "Feynman rep: explain what a function is, out loud, to an imaginary non-coder" },
        { t: "Milestone: write a short Python script from a blank file, understanding every line", m: true }
      ]
    },
    {
      id: "f-p1a",
      index: "Phase 1a · Month 2",
      title: "Data structures & problem-solving",
      bucket: "core",
      desc: "Where syntax becomes the ability to actually build things.",
      items: [
        {
          t: "Lists: create, index, slice, loop over, modify",
          sub: ["Negative indexing", "Slicing syntax [start:stop:step]", "append/insert/remove"],
          link: { url: "https://docs.python.org/3/tutorial/introduction.html#lists", label: "Python docs — lists", kind: "docs" }
        },
        {
          t: "Dictionaries: key-value pairs, when to use them vs lists",
          sub: ["Hashable keys", ".get() vs [] access", "Iterating with .items()"],
          link: { url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries", label: "Python docs — dictionaries", kind: "docs" }
        },
        {
          t: "Nested structures: a list of dictionaries (the shape most real data takes)",
          sub: ["Accessing nested fields safely", "Why this shape mirrors JSON/API responses"],
          link: { url: "https://docs.python.org/3/tutorial/datastructures.html", label: "Python docs — data structures", kind: "docs" }
        },
        {
          t: "String manipulation: splitting, joining, formatting",
          sub: [".split()/.join()", "f-strings", "strip/replace/lower/upper"],
          link: { url: "https://realpython.com/python-f-strings/", label: "Real Python — f-strings", kind: "read" }
        },
        {
          t: "Solve 3–5 small logic problems combining loops + conditionals + data structures",
          link: { url: "https://exercism.org/tracks/python", label: "Exercism — Python track", kind: "practice" }
        },
        { t: "Self-test: build a 'contact book' script (add/list/search) from scratch, no reference" },
        { t: "Feynman rep: explain list vs dictionary with an example, out loud" }
      ]
    },
    {
      id: "f-p1b",
      index: "Phase 1b · Month 3",
      title: "Files, errors, first real program",
      bucket: "core",
      desc: "The threshold from beginner to programmer.",
      items: [
        {
          t: "Reading and writing files: text and JSON",
          sub: ["open() and context managers (with)", "json.load/json.dump", "File modes: r, w, a"],
          link: { url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files", label: "Python docs — reading/writing files", kind: "docs" }
        },
        {
          t: "Error handling (try/except): why programs fail, how to fail gracefully",
          sub: ["try/except/finally", "Catching specific exceptions vs bare except", "Raising your own exceptions"],
          link: { url: "https://docs.python.org/3/tutorial/errors.html", label: "Python docs — errors and exceptions", kind: "docs" }
        },
        { t: "Deliberately break your own working code 5 times, then fix it using error messages" },
        {
          t: "Micro-project: a command-line expense tracker that can add, save to JSON, load, and show a total",
          sub: ["Data model: list of dicts with amount/category/date", "Persist on every write, not just on exit"]
        },
        {
          t: "Expense tracker handles bad input without crashing",
          sub: ["Validate before you store", "try/except around user input parsing"]
        },
        { t: "Self-test: rebuild the expense tracker from scratch, timed, no reference" },
        { t: "Milestone: you've built and debugged a real program end to end", m: true }
      ]
    },
    {
      id: "f-p2a",
      index: "Phase 2a · Month 4",
      title: "Git & GitHub",
      bucket: "core",
      desc: "Version control as a real habit, not a checkbox.",
      items: [
        {
          t: "What version control is and why it exists",
          sub: ["Snapshots vs backups", "Why 'final_v2_FINAL.py' is the problem Git solves"],
          link: { url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control", label: "Pro Git — about version control", kind: "docs" }
        },
        {
          t: "git init, add, commit, status, log: practice on the expense tracker",
          sub: ["Staging area concept", "Writing a real commit message"],
          link: { url: "https://git-scm.com/docs/gittutorial", label: "Git — official tutorial", kind: "docs" }
        },
        {
          t: "Push to GitHub, write a real README",
          sub: ["What problem it solves, how to run it, what you learned"],
          link: { url: "https://docs.github.com/en/get-started/quickstart", label: "GitHub — quickstart", kind: "docs" }
        },
        {
          t: "Branches and merging: cause and resolve a deliberate conflict",
          sub: ["git branch/checkout/merge", "Reading conflict markers <<<< ==== >>>>"],
          link: { url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging", label: "Pro Git — branching and merging", kind: "docs" }
        },
        { t: "Expense tracker is public on GitHub with a proper README: portfolio piece #1" }
      ]
    },
    {
      id: "f-p2b",
      index: "Phase 2b · Month 5",
      title: "How the web works, first API",
      bucket: "core",
      desc: "Client and server, both sides.",
      items: [
        {
          t: "What an API is, HTTP requests/responses, what JSON is for",
          sub: ["GET/POST/PUT/DELETE", "Status codes: 200, 404, 500", "Headers vs body"],
          link: { url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", label: "MDN — HTTP overview", kind: "docs" }
        },
        {
          t: "Install FastAPI, build the simplest possible endpoint",
          sub: ["@app.get decorator", "Running with uvicorn", "The auto-generated /docs page"],
          link: { url: "https://fastapi.tiangolo.com/tutorial/first-steps/", label: "FastAPI — first steps", kind: "docs" }
        },
        {
          t: "Second endpoint that takes input and returns something computed",
          sub: ["Path params vs query params", "Request body with Pydantic models"],
          link: { url: "https://fastapi.tiangolo.com/tutorial/body/", label: "FastAPI — request body", kind: "docs" }
        },
        {
          t: "Call your own API from a separate script using requests",
          sub: ["requests.get/post", "Parsing .json() from a response"],
          link: { url: "https://requests.readthedocs.io/en/latest/user/quickstart/", label: "requests — quickstart", kind: "docs" }
        },
        {
          t: "Micro-project: turn the expense tracker into a real API",
          sub: ["Same logic, new interface: functions become endpoints"]
        },
        { t: "Self-test: explain step by step what happens when you call an API endpoint, no notes" },
        { t: "Milestone: you understand and can build the client-server model from scratch", m: true }
      ]
    },
    {
      id: "f-p3a",
      index: "Phase 3a · Month 6",
      title: "SQL & real databases",
      bucket: "core",
      desc: "Why flat files break down: you'll feel this directly.",
      items: [
        {
          t: "Why JSON flat-files break down at scale",
          sub: ["Concurrent write conflicts", "No query language, full-file rewrites"]
        },
        {
          t: "SQL fundamentals: SELECT, WHERE, INSERT, UPDATE, DELETE via SQLite",
          sub: ["Schema and data types", "Primary keys"],
          link: { url: "https://www.sqlitetutorial.net/", label: "SQLite Tutorial — full guide", kind: "docs" }
        },
        {
          t: "JOINs and GROUP BY on a small multi-table dataset",
          sub: ["INNER vs LEFT JOIN", "GROUP BY with aggregate functions (COUNT, SUM, AVG)"],
          link: { url: "https://www.sqlitetutorial.net/sqlite-join/", label: "SQLite Tutorial — joins", kind: "docs" }
        },
        {
          t: "Micro-project: migrate the expense tracker API from JSON file to SQLite",
          sub: ["sqlite3 module in Python", "Parameterized queries (never string-format SQL)"],
          link: { url: "https://docs.python.org/3/library/sqlite3.html", label: "Python docs — sqlite3 module", kind: "docs" }
        },
        {
          t: "Self-test: write 5 SQL queries against an unfamiliar database, timed",
          link: { url: "https://sqlzoo.net/", label: "SQLZoo — interactive practice", kind: "practice" }
        }
      ]
    },
    {
      id: "f-p3b",
      index: "Phase 3b · Month 7",
      title: "A real project, tied together",
      bucket: "core",
      desc: "Portfolio piece #2: your first multi-feature app.",
      items: [
        {
          t: "Plan a bigger project end to end (task manager or booking app) before touching code",
          sub: ["Entities and relationships first", "List endpoints before writing any code"]
        },
        { t: "Build incrementally: data model → endpoints → error handling → tests" },
        {
          t: "Add basic token-based authentication",
          sub: ["What a JWT actually contains", "Hashing passwords, never storing plaintext"],
          link: { url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/", label: "FastAPI — OAuth2 with JWT", kind: "docs" }
        },
        { t: "Push to GitHub with a clean README" },
        { t: "Milestone: you've independently designed, built, and shipped a small backend system", m: true }
      ]
    },
    {
      id: "f-p4a",
      index: "Phase 4a · Month 8",
      title: "Docker",
      bucket: "core",
      desc: "Solving 'works on my machine.'",
      items: [
        {
          t: "What containers are and why they exist",
          sub: ["Containers vs virtual machines", "Images vs containers"],
          link: { url: "https://docs.docker.com/get-started/docker-overview/", label: "Docker docs — overview", kind: "docs" }
        },
        {
          t: "Write a Dockerfile for the Month 7 project",
          sub: ["FROM, COPY, RUN, CMD", "Layer caching basics"],
          link: { url: "https://docs.docker.com/guides/python/", label: "Docker docs — Python guide", kind: "docs" }
        },
        {
          t: "docker-compose for API + real Postgres database",
          sub: ["services, ports, volumes", "Environment variables in compose"],
          link: { url: "https://docs.docker.com/compose/gettingstarted/", label: "Docker docs — Compose getting started", kind: "docs" }
        },
        { t: "Micro-project: fully containerize the Month 7 project" }
      ]
    },
    {
      id: "f-p4b",
      index: "Phase 4b · Month 9",
      title: "Cloud deployment (AWS)",
      bucket: "core",
      desc: "Live on the internet, containerized, with CI.",
      items: [
        {
          t: "AWS account setup, IAM basics: set a billing alert immediately",
          sub: ["Root account vs IAM user", "Free tier limits: set the alert first, before anything else"],
          link: { url: "https://docs.aws.amazon.com/billing/latest/userguide/budgets-managing-costs.html", label: "AWS docs — set a billing alert", kind: "docs" }
        },
        {
          t: "Deploy the containerized app to a live AWS service",
          sub: ["Elastic Beanstalk as the simplest path", "Security groups basics"],
          link: { url: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker.html", label: "AWS docs — deploy Docker to Beanstalk", kind: "docs" }
        },
        {
          t: "Environment variables and secrets management",
          sub: ["Why secrets never live in code or Git history", ".env files and .gitignore"],
          link: { url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html", label: "AWS docs — Secrets Manager intro", kind: "docs" }
        },
        {
          t: "Basic CI: GitHub Actions running tests on every push",
          sub: ["YAML workflow syntax", "Triggering on push vs pull_request"],
          link: { url: "https://docs.github.com/en/actions/writing-workflows/quickstart", label: "GitHub Actions — quickstart", kind: "docs" }
        },
        { t: "Self-test: rebuild the deploy pipeline from memory, timed" },
        { t: "Milestone: your project is live, containerized, with CI, and genuinely portfolio-competitive", m: true }
      ]
    },
    {
      id: "f-p5a",
      index: "Phase 5a · Month 10",
      title: "LLM fundamentals & prompting",
      bucket: "ai",
      desc: "2026's non-negotiable skill set, starting point.",
      items: [
        {
          t: "How LLMs work conceptually: tokens, context windows",
          sub: ["Tokenization basics", "Why context window length is a real constraint"],
          link: { url: "https://docs.anthropic.com/en/docs/build-with-claude/overview", label: "Anthropic docs — build with Claude overview", kind: "docs" }
        },
        {
          t: "Get an API key, make your first calls in Python",
          sub: ["Messages API shape", "System prompt vs user message"],
          link: { url: "https://docs.anthropic.com/en/api/getting-started", label: "Anthropic docs — getting started", kind: "docs" }
        },
        {
          t: "Prompt engineering: few-shot, system prompts, structured JSON outputs",
          sub: ["Few-shot examples steer format", "Asking for JSON explicitly and validating it"],
          link: { url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", label: "Anthropic docs — prompt engineering", kind: "docs" }
        },
        { t: "Micro-project: CLI tool that summarizes any text file via the API" },
        {
          t: "Build a tiny eval script: 5–10 test cases checking expected output",
          sub: ["What 'good enough' means for a test case", "Exact match vs fuzzy/semantic check"]
        },
        { t: "Feynman rep: explain why evals matter, out loud, to a non-technical listener" }
      ]
    },
    {
      id: "f-p5b",
      index: "Phase 5b · Month 11",
      title: "RAG & agents",
      bucket: "ai",
      desc: "Portfolio piece #3: an AI tool built end to end.",
      items: [
        {
          t: "What RAG is and why it exists: grounding in real data",
          sub: ["The hallucination problem RAG addresses", "Retrieval then generation, in that order"],
          link: { url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings", label: "Anthropic docs — embeddings", kind: "docs" }
        },
        {
          t: "Embeddings and vector search, concept then practice (Chroma or FAISS)",
          sub: ["What a vector 'distance' means", "Chunking strategy affects retrieval quality"],
          link: { url: "https://docs.trychroma.com/getting-started", label: "Chroma docs — getting started", kind: "docs" }
        },
        { t: "Micro-project: build 'chat with your own notes' by chunking, embedding, storing, and querying" },
        {
          t: "What an agent is (LLM + tools + a loop): build one with 2–3 tools",
          sub: ["Tool use / function calling shape", "The loop: think → call tool → observe → repeat"],
          link: { url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview", label: "Anthropic docs — tool use overview", kind: "docs" }
        },
        { t: "Self-test: explain chatbot vs RAG vs agent, no notes" },
        { t: "Milestone: an AI-powered tool built from data pipeline to working interface", m: true }
      ]
    },
    {
      id: "f-p6",
      index: "Phase 6 · Month 12",
      title: "Integrate AI into your real project",
      bucket: "ai",
      desc: "The FDE job description, in miniature.",
      items: [
        {
          t: "Scope one real AI feature for the Month 7 project",
          sub: ["Write the feature spec before code: input, output, failure behavior"]
        },
        { t: "Build end to end: data prep → RAG/prompt design → endpoint → UI → deploy" },
        {
          t: "Add error handling and rate-limiting around the AI calls",
          sub: ["What happens when the API is slow or down", "Basic rate-limit handling"]
        },
        { t: "Write a short case-study doc: problem → approach → tradeoffs → result" },
        { t: "Milestone: 'I shipped an AI feature into a deployed app, end to end'", m: true }
      ]
    },
    {
      id: "f-p7",
      index: "Phase 7 · Month 13",
      title: "Data engineering & system design",
      bucket: "core",
      desc: "Messy exports and ambiguous problems, without freezing.",
      items: [
        {
          t: "ETL concepts and pandas fundamentals: cleaning, merging, reshaping",
          sub: ["DataFrame basics", "merge/join, groupby, handling missing values"],
          link: { url: "https://pandas.pydata.org/docs/getting_started/index.html", label: "pandas docs — getting started", kind: "docs" }
        },
        {
          t: "Micro-project: clean a genuinely messy public dataset into an analysis-ready table",
          link: { url: "https://www.kaggle.com/datasets", label: "Kaggle — public datasets", kind: "tool" }
        },
        {
          t: "5–8 junior-level system design case studies, concept level",
          sub: ["Client-server, caching, load balancing at a plain-English level"],
          link: { url: "https://github.com/donnemartin/system-design-primer", label: "System Design Primer (GitHub)", kind: "read" }
        },
        { t: "Weekly drill: vague client problem → clarifying questions → MVP proposal, timed" },
        { t: "Milestone: handle a messy export and an ambiguous design prompt without freezing", m: true }
      ]
    },
    {
      id: "f-p8",
      index: "Phase 8 · Month 14",
      title: "Customer-facing skills",
      bucket: "customer",
      desc: "Talk about what you built without sounding like documentation.",
      items: [
        { t: "Study the FDE 'three hats' framing (consultant, PM, engineer) and write your own notes on what each means" },
        {
          t: "Practice translating technical decisions into plain business language",
          sub: ["Reliability, cost, and speed as the business-facing vocabulary"]
        },
        { t: "Write 3 mock client-requirement docs and the technical specs you'd propose" },
        { t: "Record a 5-minute walkthrough of your project for a non-technical stakeholder" },
        { t: "Self-test: Feynman-explain RAG, agents, and Docker each in under 60 seconds" },
        { t: "Milestone: you can talk about everything you built without sounding like a manual", m: true }
      ]
    },
    {
      id: "f-p9",
      index: "Phase 9 · Month 15",
      title: "Portfolio polish & applications",
      bucket: "customer",
      desc: "The finish line.",
      items: [
        { t: "Finalize GitHub repos for all 3 projects: READMEs, architecture notes, live links" },
        { t: "Write up the AI-feature and RAG tool as proper case studies" },
        { t: "Build/update resume: lead with shipped, deployed, AI-integrated work" },
        { t: "Build/update LinkedIn to mirror the resume" },
        {
          t: "Identify 20–30 target roles across startups, mid-tier SaaS, and consulting/GCC firms",
          link: { url: "https://www.linkedin.com/jobs/", label: "LinkedIn Jobs", kind: "tool" }
        },
        { t: "Weekly: 2–3 mock interviews, recorded and self-reviewed" },
        { t: "Weekly: 3–5 applications, tracked in a spreadsheet" },
        { t: "Final milestone: three deployed real projects, full stack, rehearsed interview reps", m: true }
      ]
    }
  ],

  advanced: [
    {
      id: "a-m1",
      index: "Month 1",
      title: "A second language & production code quality",
      bucket: "core",
      desc: "Python plus TypeScript, and code a client's team can maintain after you leave.",
      items: [
        {
          t: "TypeScript fundamentals: types, interfaces, why static typing matters for handoff",
          sub: ["Basic types and interfaces", "any vs unknown", "Compiling with tsc"],
          link: { url: "https://www.typescriptlang.org/docs/handbook/intro.html", label: "TypeScript Handbook", kind: "docs" }
        },
        { t: "Port one existing project's core logic to TypeScript, side by side" },
        {
          t: "Testing discipline: pytest and Jest, what makes a test useful vs decorative",
          sub: ["Arrange-act-assert structure", "Testing behavior, not implementation details"],
          link: { url: "https://docs.pytest.org/en/stable/getting-started.html", label: "pytest — getting started", kind: "docs" }
        },
        {
          t: "Set up linting, type checking, pre-commit hooks on an existing project",
          sub: ["ruff/eslint basics", "pre-commit framework"],
          link: { url: "https://pre-commit.com/", label: "pre-commit — official docs", kind: "docs" }
        },
        { t: "Micro-project: add a meaningful test suite to your foundation project's critical paths" },
        { t: "Self-test: spot 5 planted issues in a code review you build from your own past code" },
        { t: "Milestone: production-quality code in two languages, not just working code in one", m: true }
      ]
    },
    {
      id: "a-m2",
      index: "Month 2",
      title: "Advanced SQL & the modern data stack",
      bucket: "core",
      desc: "Snowflake, dbt, Airflow: talk credibly about a client's pipeline.",
      items: [
        {
          t: "Window functions: ROW_NUMBER, RANK, LAG/LEAD, running totals",
          sub: ["PARTITION BY vs GROUP BY", "Common uses: dedup, rank-within-group, running totals"],
          link: { url: "https://www.postgresql.org/docs/current/tutorial-window.html", label: "PostgreSQL docs — window functions", kind: "docs" }
        },
        {
          t: "CTEs and query optimization: reading an EXPLAIN plan, indexes",
          sub: ["WITH clauses for readability", "Seq scan vs index scan in EXPLAIN output"],
          link: { url: "https://www.postgresql.org/docs/current/using-explain.html", label: "PostgreSQL docs — using EXPLAIN", kind: "docs" }
        },
        {
          t: "Query performance against a genuinely large public dataset",
          link: { url: "https://www.kaggle.com/datasets", label: "Kaggle — public datasets", kind: "tool" }
        },
        {
          t: "What the modern data stack is: warehouses, dbt, Airflow, concept level",
          sub: ["Warehouse vs transactional database", "Transform-in-warehouse (ELT) vs classic ETL"],
          link: { url: "https://docs.getdbt.com/docs/introduction", label: "dbt docs — introduction", kind: "docs" }
        },
        {
          t: "Micro-project: load real data into BigQuery/Snowflake trial, dbt model, Airflow DAG in Docker",
          link: { url: "https://airflow.apache.org/docs/apache-airflow/stable/start.html", label: "Airflow docs — quickstart", kind: "docs" }
        },
        { t: "Self-test: diagnose and fix a slow query without hints" },
        { t: "Milestone: you can talk credibly about a client's data warehouse and pipeline", m: true }
      ]
    },
    {
      id: "a-m3",
      index: "Month 3",
      title: "Enterprise-grade API integration",
      bucket: "core",
      desc: "GraphQL, streaming, OAuth/SAML/SCIM, resilience patterns.",
      items: [
        {
          t: "GraphQL fundamentals: queries, mutations, schemas, vs REST",
          sub: ["Overfetching/underfetching problem GraphQL solves", "Resolvers, schema-first design"],
          link: { url: "https://graphql.org/learn/", label: "GraphQL.org — official learn guide", kind: "docs" }
        },
        {
          t: "Streaming APIs: websockets or SSE, one real-time feature end to end",
          sub: ["Persistent connection vs request/response", "When SSE beats websockets for one-way updates"],
          link: { url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events", label: "MDN — server-sent events", kind: "docs" }
        },
        {
          t: "OAuth 2.0 flow implemented against a real provider; conceptual SAML/SCIM",
          sub: ["Authorization code flow step by step", "Access token vs refresh token", "What SCIM automates (user provisioning)"],
          link: { url: "https://oauth.net/2/", label: "OAuth 2.0 — official site", kind: "docs" }
        },
        {
          t: "Resilience patterns: rate limiting, exponential backoff, retries, idempotency",
          sub: ["Backoff-with-jitter", "Idempotency keys for safe retries"],
          link: { url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", label: "AWS Builders' Library — retries & backoff", kind: "read" }
        },
        { t: "Micro-project: integrate with a real third-party API using proper auth and retries" },
        { t: "Feynman rep: why naive retries without backoff can make an outage worse" },
        { t: "Milestone: you can integrate with a messy real-world enterprise API", m: true }
      ]
    },
    {
      id: "a-m4",
      index: "Month 4",
      title: "Kubernetes & production systems",
      bucket: "core",
      desc: "Deploy the way a client's platform team actually runs production.",
      items: [
        {
          t: "What Kubernetes solves that Docker/compose doesn't",
          sub: ["Self-healing, scaling, rolling deploys across multiple machines"],
          link: { url: "https://kubernetes.io/docs/concepts/overview/", label: "Kubernetes docs — overview", kind: "docs" }
        },
        {
          t: "Core K8s concepts: pods, deployments, services, ConfigMaps/Secrets, local cluster",
          sub: ["Pod as the smallest deployable unit", "Deployment manages pod replicas", "Service exposes pods on a stable address"],
          link: { url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", label: "Kubernetes docs — basics tutorial", kind: "docs" }
        },
        {
          t: "Deploy your containerized project to a local K8s cluster",
          link: { url: "https://minikube.sigs.k8s.io/docs/start/", label: "minikube — get started", kind: "docs" }
        },
        {
          t: "Basic observability: logs, health checks, readiness/liveness probes",
          sub: ["kubectl logs", "Why liveness and readiness are different checks"],
          link: { url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", label: "Kubernetes docs — probes", kind: "docs" }
        },
        { t: "Micro-project: deploy to managed K8s with a rolling update and a rollback drill" },
        { t: "Self-test: explain Deployment vs Service, out loud, no notes" },
        { t: "Milestone: you can deploy and operate a system the way production actually runs", m: true }
      ]
    },
    {
      id: "a-m5",
      index: "Month 5",
      title: "Multi-agent orchestration",
      bucket: "ai",
      desc: "The single biggest 2026 differentiator. The most important month here.",
      items: [
        {
          t: "Why orchestration exists: a single LLM call is inference, not orchestration",
          sub: ["Multi-step reasoning with decision points between steps"]
        },
        {
          t: "The three recurring patterns: sequential, planner-executor-critic, multi-agent delegation",
          link: { url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", label: "LangGraph docs — multi-agent concepts", kind: "docs" }
        },
        {
          t: "Go deep on LangGraph: state, nodes, edges, checkpointer persistence",
          sub: ["Graph state as shared memory across steps", "Checkpointer for resuming interrupted runs"],
          link: { url: "https://langchain-ai.github.io/langgraph/concepts/low_level/", label: "LangGraph docs — low-level concepts", kind: "docs" }
        },
        { t: "Micro-project: build a planner-executor-critic system with retry on failure" },
        {
          t: "State and memory across steps that might span minutes, not just single-turn context",
          link: { url: "https://langchain-ai.github.io/langgraph/concepts/persistence/", label: "LangGraph docs — persistence", kind: "docs" }
        },
        {
          t: "Human-in-the-loop escalation branch for low confidence or repeated errors",
          link: { url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/", label: "LangGraph docs — human-in-the-loop", kind: "docs" }
        },
        { t: "Self-test: explain why routing real transactions needs branching/retry/escalation, no notes" },
        { t: "Milestone: a genuine multi-agent system with state, retries, and human escalation", m: true }
      ]
    },
    {
      id: "a-m6",
      index: "Month 6",
      title: "Evals, observability & guardrails",
      bucket: "ai",
      desc: "What makes a demo a deployment. Not optional, even though it feels like polish.",
      items: [
        { t: "Why evals are the gap between a demo and something a client will trust" },
        {
          t: "Build a structured eval suite for the Month 5 agent: correctness, edge cases, failure modes",
          sub: ["Golden dataset of expected inputs/outputs", "Grading: exact match, rubric, or LLM-as-judge"],
          link: { url: "https://docs.smith.langchain.com/evaluation/concepts", label: "LangSmith docs — evaluation concepts", kind: "docs" }
        },
        {
          t: "Retrieval/generation metrics for RAG: precision@K, groundedness",
          sub: ["Precision@K measures retrieval quality", "Groundedness measures whether the answer cites real retrieved content"],
          link: { url: "https://docs.ragas.io/en/stable/concepts/metrics/", label: "Ragas docs — RAG metrics", kind: "docs" }
        },
        {
          t: "Install and use LangSmith, Braintrust, or HoneyHive to trace a full agent run",
          link: { url: "https://docs.smith.langchain.com/", label: "LangSmith — documentation", kind: "docs" }
        },
        {
          t: "Build a guardrail and test it holds under adversarial input",
          sub: ["Input validation before the model sees it", "Output filtering before the user sees it"],
          link: { url: "https://guardrailsai.com/docs", label: "Guardrails AI — documentation", kind: "docs" }
        },
        { t: "Micro-project: add tracing, evals, and a guardrail to the Month 5 system; write up before/after" },
        { t: "Feynman rep: explain to a skeptical security team why your agent is safe to deploy" },
        { t: "Milestone: you can prove a system works, not just demo it once", m: true }
      ]
    },
    {
      id: "a-m7",
      index: "Month 7",
      title: "Fine-tuning & model-level trade-offs",
      bucket: "ai",
      desc: "Working knowledge of when fine-tuning beats prompting or RAG.",
      items: [
        { t: "When to fine-tune vs RAG/prompting: cost, latency, data volume, change frequency" },
        {
          t: "Hands-on with HuggingFace: load a pretrained model, run inference locally",
          sub: ["transformers pipeline() as the fast path", "Model cards and licensing"],
          link: { url: "https://huggingface.co/docs/transformers/quicktour", label: "HuggingFace docs — quick tour", kind: "docs" }
        },
        {
          t: "Light hands-on fine-tune of a small open model on a narrow task (Colab/free GPU)",
          sub: ["LoRA as a cheap fine-tuning method", "Preparing a small labeled dataset"],
          link: { url: "https://huggingface.co/docs/peft/quicktour", label: "HuggingFace PEFT docs — quick tour (LoRA)", kind: "docs" }
        },
        { t: "Evaluate the fine-tuned model against your Month 6 eval suite vs a prompted baseline" },
        { t: "Self-test: argue both sides of fine-tune vs not, for a hypothetical client, out loud" },
        { t: "Milestone: you've done the full fine-tuning loop once and can reason from experience", m: true }
      ]
    },
    {
      id: "a-m8",
      index: "Month 8",
      title: "Senior-level ownership & interview readiness",
      bucket: "customer",
      desc: "From 'communicates clearly' to 'leads a technical engagement.'",
      items: [
        { t: "Study how senior FDEs describe the role: translating vague asks, leading without authority" },
        { t: "Write a technical proposal from a vague, high-stakes prompt: scope, risks, phased plan" },
        { t: "Weekly drill: harder decomposition case study, ambiguous + multi-stakeholder, recorded" },
        { t: "Write a handoff guide for a project as if a client's team will maintain it" },
        { t: "Assemble your two strongest projects into full case studies with real metrics" },
        {
          t: "Full mock interview: behavioral, technical deep dive, senior-tier decomposition case",
          link: { url: "https://www.pramp.com/", label: "Pramp — free peer mock interviews", kind: "practice" }
        },
        { t: "Final milestone: you can lead a technical conversation and defend architecture with evidence", m: true }
      ]
    }
  ]
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  expense: {
    id: "expense",
    tag: "Month 3 · Foundation",
    title: "Expense Tracker CLI",
    objective: "Build a robust CLI with local data persistence",
    stack: "Python (argparse), JSON, SQLite",
    brief: "Design and build a command-line application that allows a user to log, categorize, and view daily expenses. This project forces you to handle messy user input, abstract your data storage layer, and gracefully migrate from flat files to a relational database.",
    requirements: [
      "Add Expense: Accept amount, category, and optional description via command arguments.",
      "View Summary: Display total expenses grouped by category or filtered by current month.",
      "Input Validation: System must not crash on invalid data (e.g., passing letters as an amount). Must return a clean, human-readable error.",
      "Data Abstraction: The core application logic must not know how data is saved. It should call a generic StorageInterface."
    ],
    schema: `Table: expenses
- id (INTEGER, Primary Key, Auto-increment)
- amount (REAL, Not Null)
- category (TEXT, Not Null)
- description (TEXT, Nullable)
- created_at (TIMESTAMP, Default CURRENT_TIMESTAMP)`,
    phases: [
      "Phase 1: Build the CLI interface and core logic, storing data temporarily in memory (lists/dicts).",
      "Phase 2: Implement a JSON storage adapter. Write tests to ensure data persists between terminal sessions.",
      "Phase 3: Implement an SQLite storage adapter. Migrate the system to use SQLite without changing the core CLI logic."
    ]
  },
  booking: {
    id: "booking",
    tag: "Month 7 · Foundation",
    title: "Booking System Backend",
    objective: "Build a secure, concurrent REST API",
    stack: "FastAPI, PostgreSQL, SQLAlchemy, Docker",
    brief: "Construct a backend system for booking 30-minute consultation slots. This project transitions you from writing scripts to architecting a distributed system. You must handle stateless authentication, database migrations, and concurrency race conditions.",
    requirements: [
      "Authentication: Users must register and log in to receive a JWT. Protected endpoints must reject unauthenticated requests.",
      "Slot Management: Admins can generate open slots. Users can fetch available slots and book them.",
      "Concurrency Safety: The system must strictly prevent double-bookings if two users attempt to book the exact same slot at the exact same millisecond.",
      "Containerization: The entire application (API and Database) must spin up via a single docker-compose up command."
    ],
    schema: `Table: users (id, email, password_hash, role)
Table: time_slots (id, start_time, end_time, is_booked)
Table: bookings (id, slot_id, user_id, status, booked_at)`,
    phases: [
      "Phase 1: Define SQLAlchemy models and set up Alembic for database migrations.",
      "Phase 2: Build user registration, password hashing (bcrypt), and JWT generation endpoints.",
      "Phase 3: Build the booking logic and write explicit integration tests demonstrating that simultaneous booking requests safely fail for the second user (Pessimistic locking via SELECT ... FOR UPDATE)."
    ]
  },
  rag: {
    id: "rag",
    tag: "Month 11 · Foundation",
    title: "RAG Document Assistant",
    objective: "Ground LLM responses in private data",
    stack: "LangChain, ChromaDB, Claude API, OpenAI Embeddings",
    brief: "Build a Retrieval-Augmented Generation (RAG) pipeline that allows users to 'chat' with a directory of raw markdown notes. This project bridges the gap between basic API calls and building a context-aware AI application that resists hallucination.",
    requirements: [
      "Data Ingestion: Recursively load .md and .txt files from a target directory.",
      "Semantic Chunking: Text must be split intelligently (respecting paragraphs and sentences) rather than arbitrarily cutting words in half.",
      "Vector Storage: Convert text chunks into embeddings and store them in a local vector database (ChromaDB or FAISS).",
      "Synthesized Response: Given a user query, retrieve the top 3 most relevant chunks and inject them into an LLM prompt to synthesize an accurate answer."
    ],
    pipeline: `1. Loaders: Read raw files into memory.
2. Splitters: RecursiveCharacterTextSplitter (chunk_size=800, overlap=100).
3. Embeddings: Convert text chunks to vector arrays.
4. Store: Save to local ChromaDB path.
5. Retriever: Query -> Vector Search -> Top K Results -> LLM Prompt.`,
    phases: [
      "Phase 1: Build the offline ingestion script. Test chunking strategies to ensure context isn't lost across boundaries.",
      "Phase 2: Implement the query script. Tune the retriever to fetch relevant results.",
      "Phase 3: Add conversational memory (history) so the user can ask follow-up questions referencing previous answers."
    ]
  },
  agent: {
    id: "agent",
    tag: "Month 5–6 · Advanced",
    title: "Evaluated Multi-Agent System",
    objective: "Build a resilient, stateful AI orchestrator",
    stack: "LangGraph, LangSmith, SQLite, External APIs",
    brief: "Develop a Planner-Executor-Critic agentic workflow capable of executing complex, multi-step tasks (e.g., researching a topic, compiling a report, and formatting it). The system must maintain state, recover from tool failures, and know when to ask a human for help.",
    requirements: [
      "Stateful Orchestration: Use LangGraph to define a state machine. The state must persist to a database (SQLite checkpointer) so runs can be paused and resumed.",
      "Fault Tolerance: If a tool fails or an API times out, the agent must catch the error, update an error counter in its state, and retry dynamically.",
      "Human-in-the-Loop: If the error counter exceeds 3, the graph must route to an 'escalate' node, suspending execution until a human provides input.",
      "Automated Evaluation: Write an evaluation suite that tests the agent against 10 specific edge cases, grading the output objectively."
    ],
    schema: `class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    current_plan: List[str]
    completed_steps: List[str]
    error_count: int
    requires_human: bool`,
    phases: [
      "Phase 1: Define the nodes (Planner, Worker, Critic) and the edges linking them.",
      "Phase 2: Attach the SQLite checkpointer and simulate a failure to test the human-in-the-loop interruption.",
      "Phase 3: Configure LangSmith tracing to visually monitor the execution graph. Build the eval suite and run it to establish a baseline success rate."
    ]
  }
};
