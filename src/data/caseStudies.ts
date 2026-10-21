export type DiagramNodeKind = "trigger" | "ai" | "logic" | "action";

export interface DiagramNode {
  id: string;
  label: string;
  /** Small second line under the label. */
  sub?: string;
  kind: DiagramNodeKind;
  x: number;
  y: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CaseStudyDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  stack: string[];
  problem: string;
  solution: string;
  diagram?: CaseStudyDiagram;
  outcome: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "invoice-processing",
    title: "Invoice Processing",
    category: "AI automation",
    tagline:
      "An n8n workflow that turns invoice files into checked, structured records in Airtable.",
    stack: ["n8n", "AI", "Airtable", "Google Drive", "Gmail"],
    problem:
      "Invoices arrive as PDFs and images in every layout, from different vendors. Typing the vendor, dates, totals, and line items into a system by hand is tedious, and one wrong digit in a total is easy to miss and hard to trace later. Trusting an AI to read them blindly is risky too, because a confident wrong answer looks just like a right one.",
    solution:
      "Drop a file into a Drive folder and the workflow does the rest. An AI vision model reads the invoice into a strict structure: vendor, dates, totals, every line item, and a confidence score. Then a code step checks the numbers independently. Line items must add up to the subtotal, and subtotal plus tax must equal the total, within two cents. If a check fails or confidence drops below 0.85, the invoice is flagged for review. Every invoice is saved to Airtable, with its line items in a linked table, and flagged ones also trigger an email with the exact reason.",
    diagram: {
      nodes: [
        { id: "upload", label: "Invoice uploaded", sub: "Google Drive folder", kind: "trigger", x: 0, y: 100 },
        { id: "extract", label: "Extract with AI", sub: "Vision model to JSON", kind: "ai", x: 240, y: 100 },
        { id: "validate", label: "Validate the math", sub: "Totals and confidence", kind: "logic", x: 480, y: 100 },
        { id: "review", label: "Needs review?", sub: "Any check failed", kind: "logic", x: 720, y: 100 },
        { id: "clean", label: "Save to Airtable", sub: "Clean record", kind: "action", x: 960, y: 20 },
        { id: "flagged", label: "Flag and alert", sub: "Airtable · Gmail", kind: "action", x: 960, y: 180 },
      ],
      edges: [
        { from: "upload", to: "extract" },
        { from: "extract", to: "validate" },
        { from: "validate", to: "review" },
        { from: "review", to: "clean", label: "clean" },
        { from: "review", to: "flagged", label: "flagged" },
      ],
    },
    outcome:
      "Every invoice now ends up as a structured Airtable record, with its line items linked and the source file attached for quick checking. Because the math is verified separately from the AI, wrong or uncertain extractions are caught instead of silently saved. Flagged records keep a written reason, so a person can fix them in place rather than re-entering anything.",
  },
  {
    slug: "lead-scoring",
    title: "Lead Scoring",
    category: "AI automation",
    tagline:
      "An n8n workflow that scores real estate leads with AI, syncs them to HubSpot, and sends a tailored follow-up the moment a form is submitted.",
    stack: ["n8n", "AI", "HubSpot", "Gmail"],
    problem:
      "Real estate inquiries arrive all day, and they are not equal. Some people want to move this month, others are just browsing. Without a quick sort, hot leads wait in the same pile as cold ones, and every reply gets written by hand. The leads most ready to act are the ones that can least afford to wait for a response.",
    solution:
      "A short web form collects name, contact details, whether the lead wants to buy or sell, free-text details, budget or property value, and timeline. An AI step reads the inquiry against a written rubric covering timeline, budget, financing, and how specific the request is. It returns a tier (hot, warm, or cold), a one or two sentence reason, structured details like location and financing, and a drafted reply. Every lead is saved to HubSpot as a contact with a deal. Hot leads start further down the pipeline and also trigger an instant alert to the owner. Each lead then gets the AI-drafted email, written around what they submitted, with a link to book a call.",
    diagram: {
      nodes: [
        { id: "form", label: "Lead form", sub: "Buy or sell inquiry", kind: "trigger", x: 0, y: 100 },
        { id: "score", label: "Score with AI", sub: "Rubric and reasoning", kind: "ai", x: 240, y: 100 },
        { id: "route", label: "Route by tier", sub: "Hot, warm, or cold", kind: "logic", x: 480, y: 100 },
        { id: "alert", label: "Hot lead alert", sub: "Gmail · to the owner", kind: "action", x: 720, y: 20 },
        { id: "hubspot", label: "Sync to HubSpot", sub: "Contact and deal", kind: "action", x: 720, y: 180 },
        { id: "followup", label: "Send follow-up", sub: "Gmail · AI-drafted", kind: "action", x: 960, y: 180 },
      ],
      edges: [
        { from: "form", to: "score" },
        { from: "score", to: "route" },
        { from: "route", to: "alert", label: "hot" },
        { from: "route", to: "hubspot", label: "all tiers" },
        { from: "hubspot", to: "followup" },
      ],
    },
    outcome:
      "Every inquiry now gets a tier, a written reason, and a personalized reply without anyone touching it. Hot leads reach the owner right away with contact details and the AI's reasoning, so the people ready to act are seen first. Nothing is dropped: warm and cold leads still become HubSpot contacts and deals, and the reasoning stays on both so a person can review or overrule any score.",
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);