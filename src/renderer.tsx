const canvas = document.getElementById("telegram-draw") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const eventHistory: CanvasEvent[] = [];

interface InterfaceLineStroke {
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  width: number;
  color: string;
}

interface InterfaceLine {
  type: "line";
  strokes: InterfaceLineStroke[];
}

interface InterfaceEmoji {
  type: "emoji";
  emoji: string;
  size: number;
  posx: number;
  posy: number;
}

type CanvasEvent = InterfaceEmoji | InterfaceLine;

export function renderHistory(history: CanvasEvent[]) {
  history.forEach(renderEvent);
}

function renderEvent(event: CanvasEvent) {
  if (event.type === "line") {
    renderLine(event);
  }
  if (event.type === "emoji") {
    renderEmoji(event);
  }
}

function renderStroke(stroke: InterfaceLineStroke) {
  ctx.beginPath();
  ctx.lineWidth = stroke.width;
  ctx.strokeStyle = stroke.color;
  ctx.moveTo(stroke.startx, stroke.starty);
  ctx.lineTo(stroke.endx, stroke.endy);
  ctx.stroke();
}
function renderLine(line: InterfaceLine) {
  line.strokes.forEach(renderStroke);
}

function renderEmoji(emoji: InterfaceEmoji) {
  ctx.font = emoji.size.toString() + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(emoji.emoji, emoji.posx, emoji.posy);
}
