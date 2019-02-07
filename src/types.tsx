export interface InterfaceLineStroke {
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  width: number;
  color: string;
}

export interface InterfaceLine {
  type: "line";
  strokes: InterfaceLineStroke[];
}

export interface InterfaceEmoji {
  type: "emoji";
  emoji: string;
  size: number;
  posx: number;
  posy: number;
}

export type CanvasEvent = InterfaceEmoji | InterfaceLine;
