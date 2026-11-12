export type DiagramNodeKind = "trigger" | "ai" | "logic" | "action";

export interface DiagramNode {
  id: string;
  label: string;
  /** Small second line under the label. */
  sub?: string;
  /** Longer explanation, shown when the step is selected. */
  note?: string;
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

export interface StoryPoint {
  title: string;
  body: string;
}

export interface StoryStat {
  value: string;
  label: string;
  note: string;
}

/** The long-form Problem / Solution / Result content. */
export interface CaseStudyStory {
  problem: { headline: string; body: string; points: StoryPoint[] };
  solution: {
    headline: string;
    body: string;
    stats: StoryStat[];
    pull: string;
  };
  result: {
    headline: string;
    body: string;
    points: StoryPoint[];
    takeaway: string;
  };
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
  story?: CaseStudyStory;
  outcome: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "invoice-processing",
    title: "Invoice Processing",
    category: "AI automation",
    tagline:
      "An n8n workflow that turns invoice files into checked, structured records in Airtable.",
    stack: ["n8n", "Airtable", "Google Drive", "Gmail"],
    problem:
      "Invoices arrive as PDFs and images in every layout, from different vendors. Typing the vendor, dates, totals, and line items into a system by hand is tedious, and one wrong digit in a total is easy to miss and hard to trace later. Trusting an AI to read them blindly is risky too, because a confident wrong answer looks just like a right one.",
    solution:
      "Drop a file into a Drive folder and the workflow does the rest. An AI vision model reads the invoice into a strict structure: vendor, dates, totals, every line item, and a confidence score. Then a code step checks the numbers independently. Line items must add up to the subtotal, and subtotal plus tax must equal the total, within two cents. If a check fails or confidence drops below 0.85, the invoice is flagged for review. Every invoice is saved to Airtable, with its line items in a linked table, and flagged ones also trigger an email with the exact reason.",
    diagram: {
      nodes: [
        {
          id: "upload",
          label: "Invoice uploaded",
          sub: "Google Drive folder",
          kind: "trigger",
          x: 0,
          y: 100,
          note: "A Google Drive trigger watches an Invoice Intake folder every minute. Dropping a file in is all it takes to start a run.",
        },
        {
          id: "extract",
          label: "Extract with AI",
          sub: "Vision model to JSON",
          kind: "ai",
          x: 240,
          y: 100,
          note: "The file goes to an AI vision model with a strict JSON schema: vendor, invoice and PO numbers, dates, currency, subtotal, tax, total, every line item, and a self-rated confidence score.",
        },
        {
          id: "validate",
          label: "Validate the math",
          sub: "Totals and confidence",
          kind: "logic",
          x: 480,
          y: 100,
          note: "A code step parses the response and checks the math itself. Line items must add up to the subtotal, and subtotal plus tax must equal the total, within two cents. Malformed JSON gets flagged with the parse error as the reason.",
        },
        {
          id: "review",
          label: "Needs review?",
          sub: "Any check failed",
          kind: "logic",
          x: 720,
          y: 100,
          note: "If any check fails, or confidence is under 0.85, the invoice is marked for review. Otherwise it is saved as clean.",
        },
        {
          id: "clean",
          label: "Save to Airtable",
          sub: "Clean record",
          kind: "action",
          x: 960,
          y: 20,
          note: "The invoice goes into the Invoices table in Airtable, with one linked row per line item and the source file attached.",
        },
        {
          id: "flagged",
          label: "Flag and alert",
          sub: "Airtable · Gmail",
          kind: "action",
          x: 960,
          y: 180,
          note: "Flagged invoices are saved too, marked Needs Review with a written reason. An email goes out with the invoice number, vendor, total, and that reason.",
        },
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
    story: {
      problem: {
        headline: "A wrong digit looks exactly like a right one.",
        body: "Invoices come in as PDFs and images, laid out differently by every vendor. Typing the vendor, dates, totals, and line items into a system by hand is slow, and the mistakes it creates are quiet ones. Nobody notices a transposed digit until the books stop adding up. Handing the reading to AI removes the typing, but not the risk. A model can return a clean, confident answer that is simply wrong.",
        points: [
          {
            title: "No two invoices look alike",
            body: "Layouts, labels, and currencies change from one vendor to the next, so a fixed template never holds for long.",
          },
          {
            title: "Mistakes hide in plain sight",
            body: "A mistyped total or a missed line item rarely looks like a mistake. It shows up later, in a reconciliation, when it costs more to trace.",
          },
          {
            title: "A confident answer can still be wrong",
            body: "A model that sounds sure can still misread a number. Without an independent check, a wrong answer and a right one look identical.",
          },
        ],
      },
      solution: {
        headline: "Extract fast. Verify independently. Escalate clearly.",
        body: "Dropping a file into a Drive folder starts the workflow. An AI vision model turns the invoice into a strict structure: vendor, invoice and PO numbers, dates, currency, subtotal, tax, total, every line item, and its own confidence score. A separate code step then recomputes the arithmetic without trusting the model. Everything lands in Airtable, with line items in a linked table and the original file attached. If a check fails, the record is flagged and an email explains why.",
        stats: [
          {
            value: "0.85",
            label: "Confidence floor",
            note: "Below it, the invoice is flagged instead of accepted.",
          },
          {
            value: "±0.02",
            label: "Math tolerance",
            note: "Line items must match the subtotal, and subtotal plus tax must match the total.",
          },
          {
            value: "1 min",
            label: "Folder check",
            note: "The Drive trigger looks for new files in the intake folder every minute.",
          },
          {
            value: "2",
            label: "Linked tables",
            note: "Invoices and line items in Airtable, with the source file attached.",
          },
        ],
        pull: "The model's output is a draft. The code decides whether it moves forward.",
      },
      result: {
        headline: "Every invoice leaves a record. Every exception leaves a reason.",
        body: "Invoices now arrive in Airtable as structured, linked records with the source file attached. The ones that pass go through untouched. The ones that don't are caught by the checks, saved anyway, and flagged with a written reason, so a person fixes the record in place instead of starting again.",
        points: [
          {
            title: "Structured by default",
            body: "Vendor, dates, totals, and line items land in a consistent format, with line items linked to their invoice.",
          },
          {
            title: "Questionable data is caught",
            body: "Failed math, low confidence, or unreadable output is flagged, never silently accepted.",
          },
          {
            title: "Exceptions explain themselves",
            body: "The alert names the invoice, the vendor, the total, and exactly why it needs a look.",
          },
        ],
        takeaway:
          "Speed from the model. Trust from the checks. Judgment left to people.",
      },
    },
  },
  {
    slug: "lead-scoring",
    title: "Lead Scoring",
    category: "AI automation",
    tagline:
      "An n8n workflow that scores real estate leads with AI, syncs them to HubSpot, and sends a tailored follow-up the moment a form is submitted.",
    stack: ["n8n", "HubSpot", "Gmail"],
    problem:
      "Real estate inquiries arrive all day, and they are not equal. Some people want to move this month, others are just browsing. Without a quick sort, hot leads wait in the same pile as cold ones, and every reply gets written by hand. The leads most ready to act are the ones that can least afford to wait for a response.",
    solution:
      "A short web form collects name, contact details, whether the lead wants to buy or sell, free-text details, budget or property value, and timeline. An AI step reads the inquiry against a written rubric covering timeline, budget, financing, and how specific the request is. It returns a tier (hot, warm, or cold), a one or two sentence reason, structured details like location and financing, and a drafted reply. Every lead is saved to HubSpot as a contact with a deal. Hot leads start further down the pipeline and also trigger an instant alert to the owner. Each lead then gets the AI-drafted email, written around what they submitted, with a link to book a call.",
    diagram: {
      nodes: [
        {
          id: "form",
          label: "Lead form",
          sub: "Buy or sell inquiry",
          kind: "trigger",
          x: 0,
          y: 100,
          note: "A web form collects name, email, phone, whether the lead wants to buy or sell, free-text details, budget or property value, and timeline.",
        },
        {
          id: "score",
          label: "Score with AI",
          sub: "Rubric and reasoning",
          kind: "ai",
          x: 240,
          y: 100,
          note: "The AI applies a written rubric: timeline, budget, financing, and how specific the request is. It returns a tier (hot, warm, or cold), a short reason, structured details, and a drafted follow-up email.",
        },
        {
          id: "route",
          label: "Route by tier",
          sub: "Hot, warm, or cold",
          kind: "logic",
          x: 480,
          y: 100,
          note: "A switch sends each lead down its hot, warm, or cold path. All three end up in HubSpot, and hot leads also trigger an alert.",
        },
        {
          id: "alert",
          label: "Hot lead alert",
          sub: "Gmail · to the owner",
          kind: "action",
          x: 720,
          y: 20,
          note: "Hot leads trigger an instant email to the owner with their contact details, location, must-haves, and the AI's reasoning.",
        },
        {
          id: "hubspot",
          label: "Sync to HubSpot",
          sub: "Contact and deal",
          kind: "action",
          x: 720,
          y: 180,
          note: "Each lead becomes a HubSpot contact and a linked deal. Hot leads start at Qualified to Buy, the rest at Appointment Scheduled. The AI's reasoning is saved on both.",
        },
        {
          id: "followup",
          label: "Send follow-up",
          sub: "Gmail · AI-drafted",
          kind: "action",
          x: 960,
          y: 180,
          note: "The lead gets the AI-drafted email, written around what they submitted, with a link to book a call.",
        },
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
    story: {
      problem: {
        headline: "The leads ready to act are the ones that can least afford to wait.",
        body: "Real estate inquiries arrive at all hours, and they are not equal. Some people want to move this month, others are just browsing, and both come through the same form looking much alike. Without a quick sort, hot leads wait in the same pile as cold ones, and every reply gets written by hand. The fastest answer goes to whoever happens to sit at the top of the inbox.",
        points: [
          {
            title: "Not every lead is equal",
            body: "A buyer with financing and a short timeline and someone idly browsing look nearly the same on arrival.",
          },
          {
            title: "Speed goes to the wrong lead",
            body: "Replying in the order leads arrive means the most ready lead can wait behind the least ready one.",
          },
          {
            title: "Thoughtful replies don't scale",
            body: "Writing a reply around what each person actually said takes time, so replies end up generic or late.",
          },
        ],
      },
      solution: {
        headline: "Score every lead. Explain the score. Reply in their words.",
        body: "A short web form collects contact details, whether the lead wants to buy or sell, free-text details, budget or property value, and timeline. An AI step reads the inquiry against a written rubric covering timeline, budget, financing, and how specific the request is. It returns a tier, a short reason, structured details like location and financing, and a drafted reply. A switch routes each lead by tier. All three become a HubSpot contact with a linked deal, and hot leads also trigger an instant email to the owner. Each lead then gets the drafted reply, written around what they submitted, with a link to book a call.",
        stats: [
          {
            value: "7",
            label: "Form fields",
            note: "Contact details, buy or sell, free-text details, budget or value, and timeline.",
          },
          {
            value: "3",
            label: "Lead tiers",
            note: "Hot, warm, or cold, scored against a written rubric.",
          },
          {
            value: "≤3 mo",
            label: "Hot timeline",
            note: "A move within about three months is one of the signals the rubric treats as hot.",
          },
          {
            value: "2",
            label: "Deal stages",
            note: "Hot leads start at Qualified to Buy, the rest at Appointment Scheduled.",
          },
        ],
        pull: "The score comes with its reasoning, so a person can check it and overrule it.",
      },
      result: {
        headline: "Every lead gets answered. The ready ones get noticed first.",
        body: "Every inquiry now gets a tier, a written reason, and a personalized reply without anyone touching it. Hot leads reach the owner right away, so the people ready to act are seen first. Warm and cold leads aren't dropped. They still become contacts and deals, with the reasoning saved so a person can review or overrule any score.",
        points: [
          {
            title: "Hot leads surface first",
            body: "The owner gets an instant email with contact details, location, must-haves, and the reason for the score.",
          },
          {
            title: "Nothing falls through",
            body: "Warm and cold leads still land in HubSpot as contacts with deals, at the stage that fits their tier.",
          },
          {
            title: "Scores can be checked",
            body: "The AI's reasoning is saved on the contact and the deal, so a person can see why and overrule it.",
          },
        ],
        takeaway: "Every lead answered. The ready ones noticed first.",
      },
    },
  },
  {
    slug: "ap-automation",
    title: "Finance Automation",
    category: "AI automation",
    tagline:
      "A Make.com scenario that reads emailed invoices with AI, runs a chain of validation checks, and creates QuickBooks bills for the ones that pass.",
    stack: ["Make.com", "Gmail", "QuickBooks", "Google Sheets"],
    problem:
      "Accounts payable starts with invoices landing in an inbox as PDFs. Someone has to open each one, retype the vendor, dates, and amounts, look for duplicates and missing purchase orders, and decide what needs approval before anything reaches the books. It is repetitive, and a duplicate or a wrong total can slip through when everything is checked by eye. Automating it blindly is risky too, because a bad extraction turns into a bad bill.",
    solution:
      "A Make.com scenario watches an inbox for new emails with attachments and sends the PDF to an AI model. The model returns structured data: vendor, invoice number, dates, PO number, currency, subtotal, tax, total, and every line item. The invoice then passes through a chain of checks. The invoice number is looked up in a Google Sheets log to catch duplicates, the line items must add up to the subtotal, subtotal plus tax must equal the total, and a purchase order number is required. Any failure is logged as flagged, with the reason. Invoices that pass and come in under 500 become QuickBooks bills automatically, with their line items carried over, and are logged with the bill ID. Larger invoices are logged as pending approval instead.",
    diagram: {
      nodes: [
        {
          id: "email",
          label: "Invoice emailed",
          sub: "Gmail · PDF attached",
          kind: "trigger",
          x: 0,
          y: 110,
          note: "A Make.com trigger watches an inbox for new unread emails with attachments, takes the PDF, and marks the email as read.",
        },
        {
          id: "extract",
          label: "Extract with AI",
          sub: "PDF to structured data",
          kind: "ai",
          x: 240,
          y: 110,
          note: "The PDF goes to an AI model that returns vendor, invoice number, dates, PO number, currency, subtotal, tax, total, and every line item. Missing fields come back empty instead of being skipped.",
        },
        {
          id: "route",
          label: "Validate and route",
          sub: "Checks, then threshold",
          kind: "logic",
          x: 480,
          y: 110,
          note: "The invoice runs through a chain of checks: a duplicate invoice number in the Google Sheets log, line items matching the subtotal, subtotal plus tax matching the total, and a PO number. Passing invoices are then split at the 500 approval threshold.",
        },
        {
          id: "flagged",
          label: "Log as flagged",
          sub: "Sheets · with reason",
          kind: "action",
          x: 720,
          y: 0,
          note: "An invoice that fails any check is logged to Google Sheets as flagged, with the reason.",
        },
        {
          id: "pending",
          label: "Log for approval",
          sub: "Sheets · over 500",
          kind: "action",
          x: 720,
          y: 110,
          note: "Invoices of 500 or more that pass every check are logged as pending approval instead of becoming bills.",
        },
        {
          id: "bill",
          label: "Create bill",
          sub: "QuickBooks · then log",
          kind: "action",
          x: 720,
          y: 220,
          note: "Invoices under 500 that pass become QuickBooks bills automatically, with their line items carried over, and are logged with the bill ID.",
        },
      ],
      edges: [
        { from: "email", to: "extract" },
        { from: "extract", to: "route" },
        { from: "route", to: "flagged", label: "failed" },
        { from: "route", to: "pending", label: "over 500" },
        { from: "route", to: "bill", label: "under 500" },
      ],
    },
    outcome:
      "Emailed invoices are read, checked, and logged without anyone retyping them. Duplicates, mismatched totals, missing purchase orders, and bad line items are caught and recorded with a reason, so a person looks at them instead of them becoming bills. Small, clean invoices become QuickBooks bills on their own, and larger ones wait in the log for approval, so people only review what needs it.",
    story: {
      problem: {
        headline: "Before an invoice becomes a bill, someone has to trust it.",
        body: "Accounts payable starts with invoices landing in an inbox as PDFs. Someone opens each one, retypes the vendor, dates, and amounts, hunts for duplicates and missing purchase orders, and decides what needs approval before anything reaches the books. It is repetitive work, and the errors it produces are quiet ones: a duplicate booked twice, a total that doesn't match its line items. Automating it blindly doesn't fix that, because a bad extraction simply becomes a bad bill.",
        points: [
          {
            title: "Retyping is slow and error-prone",
            body: "Vendor, dates, totals, and every line item get keyed in by hand, one invoice at a time.",
          },
          {
            title: "Problems hide until later",
            body: "Duplicates, missing purchase orders, and totals that don't add up are easy to miss by eye.",
          },
          {
            title: "Blind automation is risky",
            body: "If an AI reads an invoice and a bill is created straight away, a wrong extraction goes into the books.",
          },
        ],
      },
      solution: {
        headline: "Read it, test it, then decide what happens next.",
        body: "A Make.com scenario watches an inbox for new emails with attachments and sends the PDF to an AI model. The model returns structured data: vendor, invoice number, dates, PO number, currency, subtotal, tax, total, and every line item. The invoice then runs through a chain of checks. Its number is looked up in a Google Sheets log to catch duplicates, the line items must add up to the subtotal, subtotal plus tax must equal the total, and a purchase order number is required. Any failure is logged as flagged, with the reason. Invoices that pass and come in under 500 become QuickBooks bills automatically, with their line items carried over, and are logged with the bill ID. Larger invoices are logged as pending approval instead.",
        stats: [
          {
            value: "9",
            label: "Fields extracted",
            note: "Plus every line item, with description, quantity, unit price, and amount.",
          },
          {
            value: "4",
            label: "Checks per invoice",
            note: "Duplicate number, line items against subtotal, totals, and purchase order.",
          },
          {
            value: "500",
            label: "Approval threshold",
            note: "Under it, passing invoices become bills. At 500 or more, they wait for approval.",
          },
          {
            value: "3",
            label: "Possible outcomes",
            note: "Flagged, pending approval, or processed, each recorded in the Sheets log.",
          },
        ],
        pull: "A bill is only created after every check has passed.",
      },
      result: {
        headline: "Clean invoices post themselves. Everything else says why.",
        body: "Emailed invoices are now read, checked, and logged without anyone retyping them. Duplicates, mismatched totals, missing purchase orders, and bad line items are caught and recorded with a reason, so a person looks at them instead of them becoming bills. Small, clean invoices become QuickBooks bills on their own, and larger ones wait in the log for approval, so people only review what needs it.",
        points: [
          {
            title: "Bills without retyping",
            body: "Passing invoices under 500 go to QuickBooks with the vendor, due date, document number, and every line item carried over.",
          },
          {
            title: "Problems caught before the books",
            body: "Duplicates, missing POs, and totals that don't match their line items are flagged, not posted.",
          },
          {
            title: "A log of every decision",
            body: "Each invoice is written to a Google Sheets log as flagged, pending approval, or processed with its bill ID.",
          },
        ],
        takeaway: "Routine invoices post themselves. Risky ones stop and say why.",
      },
    },
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);