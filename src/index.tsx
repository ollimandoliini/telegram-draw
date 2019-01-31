import "./index.css";

const canvas = document.getElementById("telegram-draw") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const color = "black";
const weight = 2;
const pos = { x: 0, y: 0 };

canvas.addEventListener("mousemove", e => {
  draw(e);
});
canvas.addEventListener("mouseenter", setPosition);
canvas.addEventListener("mousedown", setPosition);

function setPosition(e: any) {
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
}

function draw(e: any) {
  if (e.buttons !== 1) {
    return;
  }

  ctx.beginPath();
  ctx.lineWidth = weight;
  ctx.strokeStyle = color;
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}
