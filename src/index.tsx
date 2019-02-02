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

canvas.addEventListener("mousemove", e => {
  draw(e);
});
canvas.addEventListener("mouseenter", setPosition);
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("click", clickHandler);

function clickHandler() {
  if (settings.mode === "draw") {
    ctx.fillStyle = settings.selectedColor;
    ctx.fillRect(pos.x, pos.y, settings.drawWidth, settings.drawWidth);
  }
  if (settings.mode === "emoji") {
    addEmoji(settings.selectedEmoji, 60);
  }
}

function setPosition(e: any) {
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
}

function draw(e: MouseEvent) {
  if (settings.mode !== "draw") {
    return;
  }
  if (e.buttons !== 1) {
    return;
  }
  ctx.beginPath();
  ctx.lineWidth = settings.drawWidth;
  ctx.strokeStyle = settings.selectedColor;
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

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

const sendform = document.getElementById("sendForm") as HTMLFormElement;
const tokenInput = document.getElementById("tokenInput") as HTMLInputElement;
const chatIdInput = document.getElementById("chatIdInput") as HTMLInputElement;
const sendButton = document.getElementById("sendButton") as HTMLButtonElement;

let botToken = "";
let chatId = "";

tokenInput.addEventListener("input", function() {
  botToken = this.value;
});
chatIdInput.addEventListener("input", function() {
  chatId = this.value;
});

sendform.addEventListener("submit", e => {
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
  const sendPhotoApiUrl = `https://api.telegram.org/${botToken}/sendPhoto?chat_id=${chatId}`;
  fetch(sendPhotoApiUrl, {
    method: "POST",
    body: canvasImageFormData
  });
}
init();
