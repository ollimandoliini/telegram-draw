import { settings } from "./inputs";

export function createColorMenu(colors: string[]) {
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

export function createEmojiMenu(emojis: string[]) {
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
