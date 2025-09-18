// app/(tabs)/shape-selector/utils/instructions.ts

export type ShapeTab = "Light Zone" | "Door" | "Bed/Table";

export function getInstructionText(shape: ShapeTab) {
  switch (shape) {
    case "Light Zone":
      return (
        "1. Give a name for Light Zone (eg. Light1)\n" +
        "2. Sit at the center of the light zone and tap 'Use Current Pos'\n" +
        "3. Then press the Save button."
      );
    case "Door":
      return (
        "1. Give a name for the Door (eg. Door1)\n" +
        "2. Sit at the two corners of the door and tap 'Use Current Pos'\n" +
        "3. Then press the Save button."
      );
    case "Bed/Table":
      return (
        "1. Give a name for the Bed or Table (eg. Bed1/Table1)\n" +
        "2. Sit at the four corners and tap 'Use Current Pos' for each corner\n" +
        "3. Then press the Save button."
      );
  }
}
