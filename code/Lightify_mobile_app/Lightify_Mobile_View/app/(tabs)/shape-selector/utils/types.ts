export type ShapeKind = "point" | "Door" | "Bed/Table";

export interface BaseShape {
  type: ShapeKind;
  name: string;
  equation: string;
  x: number[];
  y: number[];
}

export type Shape = BaseShape;

export interface RoomConfig {
  username: string;
  roomName: string;
  Areas: Shape[];
}

export interface LiveCoords { x: number; y: number; }
