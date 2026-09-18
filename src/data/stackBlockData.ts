export interface StackBlockTool {
  name: string;
  icon: string | { light: string; dark: string };
}

export interface StackBlockCategory {
  key: string;
  label: string;
  tools: StackBlockTool[];
}

export const stackBlockCategories: StackBlockCategory[] = [
  {
    key: "frontend",
    label: "Frontend",
    tools: [
      { name: "HTML", icon: "/icons/stack/frontend/html.svg" },
      { name: "CSS", icon: "/icons/stack/frontend/css.svg" },
      { name: "JavaScript", icon: "/icons/stack/frontend/javascript.svg" },
      { name: "React", icon: "/icons/stack/frontend/react.svg" },
      { name: "TypeScript", icon: "/icons/stack/frontend/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/stack/frontend/tailwindcss.svg" },
      { name: "Bootstrap", icon: "/icons/stack/frontend/bootstrap.svg" },
      { name: "Vite", icon: "/icons/stack/frontend/vite.svg" },
      { name: "Angular", icon: "/icons/stack/frontend/angular.svg" },
      { name: "Next.js", icon: "/icons/stack/frontend/nextjs.svg" },
      {
        name: "GSAP",
        icon: {
          light: "/icons/stack/frontend/gsap-light.svg",
          dark: "/icons/stack/frontend/gsap-dark.svg",
        },
      },
    ],
  },
  {
    key: "design",
    label: "Design & Prototyping",
    tools: [
      { name: "Figma", icon: "/icons/stack/frontend/figma.svg" },
      { name: "Canva", icon: "/icons/stack/frontend/canva.svg" },
    ],
  },
  {
    key: "backend",
    label: "Backend & Database",
    tools: [
      { name: "Java", icon: "/icons/stack/backend/java.svg" },
      { name: "Node.js", icon: "/icons/stack/backend/nodejs.svg" },
      { name: "PHP", icon: "/icons/stack/backend/php.svg" },
      { name: "MySQL", icon: "/icons/stack/backend/mysql.svg" },
      { name: "PostgreSQL", icon: "/icons/stack/backend/postgresql.svg" },
      { name: "Supabase", icon: "/icons/stack/backend/supabase.svg" },
      {
        name: "Express.js",
        icon: {
          light: "/icons/stack/backend/expressjs-light.svg",
          dark: "/icons/stack/backend/expressjs-dark.svg",
        },
      },
      { name: "MongoDB", icon: "/icons/stack/backend/mongodb.svg" },
      { name: "OAuth", icon: "/icons/stack/backend/oauth.svg" },
      { name: "JWT", icon: "/icons/stack/backend/jwt.svg" },
    ],
  },
  {
    key: "automation",
    label: "AI Automation",
    tools: [
      { name: "n8n", icon: "/icons/stack/ai-automation/n8n.svg" },
      { name: "Make.com", icon: "/icons/stack/ai-automation/make.svg" },
      { name: "Zapier", icon: "/icons/stack/ai-automation/zapier.svg" },
      { name: "GoHighLevel", icon: "/icons/stack/ai-automation/gohighlevel.svg" },
    ],
  },
  {
    key: "integrations",
    label: "Integrations & Productivity",
    tools: [
      { name: "Slack", icon: "/icons/stack/ai-automation/slack.svg" },
      { name: "Gmail", icon: "/icons/stack/ai-automation/gmail.svg" },
      { name: "Google Sheets", icon: "/icons/stack/ai-automation/sheets.svg" },
      { name: "HubSpot", icon: "/icons/stack/ai-automation/hubspot.svg" },
      { name: "Airtable", icon: "/icons/stack/ai-automation/airtable.svg" },
      {
        name: "Notion",
        icon: {
          light: "/icons/stack/ai-automation/notion-light.svg",
          dark: "/icons/stack/ai-automation/notion-dark.svg",
        },
      },
      { name: "ClickUp", icon: "/icons/stack/ai-automation/clickup.svg" },
    ],
  },
  {
    key: "devtools",
    label: "Developer Tools & AI",
    tools: [
      { name: "Git", icon: "/icons/stack/devtools/git.svg" },
      {
        name: "Github",
        icon: {
          light: "/icons/stack/devtools/github-light.svg",
          dark: "/icons/stack/devtools/github-dark.svg",
        },
      },
      {
        name: "Vercel",
        icon: {
          light: "/icons/stack/devtools/vercel-light.svg",
          dark: "/icons/stack/devtools/vercel-dark.svg",
        },
      },
      {
        name: "OpenAI",
        icon: {
          light: "/icons/stack/ai-automation/openai-light.svg",
          dark: "/icons/stack/ai-automation/openai-dark.svg",
        },
      },
      { name: "Gemini AI", icon: "/icons/stack/ai-automation/gemini.svg" },
      { name: "Claude AI", icon: "/icons/stack/ai-automation/claude.svg" },
    ],
  },
];