import type { StackCategory } from "@/components/ui/StackScatter";

export const stackCategories: StackCategory[] = [
  {
    key: "frontend",
    label: "Frontend",
    icons: [
      { name: "HTML", icon: "/icons/stack/frontend/html.svg", x: 82, y: 50, size: 38, rotation: -12 },
      { name: "CSS", icon: "/icons/stack/frontend/css.svg", x: 74, y: 76, size: 32, rotation: 18 },
      { name: "JavaScript", icon: "/icons/stack/frontend/javascript.svg", x: 55, y: 90, size: 44, rotation: -8 },
      { name: "React", icon: "/icons/stack/frontend/react.svg", x: 32, y: 88, size: 40, rotation: 22 },
      { name: "TypeScript", icon: "/icons/stack/frontend/typescript.svg", x: 14, y: 72, size: 30, rotation: -20 },
      { name: "Tailwind CSS", icon: "/icons/stack/frontend/tailwindcss.svg", x: 8, y: 46, size: 36, rotation: 10 },
      { name: "Bootstrap", icon: "/icons/stack/frontend/bootstrap.svg", x: 16, y: 20, size: 28, rotation: -15 },
      { name: "Vite", icon: "/icons/stack/frontend/vite.svg", x: 36, y: 8, size: 34, rotation: 25 },
      { name: "Angular", icon: "/icons/stack/frontend/angular.svg", x: 60, y: 8, size: 42, rotation: -6 },
      { name: "Next.js", icon: "/icons/stack/frontend/nextjs.svg", x: 78, y: 22, size: 30, rotation: 14 },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icons: [
      { name: "Java", icon: "/icons/stack/backend/java.svg", x: 84, y: 50, size: 40, rotation: -18 },
      { name: "Node.js", icon: "/icons/stack/backend/nodejs.svg", x: 76, y: 74, size: 36, rotation: 8 },
      { name: "PHP", icon: "/icons/stack/backend/php.svg", x: 58, y: 88, size: 30, rotation: -24 },
      { name: "MySQL", icon: "/icons/stack/backend/mysql.svg", x: 36, y: 88, size: 46, rotation: 16 },
      { name: "PostgreSQL", icon: "/icons/stack/backend/postgresql.svg", x: 18, y: 74, size: 32, rotation: -10 },
      { name: "Supabase", icon: "/icons/stack/backend/supabase.svg", x: 8, y: 50, size: 38, rotation: 20 },
      {
        name: "Express.js",
        icon: {
          light: "/icons/stack/backend/expressjs-light.svg",
          dark: "/icons/stack/backend/expressjs-dark.svg",
        },
        x: 18,
        y: 26,
        size: 34,
        rotation: -14,
      },
      { name: "MongoDB", icon: "/icons/stack/backend/mongodb.svg", x: 36, y: 12, size: 28, rotation: 12 },
      { name: "OAuth", icon: "/icons/stack/backend/oauth.svg", x: 58, y: 12, size: 42, rotation: -22 },
      { name: "JWT", icon: "/icons/stack/backend/jwt.svg", x: 76, y: 26, size: 30, rotation: 6 },
    ],
  },
  {
    key: "automation",
    label: "AI Automation",
    icons: [
      { name: "n8n", icon: "/icons/stack/ai-automation/n8n.svg", x: 80, y: 50, size: 42, rotation: -16 },
      { name: "Make.com", icon: "/icons/stack/ai-automation/make.svg", x: 50, y: 85, size: 36, rotation: 24 },
      { name: "Zapier", icon: "/icons/stack/ai-automation/zapier.svg", x: 20, y: 50, size: 40, rotation: -9 },
      { name: "GoHighLevel", icon: "/icons/stack/ai-automation/gohighlevel.svg", x: 50, y: 15, size: 32, rotation: 19 },
    ],
  },
];