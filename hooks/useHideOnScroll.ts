"use client";

import { useEffect, useState } from "react";

const TOP_REVEAL = 48;
const THRESHOLD = 14;
const LOCK_MS = 280;
const IGNORE_JUMP = 100;

export function useHideOnScroll(disabled: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }

    let lastY = Math.max(0, window.scrollY);
    let accumulated = 0;
    let lockedUntil = 0;
    let isHidden = false;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        lastY = y;

        if (now < lockedUntil) {
          accumulated = 0;
          return;
        }

        if (y <= TOP_REVEAL) {
          accumulated = 0;
          if (isHidden) {
            isHidden = false;
            lockedUntil = now + LOCK_MS;
            setHidden(false);
          }
          return;
        }

        if (Math.abs(delta) > IGNORE_JUMP) {
          accumulated = 0;
          return;
        }

        if ((accumulated > 0 && delta < 0) || (accumulated < 0 && delta > 0)) {
          accumulated = 0;
        }
        accumulated += delta;

        if (accumulated > THRESHOLD && !isHidden) {
          isHidden = true;
          accumulated = 0;
          lockedUntil = now + LOCK_MS;
          setHidden(true);
        } else if (accumulated < -THRESHOLD && isHidden) {
          isHidden = false;
          accumulated = 0;
          lockedUntil = now + LOCK_MS;
          setHidden(false);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [disabled]);

  return hidden;
}
