import type { StackCategory } from "@/components/ui/StackScatter";

// Fill in `icon` paths once you've dropped your SVGs into /public/icons/.
export const stackCategories: StackCategory[] = [
  {
    key: "frontend",
    label: "Frontend",
    icons: [
      { name: "React", icon: "" },
      { name: "TypeScript", icon: "" },
      { name: "Tailwind", icon: "" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icons: [
      { name: "Supabase", icon: "" },
      { name: "Node.js", icon: "" },
    ],
  },
  {
    key: "automation",
    label: "AI Automation",
    icons: [
      { name: "n8n", icon: "" },
      { name: "Make.com", icon: "" },
      { name: "Zapier", icon: "" },
      { name: "Gemini API", icon: "" },
    ],
  },
];