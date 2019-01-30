import "./index.css";

const canvas = document.getElementById("telegram-draw") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const dataURL = canvas.toDataURL();

function mousePosition(event: any) {
  const canvasRect = canvas.getBoundingClientRect();
  const X = event.clientX - canvasRect.left;
  const Y = event.clientY - canvasRect.top;
  draw(X, Y);
}

function draw(x: number, y: number) {
  ctx.fillRect(x, y, 5, 5);
}

canvas.addEventListener("mousemove", mousePosition);
