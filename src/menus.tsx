import { settings } from "./inputs";

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
export function createColorMenu(colors: string[]) {
  colors.forEach(addColorBtn);
}

const emojiMenuContainer = document.getElementById("emojis") as HTMLDivElement;
export function createEmojiMenu(emojis: string[]) {
  emojis.forEach(addEmojiButton);
  emojiMenuContainer.insertAdjacentElement("afterend", emojiSizeSlider());
}
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

function emojiSizeSlider() {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "20";
  slider.max = "150";
  slider.id = "emojislider";
  slider.addEventListener("input", () => {
    settings.emojiSize = Number(slider.value);
  });
  return slider;
}
