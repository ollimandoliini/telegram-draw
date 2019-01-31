import "./index.css";

const canvas = document.getElementById("telegram-draw") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function mousePosition(event: any) {
  const canvasRect = canvas.getBoundingClientRect();
  const X = event.clientX - canvasRect.left;
  const Y = event.clientY - canvasRect.top;
  draw(X, Y, 5);
}

function draw(x: number, y: number, weight: number) {
  ctx.fillRect(x, y, weight, weight);
}
