import type { CaseStudyDiagram } from "@/data/caseStudies";

// Keep NODE_W in sync with the node's w-40 class in WorkflowDiagram.
export const NODE_W = 160;
export const FRAME_PAD = 40;
// The frame's 3px border on each side.
export const BORDER_W = 6;

/** Outer width of the diagram frame: the workflow's span plus padding. */
export function diagramFrameWidth(diagram: CaseStudyDiagram) {
  const xs = diagram.nodes.map((n) => n.x);
  return Math.max(...xs) - Math.min(...xs) + NODE_W + FRAME_PAD * 2 + BORDER_W;
}