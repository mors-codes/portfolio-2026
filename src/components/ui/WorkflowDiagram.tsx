"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import {
  Background,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { GitBranch, Send, Sparkles, Zap } from "lucide-react";
import "@xyflow/react/dist/style.css";
import type { CaseStudyDiagram, DiagramNodeKind } from "@/data/caseStudies";

type NodeState = "idle" | "active" | "path" | "dimmed";

// Node objects stay fixed. Highlight state flows through context, because
// swapping the nodes array on every hover makes React Flow re-measure the
// nodes, and they flicker.
type StepData = { label: string; sub?: string; kind: DiagramNodeKind };
type StepNode = Node<StepData, "step">;

type DiagramState = {
  states: Record<string, NodeState>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
};

const DiagramContext = createContext<DiagramState>({
  states: {},
  selectedId: null,
  onToggle: () => {},
  onHover: () => {},
});

const KIND_META = {
  trigger: { label: "Trigger", Icon: Zap, color: "#E5405E" },
  ai: { label: "AI", Icon: Sparkles, color: "#6C47FF" },
  logic: { label: "Logic", Icon: GitBranch, color: "#F59E0B" },
  action: { label: "Action", Icon: Send, color: "#16A34A" },
} as const;

// Edges take the color of the node they point to.
const edgeColor = (diagram: CaseStudyDiagram, targetId: string) => {
  const kind = diagram.nodes.find((n) => n.id === targetId)?.kind;
  return kind ? KIND_META[kind].color : "var(--color-ink)";
};

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" } as const;

// Keep NODE_W in sync with the node's w-40 below.
const NODE_W = 160;
const FRAME_PAD = 40;
// The frame's 3px border on each side.
const BORDER_W = 6;
// Wait before un-highlighting, so crossing the gap between nodes doesn't flash.
const LEAVE_DELAY = 120;
// Auto-run: how long each step stays lit.
const STEP_MS = 2800;

function StepNodeView({ id, data }: NodeProps<StepNode>) {
  const { states, selectedId, onToggle, onHover } = useContext(DiagramContext);
  const state = states[id] ?? "idle";
  const { label: kindLabel, Icon, color } = KIND_META[data.kind];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selectedId === id}
      onClick={() => onToggle(id)}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => {
        // Mouse only, so a tap on a phone doesn't leave a stuck hover.
        if (e.pointerType === "mouse") onHover(id);
      }}
      onPointerLeave={() => onHover(null)}
      className={`pointer-events-auto w-40 cursor-pointer border-[3px] bg-bg px-3 py-2.5 text-ink transition-[opacity,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
        state === "dimmed" ? "opacity-30" : "opacity-100"
      }`}
      style={{
        borderColor: color,
        boxShadow: state === "active" ? `4px 4px 0 0 ${color}` : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={HANDLE_STYLE}
      />
      <div className="mb-2 flex items-center justify-between">
        <span
          className="px-1.5 py-0.5 font-mono text-[8px] tracking-wider text-white uppercase"
          style={{ backgroundColor: color }}
        >
          {kindLabel}
        </span>
        <Icon size={13} strokeWidth={2.25} color={color} aria-hidden="true" />
      </div>
      <p className="font-sans text-[14px] leading-tight font-medium">
        {data.label}
      </p>
      {data.sub && (
        <p className="mt-1 font-sans text-[11px] leading-tight font-light opacity-60">
          {data.sub}
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={HANDLE_STYLE}
      />
    </div>
  );
}

// Must live outside the component so React Flow gets a stable reference.
const NODE_TYPES = { step: StepNodeView };

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

// Every node reachable from `start`, following edges forward or backward.
function reach(diagram: CaseStudyDiagram, start: string, forward: boolean) {
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const e of diagram.edges) {
      const [near, far] = forward ? [e.from, e.to] : [e.to, e.from];
      if (near === cur && !seen.has(far)) {
        seen.add(far);
        stack.push(far);
      }
    }
  }
  return seen;
}

export default function WorkflowDiagram({
  diagram,
}: {
  diagram: CaseStudyDiagram;
}) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

  // A step the visitor picked (hover or click) wins over the auto-run.
  const userId = hovered ?? selected;

  // Auto-run: steps through the nodes, left to right, while nobody is interacting.
  const order = useMemo(
    () => [...diagram.nodes].sort((a, b) => a.x - b.x || a.y - b.y),
    [diagram],
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const paused = engaged || userId !== null;
  const autoId = !reduced && started ? (order[autoIndex]?.id ?? null) : null;

  const activeId = userId ?? autoId;
  const activeNode = diagram.nodes.find((n) => n.id === activeId);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView || paused || order.length < 2) return;
    const t = window.setInterval(
      () => setAutoIndex((i) => (i + 1) % order.length),
      STEP_MS,
    );
    return () => window.clearInterval(t);
  }, [reduced, inView, paused, order.length]);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  const onHover = useCallback((id: string | null) => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (id) setHovered(id);
    else leaveTimer.current = window.setTimeout(() => setHovered(null), LEAVE_DELAY);
  }, []);

  const toggle = useCallback(
    (id: string) => setSelected((cur) => (cur === id ? null : id)),
    [],
  );

  // Frame width follows the workflow: its span plus padding.
  const frameWidth = useMemo(() => {
    const xs = diagram.nodes.map((n) => n.x);
    return (
      Math.max(...xs) - Math.min(...xs) + NODE_W + FRAME_PAD * 2 + BORDER_W
    );
  }, [diagram]);

  // A picked step lights its whole route. The auto-run lights only the way
  // there, so it reads like a run moving through the workflow.
  const route = useMemo(() => {
    if (!activeId) return null;
    return {
      up: reach(diagram, activeId, false),
      down: userId ? reach(diagram, activeId, true) : new Set([activeId]),
    };
  }, [diagram, activeId, userId]);

  const states = useMemo(() => {
    const out: Record<string, NodeState> = {};
    for (const n of diagram.nodes) {
      if (!route) out[n.id] = "idle";
      else if (n.id === activeId) out[n.id] = "active";
      else if (route.up.has(n.id) || route.down.has(n.id)) out[n.id] = "path";
      else out[n.id] = "dimmed";
    }
    return out;
  }, [diagram, route, activeId]);

  const context = useMemo<DiagramState>(
    () => ({ states, selectedId: selected, onToggle: toggle, onHover }),
    [states, selected, toggle, onHover],
  );

  // Built once per diagram. Never rebuilt on hover.
  const nodes = useMemo<StepNode[]>(
    () =>
      diagram.nodes.map(
        (n): StepNode => ({
          id: n.id,
          type: "step",
          position: { x: n.x, y: n.y },
          data: { label: n.label, sub: n.sub, kind: n.kind },
        }),
      ),
    [diagram],
  );

  const edges = useMemo<Edge[]>(
    () =>
      diagram.edges.map((e): Edge => {
        const onRoute =
          !route ||
          (route.up.has(e.from) && route.up.has(e.to)) ||
          (route.down.has(e.from) && route.down.has(e.to));
        const color = edgeColor(diagram, e.to);
        return {
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          type: "smoothstep",
          animated: !reduced,
          label: e.label,
          style: {
            stroke: color,
            strokeWidth: route && onRoute ? 3.5 : 2.5,
            opacity: onRoute ? 1 : 0.15,
            transition: "opacity 200ms",
          },
          labelStyle: {
            fill: color,
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            opacity: onRoute ? 1 : 0.2,
          },
          labelShowBg: true,
          labelBgStyle: {
            fill: "var(--color-bg)",
            opacity: onRoute ? 1 : 0.2,
          },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 0,
        };
      }),
    [diagram, route, reduced],
  );

  return (
    <div
      ref={wrapRef}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setEngaged(true);
      }}
      onPointerLeave={() => setEngaged(false)}
    >
      <figure
        aria-label="Workflow diagram"
        className="m-0 mx-auto max-w-full overflow-x-auto border-[3px] border-ink bg-bg"
        style={{ width: frameWidth }}
      >
        <div className="h-85" style={{ minWidth: frameWidth - BORDER_W }}>
          <DiagramContext.Provider value={context}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={NODE_TYPES}
              proOptions={{ hideAttribution: true }}
              fitView
              fitViewOptions={{ padding: `${FRAME_PAD}px` }}
              minZoom={0.2}
              maxZoom={1}
              nodesDraggable={false}
              nodesConnectable={false}
              nodesFocusable={false}
              edgesFocusable={false}
              elementsSelectable={false}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              preventScrolling={false}
              onPaneClick={() => setSelected(null)}
            >
              <Background
                gap={24}
                size={2.4}
                color="var(--color-ink)"
                style={{ opacity: 0.18 }}
              />
            </ReactFlow>
          </DiagramContext.Provider>
        </div>
      </figure>

      <div
        aria-live={userId ? "polite" : "off"}
        className="mx-auto mt-4 max-w-full"
        style={{ width: frameWidth }}
      >
        <div
          className="min-h-40 border-[3px] border-ink/20 px-5 py-4 transition-colors"
          style={{
            borderLeftColor: activeNode
              ? KIND_META[activeNode.kind].color
              : undefined,
          }}
        >
          {activeNode ? (
            <>
              <p
                className="font-mono text-[10px] tracking-[1.08px] uppercase"
                style={{ color: KIND_META[activeNode.kind].color }}
              >
                {KIND_META[activeNode.kind].label}
              </p>
              <p className="mt-1 font-sans text-base font-medium tracking-tight">
                {activeNode.label}
              </p>
              {activeNode.note && (
                <p className="mt-2 max-w-3xl font-sans text-sm font-light leading-relaxed text-ink/70">
                  {activeNode.note}
                </p>
              )}
            </>
          ) : (
            <p className="font-mono text-[10px] tracking-[1.08px] text-ink/40 uppercase">
              Hover or tap a step to see what it does
            </p>
          )}
        </div>
      </div>
    </div>
  );
}