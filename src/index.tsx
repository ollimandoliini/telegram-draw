import "./index.css";
import * as toolsFile from "./tools.json";
const canvas = document.getElementById("telegram-draw") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const pos = { x: 0, y: 0 };

const settings = {
  mode: "draw",
  selectedColor: "black",
  selectedEmoji: "🤣",
  drawWidth: 2
};

const settingsEmojis = toolsFile.emojis;
const settingsColors = toolsFile.colors;

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
  addLineStroke(e);
});

canvas.addEventListener("click", e => {
  if (settings.mode === "emoji") {
    addEmoji(e);
  }
  if (settings.mode === "draw") {
  }
});

function addEmoji(e: MouseEvent) {
  const newEmoji: InterfaceEmoji = {
    type: "emoji",
    emoji: settings.selectedEmoji,
    size: 40,
    posx: e.clientX - canvas.offsetLeft,
    posy: e.clientY - canvas.offsetTop
  };
  eventHistory.push(newEmoji);
}

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

// todo: tyyppien checkaus

interface InterfaceEmoji {
  type: "emoji";
  emoji: string;
  size: number;
  posx: number;
  posy: number;
}

type CanvasEvent = InterfaceEmoji | InterfaceLine;

const eventHistory: CanvasEvent[] = [];
const newLine: InterfaceLine = { type: "line", strokes: [] };

function addLineStroke(e: MouseEvent) {
  if (settings.mode !== "draw") {
    return;
  }
  if (mouseDown === true) {
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
      // katotaas..
      eventHistory.push({ ...newLine, strokes: [lineStroke] });
    } else {
      latestEvent.strokes.push(lineStroke);
      return;
    }
  }
}
// katon täältä ulkoo :D

function createNewLine() {
  if (newLine.strokes.length > 0) {
    eventHistory.push({ type: "line", strokes: [] });
  }
}

function setPosition(e: any) {
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
  const position = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  };
  return position;
}

function renderHistory() {
  eventHistory.forEach(renderEvent);
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

function mainLoop() {
  renderHistory();
  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

function renderEmoji(emoji: InterfaceEmoji) {
  ctx.font = emoji.size.toString() + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(emoji.emoji, emoji.posx, emoji.posy);
}

function createColorMenu(colors: string[]) {
  const colorContainer = document.getElementById("colors") as HTMLDivElement;

  function addColorBtn(color: string) {
    const newColor = document.createElement("button");
    newColor.className = "colorbtn";
    newColor.style.backgroundColor = color;
    newColor.addEventListener("click", () => {
      settings.selectedColor = color;
      settings.mode = "draw";
    });
    colorContainer.insertAdjacentElement("afterbegin", newColor);
  }
  colors.forEach(addColorBtn);
}

function createEmojiMenu(emojis: string[]) {
  const emojiMenuContainer = document.getElementById(
    "emojis"
  ) as HTMLDivElement;

  function addEmojiButton(emoji: any) {
    const newEmoji = document.createElement("div");
    newEmoji.className = "emojibtn";
    newEmoji.innerHTML = emoji;
    newEmoji.addEventListener("click", () => {
      settings.selectedEmoji = emoji;
      settings.mode = "emoji";
    });
    emojiMenuContainer.insertAdjacentElement("beforeend", newEmoji);
  }
  emojis.forEach(addEmojiButton);
}

function init() {
  createColorMenu(settingsColors);
  createEmojiMenu(settingsEmojis);
}

const sendForm = document.getElementById("sendForm") as HTMLFormElement;
const tokenInput = document.getElementById("tokenInput") as HTMLInputElement;
const chatIdInput = document.getElementById("chatIdInput") as HTMLInputElement;
const captionInput = document.getElementById(
  "captionInput"
) as HTMLInputElement;
const sendButton = document.getElementById("sendButton") as HTMLButtonElement;

let botToken = window.localStorage.getItem("botToken") || "";
let chatId = window.localStorage.getItem("chatId") || "";
let caption = "";

tokenInput.addEventListener("input", function() {
  window.localStorage.setItem("botToken", this.value);
  botToken = this.value;
});
chatIdInput.addEventListener("input", function() {
  window.localStorage.setItem("chatId", this.value);
  chatId = this.value;
});
captionInput.addEventListener("input", function() {
  caption = this.value;
});

sendForm.addEventListener("submit", e => {
  e.preventDefault();
  submitImage();
});

function dataUrlToFormData(dataUrl: any) {
  const blobBin = atob(dataUrl.split(",")[1]);
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const file = new Blob([new Uint8Array(array)], { type: "image/png" });
  const formData = new FormData();
  formData.append("photo", file);
  return formData;
}

function submitImage() {
  const canvasImageFormData = dataUrlToFormData(canvas.toDataURL());
  const sendPhotoApiUrl = `https://api.telegram.org/${botToken}/sendPhoto?chat_id=${chatId}&caption=${caption}`;
  fetch(sendPhotoApiUrl, {
    method: "POST",
    body: canvasImageFormData
  });
}
init();
