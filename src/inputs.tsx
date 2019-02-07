import { addEmoji, addLineStroke, createNewLine, setPosition } from "./logic";

export const settings = {
  mode: "draw",
  selectedColor: "black",
  selectedEmoji: "🤣",
  emojiSize: 40,
  drawWidth: 2
};

export const canvas = document.getElementById(
  "telegram-draw"
) as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let mouseDown = false;

canvas.addEventListener("mousedown", e => {
  mouseDown = true;
  setPosition(e);
});
canvas.addEventListener("mouseup", () => {
  mouseDown = false;
  createNewLine();
});
canvas.addEventListener("mouseout", () => {
  mouseDown = false;
  createNewLine();
});

canvas.addEventListener("mousemove", e => {
  if (mouseDown === true) {
    addLineStroke(e);
  }
});

canvas.addEventListener("click", e => {
  if (settings.mode === "emoji") {
    addEmoji(e);
  }
});
