const hex = (h) => {
  return h
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
};
export function fillColor(canvas, x, y, new_color) {
  const [r, g, b] = hex(new_color);
  const newColor = { r, g, b, a: 255 };
  console.log("painting with", newColor);
  let store = [{ x: x, y: y }];
  let width = canvas.width;
  let height = canvas.height;
  const ctx = canvas.getContext("2d");
  let id = ctx.getImageData(0, 0, width, height);
  let curr_pixel_pos = (y * width + x) * 4;

  //getting the color of current pixel
  let start_r = id.data[curr_pixel_pos + 0];
  let start_g = id.data[curr_pixel_pos + 1];
  let start_b = id.data[curr_pixel_pos + 2];
  let start_a = id.data[curr_pixel_pos + 3];

  //if new color is same as old, no need to paint :)
  if (
    newColor.r === start_r &&
    newColor.g === start_g &&
    newColor.b === start_b &&
    newColor.a === start_a
  ) {
    return;
  }

  color(curr_pixel_pos);
  while (store.length) {
    let curr_point = store.pop();
    let x = curr_point.x,
      y = curr_point.y;
    let new_pos = (y * width + x - 1) * 4;
    if (x > 1 && matches_start_color(new_pos)) {
      color(new_pos);
      store.push({ x: x - 1, y: y });
    }
    new_pos = (y * width + x + 1) * 4;
    if (x < width - 1 && matches_start_color(new_pos)) {
      color(new_pos);
      store.push({ x: x + 1, y: y });
    }
    new_pos = ((y - 1) * width + x) * 4;
    if (y > 1 && matches_start_color(new_pos)) {
      color(new_pos);
      store.push({ x: x, y: y - 1 });
    }
    new_pos = ((y + 1) * width + x) * 4;
    if (y < height - 1 && matches_start_color(new_pos)) {
      color(new_pos);
      store.push({ x: x, y: y + 1 });
    }
  }
  // console.log(id);
  ctx.putImageData(id, 0, 0);
  function matches_start_color(curr_pixel_pos) {
    return (
      id.data[curr_pixel_pos + 0] === start_r &&
      id.data[curr_pixel_pos + 1] === start_g &&
      id.data[curr_pixel_pos + 2] === start_b &&
      id.data[curr_pixel_pos + 3] === start_a
    );
  }

  function color(curr_pixel_pos) {
    id.data[curr_pixel_pos + 0] = newColor.r;
    id.data[curr_pixel_pos + 1] = newColor.g;
    id.data[curr_pixel_pos + 2] = newColor.b;
    id.data[curr_pixel_pos + 3] = newColor.a;
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(id);
    }, 1000);
  });
}

export function addMousePosition(data, parent, canvas) {
  // console.log(data);
  let node = document.getElementById(data.id);
  if (!node) {
    node = document.createElement("span");
    node.id = data.id;
  }
  node.style.backgroundColor = "black";
  node.style.color = "white";
  node.style.position = "absolute";
  const pos = canvas.getBoundingClientRect();
  node.style.left = pos.left + data.mouse.x + "px";
  node.style.top = pos.top + data.mouse.y + "px";
  // console.log(node.style.top, node.style.y);
  node.innerHTML = "a";
  node.style.zIndex = 100;
  parent.appendChild(node);
  // console.log(node);
}

export function drag(
  sketch,
  canvas,
  mouse_starting,
  mouse,
  setProperties,
  setDrawing
) {
  let parentCtx = canvas.getContext("2d");
  const newCanvas = document.createElement("canvas");
  newCanvas.style.border = "1px";
  newCanvas.style.borderStyle = "dashed";
  let childCtx = newCanvas.getContext("2d");
  newCanvas.height = mouse.y - mouse_starting.y;
  newCanvas.width = mouse.x - mouse_starting.x;
  sketch.appendChild(newCanvas);
  newCanvas.style.position = "absolute";
  newCanvas.style.left = mouse_starting.x + canvas.offsetLeft + "px";
  newCanvas.style.top = mouse_starting.y + canvas.offsetTop + "px";
  newCanvas.style.zIndex = 30;
  const imgd = parentCtx.getImageData(
    mouse_starting.x,
    mouse_starting.y,
    mouse.x - mouse_starting.x,
    mouse.y - mouse_starting.y
  );
  childCtx.putImageData(imgd, 0, 0);

  let dragStartMouse, dragEndMouse;
  newCanvas.draggable = true;
  newCanvas.addEventListener("drag", (e) => {});
  newCanvas.addEventListener("dragstart", (e) => {
    newCanvas.style.opacity = 0.5;
    dragEndMouse = dragStartMouse = { x: e.pageX, y: e.pageY };
  });
  newCanvas.addEventListener("dragend", (e) => {});
  sketch.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragEndMouse = {
      x: e.pageX,
      y: e.pageY,
    };
  });
  sketch.addEventListener("drop", dropCanvas);
  function dropCanvas(e) {
    e.preventDefault();
    let newCoords = {
      x: mouse_starting.x + (dragEndMouse.x - dragStartMouse.x),
      y: mouse_starting.y + (dragEndMouse.y - dragStartMouse.y),
    };
    parentCtx.putImageData(imgd, newCoords.x, newCoords.y);
    parentCtx.fillStyle = "white";
    parentCtx.fillRect(
      mouse_starting.x,
      mouse_starting.y,
      mouse.x - mouse_starting.x,
      mouse.y - mouse_starting.y
    );
    newCanvas.remove();
    const imgdata = parentCtx.getImageData(0, 0, canvas.width, canvas.height);
    setDrawing((d) => [...d, imgdata]);
    setProperties((p) => {
      return { ...p, currentTool: "pencil" };
    });
  }

  // let zoom = function (clicks) {
  //   let pt = { x: lastX, y: lastY };
  //   ctx.translate(pt.x, pt.y);
  //   let factor = Math.pow(scaleFactor, clicks);
  //   ctx.scale(factor, factor);
  //   ctx.translate(-pt.x, -pt.y);
  //   redraw();
  // };
}
