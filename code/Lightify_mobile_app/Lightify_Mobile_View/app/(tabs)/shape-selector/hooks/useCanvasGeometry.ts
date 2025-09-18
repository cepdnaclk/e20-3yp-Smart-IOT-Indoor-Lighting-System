import { useMemo } from "react";
export const REAL_WORLD_RADIUS = 6000; // mm

export default function useCanvasGeometry(w: number, h: number) {
  const scale = useMemo(() => (w ? w / (2 * REAL_WORLD_RADIUS) : 0), [w]);
  const originX = useMemo(() => w / 2, [w]);
  const originY = 0;
  const toPxX = (x: number) => originX + x * scale;
  const toPxY = (y: number) => originY + -y * scale;
  return { scale, originX, originY, toPxX, toPxY };
}
