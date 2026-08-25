"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card ${customClass ?? ""} ${className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLDivElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  onCardClick?: (idx: number) => void;
  onFrontChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
    (
      {
        width = 500,
        height = 400,
        cardDistance = 60,
        verticalDistance = 70,
        delay = 5000,
        onCardClick,
        onFrontChange,
        skewAmount = 6,
        easing = "elastic",
        children,
      },
      ref
    ) => {
    const config =
      easing === "elastic"
        ? { ease: "elastic.out(0.6,0.9)", duration: 0.9 }
        : { ease: "power1.inOut", duration: 0.6 };

    const childArr = useMemo(
      () => Children.toArray(children) as ReactElement<CardProps>[],
      [children]
    );
    const refs = useMemo(
      () => childArr.map(() => React.createRef<HTMLDivElement>()),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [childArr.length]
    );

    const order = useRef<number[]>(
      Array.from({ length: childArr.length }, (_, i) => i)
    );

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number | undefined>(undefined);
    const container = useRef<HTMLDivElement>(null);
    const renderOrderRef = useRef<(target: number[]) => void>(() => {});

    useEffect(() => {
      const total = refs.length;
      refs.forEach((r, i) => {
        if (r.current) {
          placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
        }
      });
      onFrontChange?.(order.current[0]);

      const renderOrder = (target: number[]) => {
        tlRef.current?.kill();
        const tl = gsap.timeline();
        tlRef.current = tl;

        target.forEach((cardIdx, slotIdx) => {
          const el = refs[cardIdx].current;
          if (!el) return;
          const slot = makeSlot(slotIdx, cardDistance, verticalDistance, target.length);
          tl.set(el, { zIndex: slot.zIndex }, 0);
          tl.to(
            el,
            {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              duration: config.duration,
              ease: config.ease,
            },
            0
          );
        });

        tl.call(() => {
          order.current = target;
          onFrontChange?.(target[0]);
        });
      };

      renderOrderRef.current = renderOrder;

      const next = () => {
        if (order.current.length < 2) return;
        const [front, ...rest] = order.current;
        const target = [...rest, front];
        onFrontChange?.(target[0]);
        renderOrder(target);
      };

      intervalRef.current = window.setInterval(next, delay);

      return () => clearInterval(intervalRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, skewAmount, easing]);

    const stopInterval = () => {
      clearInterval(intervalRef.current);
    };

    useImperativeHandle(ref, () => ({
      next: () => {
        const [front, ...rest] = order.current;
        const target = [...rest, front];
        onFrontChange?.(target[0]);
        renderOrderRef.current(target);
        stopInterval();
      },
      prev: () => {
        const back = order.current[order.current.length - 1];
        const rest = order.current.slice(0, -1);
        const target = [back, ...rest];
        onFrontChange?.(target[0]);
        renderOrderRef.current(target);
        stopInterval();
      },
      goTo: (index: number) => {
        if (!order.current.includes(index)) return;
        const rest = order.current.filter((i) => i !== index);
        const target = [index, ...rest];
        onFrontChange?.(target[0]);
        renderOrderRef.current(target);
        stopInterval();
      },
    }));

    const rendered = childArr.map((child, i) =>
      isValidElement(child)
        ? cloneElement(
            child,
            {
              key: i,
              ref: refs[i],
              style: { width, height, ...(child.props.style ?? {}) },
              onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                child.props.onClick?.(e);
                onCardClick?.(i);
              },
            } as Partial<CardProps> & React.RefAttributes<HTMLDivElement>
          )
        : child
    );

    return (
      <div ref={container} className="card-swap-container" style={{ width, height }}>
        {rendered}
      </div>
    );
  }
);

CardSwap.displayName = "CardSwap";

export default CardSwap;