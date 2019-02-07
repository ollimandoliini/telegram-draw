import { settings } from "./inputs";
import { canvas, ctx } from "./inputs";
import { CanvasEvent, InterfaceEmoji, InterfaceLine } from "./types";

export const eventHistory: CanvasEvent[] = [];
const newLine: InterfaceLine = { type: "line", strokes: [] };

const pos = { x: 0, y: 0 };

export function addLineStroke(e: MouseEvent) {
  if (settings.mode !== "draw") {
    return;
  }
  const start = { ...pos };
  setPosition(e);
  const end = { ...pos };

  const lineStroke = {
    startx: start.x,
    starty: start.y,
    endx: end.x,
    endy: end.y,
    width: settings.drawWidth,
    color: settings.selectedColor
  };

  const latestEvent = eventHistory[eventHistory.length - 1];
  if (!latestEvent || latestEvent.type !== "line") {
    eventHistory.push({ ...newLine, strokes: [lineStroke] });
  } else {
    latestEvent.strokes.push(lineStroke);
    return;
  }
}

export function createNewLine() {
  if (newLine.strokes.length > 0) {
    eventHistory.push({ type: "line", strokes: [] });
  }
}

export function setPosition(e: any) {
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
  const position = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  };
  return position;
}

export function addEmoji(e: MouseEvent) {
  const newEmoji: InterfaceEmoji = {
    type: "emoji",
    emoji: settings.selectedEmoji,
    size: settings.emojiSize,
    posx: e.clientX - canvas.offsetLeft,
    posy: e.clientY - canvas.offsetTop
  };
  eventHistory.push(newEmoji);
}
