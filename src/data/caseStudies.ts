export interface CaseStudyPoint {
  title: string;
  body: string;
}

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
  flow: CaseStudyPoint[];
  diagram?: CaseStudyDiagram;
  decisions: CaseStudyPoint[];
  outcome: string[];
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
      "Invoices arrive as PDFs and images in every layout. Typing vendor, dates, totals, and line items into a system by hand is tedious, and one wrong digit in a total is hard to catch later.",
    solution:
      "Drop a file into a Drive folder and the workflow does the rest. An AI vision model reads the invoice, code re-checks the numbers independently, and the result lands in Airtable. Anything doubtful is flagged and emailed instead of trusted.",
    flow: [
      {
        title: "Intake",
        body: "A Google Drive trigger watches an Invoice Intake folder every minute. An upload form feeds the same pipeline for testing, so both paths reach the AI step the same way.",
      },
      {
        title: "Extract",
        body: "The file goes to an AI vision model with a strict JSON schema: vendor, invoice and PO numbers, dates, currency, subtotal, tax, total, every line item, and a self-rated confidence score.",
      },
      {
        title: "Validate",
        body: "A code step parses the response and checks the math itself. Line items must add up to the subtotal, and subtotal plus tax must equal the total, within two cents.",
      },
      {
        title: "Route",
        body: "If any check fails, or confidence is under 0.85, the invoice is marked for review. Otherwise it is saved as clean.",
      },
      {
        title: "Save",
        body: "Both paths write to Airtable: one record in Invoices, plus one row per line item in a linked Line Items table, with the source file attached.",
      },
      {
        title: "Alert",
        body: "Flagged invoices also trigger an email with the invoice number, vendor, total, and the exact reason it was flagged.",
      },
    ],
    diagram: {
      nodes: [
        { id: "watch", label: "Watch intake folder", sub: "Drive · every minute", kind: "trigger", x: 0, y: 40 },
        { id: "form", label: "Test upload form", sub: "For testing", kind: "trigger", x: 0, y: 160 },
        { id: "fetch", label: "Fetch file", sub: "Get the invoice file", kind: "action", x: 200, y: 100 },
        { id: "extract", label: "Extract with AI", sub: "Vision model to JSON", kind: "ai", x: 400, y: 100 },
        { id: "validate", label: "Validate the math", sub: "Totals and confidence", kind: "logic", x: 600, y: 100 },
        { id: "review", label: "Needs review?", sub: "Any check failed", kind: "logic", x: 800, y: 100 },
        { id: "clean", label: "Save as clean", sub: "Airtable · Invoices", kind: "action", x: 1040, y: 0 },
        { id: "flagged", label: "Save as flagged", sub: "Airtable · Needs Review", kind: "action", x: 1040, y: 100 },
        { id: "alert", label: "Email alert", sub: "Gmail · with reason", kind: "action", x: 1040, y: 200 },
        { id: "items", label: "Save line items", sub: "Airtable · linked rows", kind: "action", x: 1240, y: 50 },
      ],
      edges: [
        { from: "watch", to: "fetch" },
        { from: "form", to: "fetch" },
        { from: "fetch", to: "extract" },
        { from: "extract", to: "validate" },
        { from: "validate", to: "review" },
        { from: "review", to: "clean", label: "clean" },
        { from: "review", to: "flagged", label: "flagged" },
        { from: "review", to: "alert", label: "flagged" },
        { from: "clean", to: "items" },
        { from: "flagged", to: "items" },
      ],
    },
    decisions: [
      {
        title: "Don't trust the AI's confidence alone",
        body: "Self-reported confidence is one signal. The math check catches confident but wrong extractions, which are the ones that cause real problems.",
      },
      {
        title: "Fail safe, not silent",
        body: "If the model returns malformed JSON, the workflow flags the invoice and keeps the raw output instead of crashing. Nothing disappears.",
      },
      {
        title: "Save flagged invoices too",
        body: "Doubtful records still go into Airtable, marked Needs Review with a written reason. A person fixes them in place instead of re-entering them.",
      },
    ],
    outcome: [
      "Every invoice ends up as a structured record, with its line items linked.",
      "Bad or uncertain extractions are caught and explained, not silently saved.",
      "Each record keeps a link to its source file for quick checking.",
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);