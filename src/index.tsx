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
  newRecord();
});
canvas.addEventListener("mouseout", () => {
  mouseDown = false;
  newRecord();
});

canvas.addEventListener("mousemove", e => {
  addLineStroke(e);
});

// const eventHistory: [number, number][][] = [];

interface InterfaceLineStroke {
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  width: number;
  color: string;
}

type Line = InterfaceLineStroke[];

// todo: tyyppien checkaus

interface InterfaceEmoji {
  emoji: string;
  size: number;
  posx: number;
  posy: number;
}

type CanvasEvent = InterfaceEmoji[] | Line;

const eventHistory: InterfaceLineStroke[][] = [[]];
const eventRecord: Line = [];
let lineStroke: InterfaceLineStroke = {
  startx: 0,
  starty: 0,
  endx: 0,
  endy: 0,
  width: 2,
  color: "black"
};

function addLineStroke(e: MouseEvent) {
  if (mouseDown === true) {
    const start = { ...pos };
    setPosition(e);
    const end = { ...pos };

    lineStroke = {
      startx: start.x,
      starty: start.y,
      endx: end.x,
      endy: end.y,
      width: lineStroke.width,
      color: lineStroke.color
    };
    const lastEvent: InterfaceLineStroke[] =
      eventHistory[eventHistory.length - 1];

    lastEvent.push(lineStroke);
  }
}

function newRecord() {
  if (eventRecord.length > 0) {
    eventHistory.push([]);
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

function render() {
  eventHistory.forEach(renderLine);
}

function renderStroke(stroke: InterfaceLineStroke) {
  ctx.beginPath();
  ctx.lineWidth = stroke.width;
  ctx.strokeStyle = stroke.color;
  ctx.moveTo(stroke.startx, stroke.starty);
  ctx.lineTo(stroke.endx, stroke.endy);
  ctx.stroke();
}
function renderLine(line: InterfaceLineStroke[]) {
  line.forEach(renderStroke);
}

function mainLoop() {
  render();
  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

function addEmoji(emoji: string, size: number) {
  ctx.font = size.toString() + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(emoji, pos.x, pos.y);
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

let botToken = "";
let chatId = "";
let caption = "";

tokenInput.addEventListener("input", function() {
  botToken = this.value;
});
chatIdInput.addEventListener("input", function() {
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
