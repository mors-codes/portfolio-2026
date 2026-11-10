"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import {
  Background,
  BaseEdge,
  EdgeText,
  getSmoothStepPath,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { GitBranch, Send, Sparkles, Zap } from "lucide-react";
import "@xyflow/react/dist/style.css";
import type { CaseStudyDiagram, DiagramNodeKind } from "@/data/caseStudies";

type NodeState = "idle" | "active" | "dimmed";

// Node objects stay fixed. Highlight state flows through context, because
// swapping the nodes array on every step makes React Flow re-measure the
// nodes, and they flicker.
type StepData = { label: string; sub?: string; kind: DiagramNodeKind };
type StepNode = Node<StepData, "step">;

type PipeFill = "empty" | "filling" | "full";
type FlowEdgeData = {
  fill: PipeFill;
  /** Changes on every trip, so the water restarts. */
  fillKey: number;
  /** ms to wait before the water starts moving (for multi-pipe trips). */
  delay: number;
  duration: number;
  color: string;
  fromColor: string;
};
type FlowEdgeType = Edge<FlowEdgeData, "flow">;

type Travel = {
  key: number;
  plan: Map<string, { delay: number; duration: number }>;
};

type DiagramState = {
  states: Record<string, NodeState>;
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Changes whenever a step starts its lap, so the lap restarts. */
  lapKey: number;
};

const DiagramContext = createContext<DiagramState>({
  states: {},
  activeId: null,
  onSelect: () => {},
  lapKey: 0,
});

const KIND_META = {
  trigger: { label: "Trigger", Icon: Zap, color: "#E5405E" },
  ai: { label: "AI", Icon: Sparkles, color: "#6C47FF" },
  logic: { label: "Logic", Icon: GitBranch, color: "#F59E0B" },
  action: { label: "Action", Icon: Send, color: "#16A34A" },
} as const;

// Water takes the color of the node it flows into.
const edgeColor = (diagram: CaseStudyDiagram, targetId: string) => {
  const kind = diagram.nodes.find((n) => n.id === targetId)?.kind;
  return kind ? KIND_META[kind].color : "var(--color-ink)";
};

const edgeId = (e: { from: string; to: string }) => `${e.from}-${e.to}`;

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" } as const;

// Keep NODE_W in sync with the node's w-40 below.
const NODE_W = 160;
const FRAME_PAD = 40;
// The frame's 3px border on each side.
const BORDER_W = 6;
// How long a step "works": the line runs once around its border.
const LAP_MS = 1800;
// How long the water takes to reach the next step.
const TRAVEL_MS = 900;

// Line weights: the lines between nodes, and the node borders.
const LINE_W = 2;
const RING_W = 2;

/* ---------------------------------- water ---------------------------------- */

function Water({
  path,
  color,
  fill,
  delay,
  duration,
}: {
  path: string;
  color: string;
  fill: PipeFill;
  delay: number;
  duration: number;
}) {
  const ref = useRef<SVGGElement>(null);
  const filling = fill === "filling";

  // The water front moves from the start of the path to the end.
  useEffect(() => {
    const g = ref.current;
    if (!g || !filling) return;
    const runs = Array.from(g.querySelectorAll("path")).map((p) =>
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration,
        delay,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "both",
      }),
    );
    return () => runs.forEach((r) => r.cancel());
  }, [filling, delay, duration]);

  // pathLength=1 with a "1 1" dash is a solid line that can be revealed by
  // sliding strokeDashoffset from 1 to 0. Offset 1 = empty, 0 = full.
  const common = {
    d: path,
    fill: "none",
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: filling ? 1 : 0,
  } as const;

  return (
    <g
      ref={ref}
      style={{
        pointerEvents: "none",
        opacity: fill === "empty" ? 0 : 1,
        // Water drains away smoothly; it appears instantly when it starts filling.
        transition: fill === "empty" ? "opacity 400ms" : "none",
      }}
    >
      <path {...common} stroke={color} strokeWidth={LINE_W} />
    </g>
  );
}

function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  data,
}: EdgeProps<FlowEdgeType>) {
  const [path, labelX, labelY] = getSmoothStepPath({
    borderRadius: 0,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const uid = useId().replace(/:/g, "");
  const gradId = `edge-${uid}-${id}`;

  return (
    <>
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" style={{ stopColor: data?.fromColor }} />
          <stop offset="100%" style={{ stopColor: data?.color }} />
        </linearGradient>
      </defs>
      <BaseEdge
        path={path}
        style={{
          stroke: `url(#${gradId})`,
          strokeWidth: LINE_W,
          opacity: 0.3,
          strokeLinejoin: "round",
        }}
      />
      {data && (
        <Water
          key={data.fillKey}
          path={path}
          color={`url(#${gradId})`}
          fill={data.fill}
          delay={data.delay}
          duration={data.duration}
        />
      )}
      {label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
        />
      )}
    </>
  );
}

// Must live outside the component so React Flow gets stable references.
const EDGE_TYPES = { flow: FlowEdge };

/* ----------------------------------- node ---------------------------------- */

function StepNodeView({ id, data }: NodeProps<StepNode>) {
  const { states, activeId, onSelect, lapKey } = useContext(DiagramContext);
  const state = states[id] ?? "idle";
  const active = state === "active";
  const { label: kindLabel, Icon, color } = KIND_META[data.kind];

  // The visible border is drawn in SVG, so it needs the node's real size.
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setSize((cur) => (cur && cur.w === w && cur.h === h ? cur : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  // Rectangle along the outer edge, starting at the top-left corner and
  // running clockwise. Inset by half the line weight so it isn't clipped.
  const r = RING_W / 2;
  const ring = size
    ? `M${r} ${r} H${size.w - r} V${size.h - r} H${r} Z`
    : "";

  return (
    <div
      ref={boxRef}
      role="button"
      tabIndex={0}
      aria-current={activeId === id ? "step" : undefined}
      onClick={() => onSelect(id)}
      onKeyDown={onKeyDown}
      className={`pointer-events-auto relative w-40 cursor-pointer border-[3px] border-transparent bg-bg px-3 py-2.5 text-ink transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
        state === "dimmed" ? "opacity-30" : "opacity-100"
      }`}
    >
      {size && (
        <svg
          aria-hidden="true"
          width={size.w}
          height={size.h}
          className="pointer-events-none absolute -top-0.75 -left-0.75"
          style={{ overflow: "visible" }}
        >
          {/* The border. Faint while the step is working, so the lap shows. */}
          <path
            d={ring}
            fill="none"
            stroke={color}
            strokeWidth={RING_W}
            opacity={active ? 0.3 : 1}
            style={{ transition: "opacity 200ms" }}
          />
          {/* The lap: runs once around the border while the step is active. */}
          {active && (
            <path
              key={lapKey}
              className="node-lap"
              d={ring}
              fill="none"
              stroke={color}
              strokeWidth={RING_W}
              pathLength={1}
              strokeDasharray="1 1"
              style={{ animationDuration: `${LAP_MS}ms` }}
            />
          )}
        </svg>
      )}
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

const NODE_TYPES = { step: StepNodeView };

/* --------------------------------- helpers --------------------------------- */

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

// The node itself plus every node before it, following edges backward.
function ancestors(diagram: CaseStudyDiagram, start: string) {
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const e of diagram.edges) {
      if (e.to === cur && !seen.has(e.from)) {
        seen.add(e.from);
        stack.push(e.from);
      }
    }
  }
  return seen;
}

// Which pipes need to fill to reach `targetId`, and when each one starts.
// Pipes fill one after another along the route, all within `total` ms.
function planTravel(
  diagram: CaseStudyDiagram,
  targetId: string,
  full: Set<string>,
  total: number,
) {
  const anc = ancestors(diagram, targetId);
  const routeEdges = diagram.edges.filter(
    (e) => anc.has(e.from) && anc.has(e.to),
  );

  const level = new Map<string, number>();
  const levelOf = (id: string): number => {
    const known = level.get(id);
    if (known !== undefined) return known;
    const ins = routeEdges.filter((e) => e.to === id);
    const v = ins.length
      ? 1 + Math.max(...ins.map((e) => levelOf(e.from)))
      : 0;
    level.set(id, v);
    return v;
  };

  const todo = routeEdges.filter((e) => !full.has(edgeId(e)));
  if (todo.length === 0) return null;

  const levels = todo.map((e) => levelOf(e.from));
  const min = Math.min(...levels);
  const seg = total / (Math.max(...levels) - min + 1);

  const plan = new Map<string, { delay: number; duration: number }>();
  for (const e of todo) {
    plan.set(edgeId(e), {
      delay: (levelOf(e.from) - min) * seg,
      duration: seg,
    });
  }
  return plan;
}

/* -------------------------------- component -------------------------------- */

export default function WorkflowDiagram({
  diagram,
}: {
  diagram: CaseStudyDiagram;
}) {
  const reduced = useReducedMotion();

  // The flow goes through the steps left to right and loops. A step runs a lap
  // around its border, then water runs along the pipe into the next step,
  // which starts its own lap. Clicking a step starts the flow from that step.
  const order = useMemo(
    () => [...diagram.nodes].sort((a, b) => a.x - b.x || a.y - b.y),
    [diagram],
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  // Index (in `order`) of the step that is working.
  const [lit, setLit] = useState<number | null>(null);
  const litRef = useRef<number | null>(null);
  const [lapKey, setLapKey] = useState(0);
  const [travel, setTravel] = useState<Travel | null>(null);
  const travelCount = useRef(0);
  const timer = useRef<number | null>(null);
  const runRef = useRef<(i: number) => void>(() => {});

  const activeId = lit !== null ? (order[lit]?.id ?? null) : null;
  const activeNode = diagram.nodes.find((n) => n.id === activeId);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  // Start step `i`: its lap begins. When the lap ends, water fills the pipes
  // into the next step, and then that step starts.
  const run = useCallback(
    (i: number) => {
      const node = order[i];
      if (!node) return;
      clearTimer();
      litRef.current = i;
      setTravel(null);
      setLit(i);
      setLapKey((k) => k + 1);
      if (reduced || order.length < 2) return;

      timer.current = window.setTimeout(() => {
        const nextIdx = (i + 1) % order.length;
        const next = order[nextIdx];

        // Pipes already full on the way to this step don't fill again.
        const anc = ancestors(diagram, node.id);
        const full = new Set(
          diagram.edges
            .filter((e) => anc.has(e.from) && anc.has(e.to))
            .map(edgeId),
        );
        const plan = planTravel(diagram, next.id, full, TRAVEL_MS);

        // Nothing to fill (the loop restarting at the first step).
        if (!plan) {
          runRef.current(nextIdx);
          return;
        }

        travelCount.current += 1;
        setTravel({ key: travelCount.current, plan });
        timer.current = window.setTimeout(
          () => runRef.current(nextIdx),
          TRAVEL_MS,
        );
      }, LAP_MS);
    },
    [order, diagram, reduced, clearTimer],
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  // Starts the flow the first time the diagram scrolls into view, pauses it
  // when it leaves, and picks up again when it comes back.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          clearTimer();
          return;
        }
        if (reduced) return;
        if (!startedRef.current) {
          startedRef.current = true;
          runRef.current(0);
        } else {
          runRef.current(litRef.current ?? 0);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, clearTimer]);

  const onSelect = useCallback(
    (id: string) => {
      const i = order.findIndex((n) => n.id === id);
      if (i >= 0) runRef.current(i);
    },
    [order],
  );

  // Frame width follows the workflow: its span plus padding.
  const frameWidth = useMemo(() => {
    const xs = diagram.nodes.map((n) => n.x);
    return (
      Math.max(...xs) - Math.min(...xs) + NODE_W + FRAME_PAD * 2 + BORDER_W
    );
  }, [diagram]);

  // The pipes that hold water once the current step has arrived.
  const route = useMemo(
    () => (activeId ? ancestors(diagram, activeId) : null),
    [diagram, activeId],
  );

  const states = useMemo(() => {
    const out: Record<string, NodeState> = {};
    for (const n of diagram.nodes) {
      if (!activeId) out[n.id] = "idle";
      else out[n.id] = n.id === activeId ? "active" : "dimmed";
    }
    return out;
  }, [diagram, activeId]);

  const context = useMemo<DiagramState>(
    () => ({ states, activeId, onSelect, lapKey }),
    [states, activeId, onSelect, lapKey],
  );

  // Built once per diagram. Never rebuilt when the step changes.
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

  const edges = useMemo<FlowEdgeType[]>(
    () =>
      diagram.edges.map((e): FlowEdgeType => {
        const id = edgeId(e);
        const planned = travel?.plan.get(id);
        const inRoute = !!route && route.has(e.from) && route.has(e.to);
        const fill: PipeFill = planned ? "filling" : inRoute ? "full" : "empty";
        const color = edgeColor(diagram, e.to);
        return {
          id,
          source: e.from,
          target: e.to,
          type: "flow",
          label: e.label,
          data: {
            fill,
            fillKey: planned && travel ? travel.key : 0,
            delay: planned?.delay ?? 0,
            duration: planned?.duration ?? TRAVEL_MS,
            color,
            fromColor: edgeColor(diagram, e.from),
          },
          labelStyle: {
            fill: color,
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            opacity: fill === "empty" ? 0.45 : 1,
          },
          labelShowBg: true,
          labelBgStyle: { fill: "var(--color-bg)" },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 0,
        };
      }),
    [diagram, route, travel],
  );

  return (
    <div ref={wrapRef}>
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
              edgeTypes={EDGE_TYPES}
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
        aria-live="off"
        className="mx-auto mt-4 max-w-full"
        style={{ width: frameWidth }}
      >
        <div
          className="border-[3px] border-ink/20 px-5 py-4 transition-colors"
          style={{
            borderLeftColor: activeNode
              ? KIND_META[activeNode.kind].color
              : undefined,
          }}
        >
          {activeNode ? (
            <div key={activeNode.id} className="note-in">
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
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/70">
                  {activeNode.note}
                </p>
              )}
            </div>
          ) : (
            <p className="note-in font-mono text-[10px] tracking-[1.08px] text-ink/40 uppercase">
              Click a step to see what it does
            </p>
          )}
        </div>
      </div>
    </div>
  );
}