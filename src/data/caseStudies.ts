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
  {
    slug: "lead-scoring",
    title: "Lead Scoring",
    category: "AI automation",
    tagline:
      "An n8n workflow that scores real estate leads with AI, syncs them to HubSpot, and sends a tailored follow-up the moment a form is submitted.",
    stack: ["n8n", "AI", "HubSpot", "Gmail"],
    problem:
      "Real estate inquiries arrive all day, and they are not equal. Some people want to move this month, others are just browsing. Without a quick sort, hot leads wait in the same pile as cold ones, and every reply gets written by hand.",
    solution:
      "A form submission starts the workflow. An AI step reads the inquiry against a written rubric, labels it hot, warm, or cold, explains why, and drafts a reply that mentions what the lead actually said. Every lead lands in HubSpot as a contact with a deal, and hot leads also send an instant alert to the owner.",
    flow: [
      {
        title: "Capture",
        body: "A web form collects name, email, phone, whether they want to buy or sell, free-text details, budget or property value, and timeline.",
      },
      {
        title: "Score",
        body: "The AI step applies a written rubric and returns JSON: a tier (hot, warm, or cold), a one or two sentence reason, structured fields like location and financing, and a drafted follow-up email.",
      },
      {
        title: "Prepare",
        body: "A code step parses the JSON, merges in the contact details from the form, and formats the email as HTML with a booking button.",
      },
      {
        title: "Route",
        body: "A switch sends each lead down a hot, warm, or cold path. All three end up in HubSpot. Hot leads also trigger an instant email to the owner with contact details and the AI's reasoning.",
      },
      {
        title: "Sync",
        body: "Each lead becomes a HubSpot contact and a linked deal. Hot leads start at Qualified to Buy, the rest at Appointment Scheduled. The AI's reasoning is saved on the contact and the deal.",
      },
      {
        title: "Follow up",
        body: "The lead gets the AI-drafted email, written around what they submitted, with a link to book a call.",
      },
    ],
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
    decisions: [
      {
        title: "Score against a written rubric",
        body: "The prompt spells out what hot, warm, and cold mean: timeline, budget, financing, and how specific the request is. The model has to cite what the lead said, so every score can be checked.",
      },
      {
        title: "Keep the reasoning with the lead",
        body: "The AI's explanation is saved on the HubSpot contact and deal and quoted in the hot-lead alert. A person can see why a lead was scored that way and overrule it.",
      },
      {
        title: "Only hot leads interrupt",
        body: "Every lead is saved and gets a reply, but only hot ones trigger an alert. Deal stage also follows the tier, so hot leads start further down the pipeline.",
      },
    ],
    outcome: [
      "Every inquiry gets a tier, a written reason, and a personalized reply without anyone touching it.",
      "Hot leads reach the owner right away, with contact details and the AI's reasoning.",
      "Nothing is dropped. Warm and cold leads still become HubSpot contacts and deals.",
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);