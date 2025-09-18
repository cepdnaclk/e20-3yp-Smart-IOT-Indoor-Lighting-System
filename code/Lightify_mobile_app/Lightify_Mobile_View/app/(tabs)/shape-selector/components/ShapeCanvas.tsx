import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import useCanvasGeometry, { REAL_WORLD_RADIUS } from "../hooks/useCanvasGeometry";
import { parseCircleEquation, parseLineEquation } from "../utils/parse";
import { Shape } from "../utils/types";

export default function ShapeCanvas({
  width, height, shapes, liveX, liveY, onEdit,
}: {
  width: number; height: number; shapes: Shape[];
  liveX: number; liveY: number; onEdit: (i: number) => void;
}) {
  const { scale, originX, toPxX, toPxY } = useCanvasGeometry(width, height);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill="#ccffcc" />
        <Line x1={originX} y1={0} x2={originX} y2={height} stroke="gray" strokeWidth={1} />
        <Line x1={0} y1={0} x2={width} y2={0} stroke="gray" strokeWidth={1} />
        <Path
          d={`M ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
             A ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
               ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}`}
          fill="rgba(0,255,0,0.1)" stroke="green" strokeWidth={2}
        />
        {shapes.map((s, i) => {
          if (s.type === "point") {
            const c = parseCircleEquation(s.equation); if (!c) return null;
            return (
              <Circle key={i} cx={toPxX(c.h)} cy={toPxY(c.k)} r={c.r * scale}
                fill="rgba(255,68,0,0.6)" onPress={() => onEdit(i)} />
            );
          }
          if (s.type === "Door") {
            const l = parseLineEquation(s.equation); if (!l) return null;
            const xMin = -REAL_WORLD_RADIUS, xMax = REAL_WORLD_RADIUS;
            const y1 = l.m * xMin + l.b, y2 = l.m * xMax + l.b;
            return (
              <Line key={i} x1={toPxX(xMin)} y1={toPxY(y1)}
                    x2={toPxX(xMax)} y2={toPxY(y2)}
                    stroke="cyan" strokeWidth={2} onPress={() => onEdit(i)} />
            );
          }
          if (s.type === "Bed/Table") {
            const xMin = Math.min(...s.x), xMax = Math.max(...s.x);
            const yMin = Math.min(...s.y), yMax = Math.max(...s.y);
            return (
              <Rect key={i} x={toPxX(xMin)} y={toPxY(yMax)}
                    width={(xMax - xMin) * scale} height={(yMax - yMin) * scale}
                    stroke="purple" strokeWidth={2} fill="rgba(128,0,128,0.3)"
                    onPress={() => onEdit(i)} />
            );
          }
          return null;
        })}
        <Circle cx={toPxX(liveX)} cy={toPxY(liveY)} r={4} fill="red" />
      </Svg>
    </View>
  );
}
