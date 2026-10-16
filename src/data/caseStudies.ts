export interface CaseStudyPoint {
  title: string;
  body: string;
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