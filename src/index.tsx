import "./index.css";
import { addEmoji, addLineStroke, createNewLine, eventHistory } from "./logic";
import { canvas } from "./inputs";
import { createColorMenu, createEmojiMenu } from "./menus";
import { renderHistory } from "./renderer";
import * as toolsFile from "./tools.json";
import {
  CanvasEvent,
  InterfaceEmoji,
  InterfaceLine,
  InterfaceLineStroke
} from "./types";

const settingsEmojis = toolsFile.emojis;
const settingsColors = toolsFile.colors;

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

tokenInput.value = botToken;
chatIdInput.value = chatId;

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

function mainLoop() {
  renderHistory(eventHistory);
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
