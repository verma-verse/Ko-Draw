export function drawLine(ctx, shape) {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size;
  ctx.beginPath();
  ctx.moveTo(shape.x0, shape.y0);
  ctx.lineTo(shape.x1, shape.y1);
  ctx.stroke();
}

export function drawStar(ctx, starProps) {
  let rot = (Math.PI / 2) * 3;
  let x = starProps.cx;
  let y = starProps.cy;
  let step = Math.PI / starProps.spikes;

  ctx.beginPath();
  ctx.strokeStyle = starProps.color;
  ctx.lineWidth = starProps.size;
  ctx.moveTo(starProps.cx, starProps.cy - starProps.outerRadius);
  for (let i = 0; i < starProps.spikes; i++) {
    x = starProps.cx + Math.cos(rot) * starProps.outerRadius;
    y = starProps.cy + Math.sin(rot) * starProps.outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = starProps.cx + Math.cos(rot) * starProps.innerRadius;
    y = starProps.cy + Math.sin(rot) * starProps.innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(starProps.cx, starProps.cy - starProps.outerRadius);
  ctx.closePath();
  ctx.stroke();
}

export function drawRect(ctx, shape) {
  ctx.lineWidth = shape.size;
  ctx.strokeStyle = shape.color;
  ctx.beginPath();
  ctx.rect(
    shape.start_x,
    shape.start_y,
    shape.end_x - shape.start_x,
    shape.end_y - shape.start_y
  );
  ctx.stroke();
}

export function drawCircle(ctx, shape) {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size;
  const center_x = (shape.mouse_starting.x + shape.mouse.x) / 2.0;
  const center_y = (shape.mouse_starting.y + shape.mouse.y) / 2.0;
  const radius =
    Math.hypot(
      Math.abs(shape.mouse.x - shape.mouse_starting.x),
      Math.abs(shape.mouse.y - shape.mouse_starting.y)
    ) / 2.0;
  ctx.beginPath();
  ctx.arc(center_x, center_y, radius, 0, Math.PI * 2, true);
  ctx.stroke();
}

export function drawOval(ctx, shape) {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size;
  let x1 = shape.mouse_starting.x;
  let x2 = shape.mouse.x;
  let y1 = shape.mouse_starting.y;
  let y2 = shape.mouse.y;
  if (x1 > x2) {
    let temp = x1;
    x1 = x2;
    x2 = temp;
  }
  if (y1 > y2) {
    let temp = y1;
    y1 = y2;
    y2 = temp;
  }
  const center_x = (x2 + x1) / 2.0;
  const center_y = (y2 + y1) / 2.0;
  const radiusX = (x2 - x1) / 2.0;
  const radiusY = (y2 - y1) / 2.0;
  ctx.beginPath();
  ctx.ellipse(
    center_x,
    center_y,
    radiusX,
    radiusY,
    Math.PI * 2,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

export function drawText(ctx, shape) {
  console.log(shape);
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size;
  ctx.font = shape.font;
  ctx.strokeText(shape.text, shape.x, shape.y);
}

export function loadImage(canvas, socket) {
  let input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", function (e) {
    let URL = window.URL;
    let url = URL.createObjectURL(e.target.files[0]);
    const img = new Image();
    img.src = url;
    img.onload = function () {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        window.innerWidth - canvas.width,
        window.innerHeight - canvas.height,
        500,
        300
      );
      socket.emit("canvas-data", {
        img: canvas.toDataURL("image/png"),
        id: socket.id,
      });
    };
  });
  input.click();
}

export function downloadImage(canvas) {
  const ctx = canvas.getContext("2d");

  const link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  link.click();
  // link.delete();
}
