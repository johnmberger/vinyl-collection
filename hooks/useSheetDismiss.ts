"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.45;
const DIRECTION_THRESHOLD = 10;

function createDragState() {
  return {
    active: false,
    pending: false,
    startY: 0,
    lastY: 0,
    lastT: 0,
    y: 0,
    velocity: 0,
    lockEl: null as HTMLElement | null,
  };
}

function isMobileSheet() {
  return window.matchMedia("(max-width: 639px)").matches;
}

export function useSheetDismiss(onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [entered, setEntered] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef(createDragState());

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setDragging(false);
    setDragOffset((current) =>
      current <= 0 ? current : Math.max(current, window.innerHeight),
    );
  }, [closing]);

  const startDismiss = (
    event: ReactPointerEvent<HTMLElement>,
    startY: number,
  ) => {
    drag.current.active = true;
    drag.current.pending = false;
    drag.current.startY = startY;
    drag.current.lastY = event.clientY;
    drag.current.lastT = performance.now();
    drag.current.y = Math.max(0, event.clientY - startY);
    drag.current.velocity = 0;
    setSettling(false);
    setEntered(true);
    setDragging(true);
    setDragOffset(drag.current.y);
    event.preventDefault();
    event.currentTarget.style.touchAction = "none";
    drag.current.lockEl = event.currentTarget;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDragOffset = (event: ReactPointerEvent<HTMLElement>) => {
    const next = Math.max(0, event.clientY - drag.current.startY);
    const now = performance.now();
    const elapsed = now - drag.current.lastT;
    if (elapsed > 0) {
      drag.current.velocity = (event.clientY - drag.current.lastY) / elapsed;
    }
    drag.current.lastY = event.clientY;
    drag.current.lastT = now;
    drag.current.y = next;
    setDragOffset(next);
  };

  const endDrag = () => {
    drag.current.pending = false;
    drag.current.lockEl?.style.removeProperty("touch-action");
    drag.current.lockEl = null;
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);

    if (
      drag.current.velocity > DISMISS_VELOCITY ||
      drag.current.y > DISMISS_DISTANCE
    ) {
      requestClose();
      return;
    }

    setSettling(true);
    setDragOffset(0);
  };

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (closing || !isMobileSheet()) return;
    event.stopPropagation();
    event.preventDefault();
    startDismiss(event, event.clientY);
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    updateDragOffset(event);
  };

  const onCoverPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (closing || !isMobileSheet()) return;
    drag.current = {
      ...createDragState(),
      pending: true,
      startY: event.clientY,
      lastY: event.clientY,
      lastT: performance.now(),
    };
  };

  const onCoverPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current.active) {
      updateDragOffset(event);
      return;
    }
    if (!drag.current.pending) return;

    const dy = event.clientY - drag.current.startY;
    if (Math.abs(dy) < DIRECTION_THRESHOLD) return;

    const atTop = (sheetRef.current?.scrollTop ?? 0) <= 1;
    if (dy > 0 && atTop) {
      startDismiss(event, drag.current.startY);
      return;
    }

    drag.current.pending = false;
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  const usingDragMotion = dragging || dragOffset > 0 || settling;
  const dragProgress = Math.min(dragOffset / 360, 1);

  const handlePointer = {
    onPointerDown: onHandlePointerDown,
    onPointerMove: onHandlePointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onLostPointerCapture: endDrag,
  };

  const coverPointer = {
    onPointerDown: onCoverPointerDown,
    onPointerMove: onCoverPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onLostPointerCapture: endDrag,
  };

  return {
    sheetRef,
    closing,
    dragging,
    entered,
    dragOffset,
    dragProgress,
    usingDragMotion,
    requestClose,
    handlePointer,
    coverPointer,
    markEntered: () => setEntered(true),
    finishSettling: () => setSettling(false),
  };
}
