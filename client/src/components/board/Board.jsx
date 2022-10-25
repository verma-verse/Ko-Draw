import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Board({ properties, setProperties }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  // const [stack, setStack] = useState([]);

  useEffect(() => {
    drawOnCanvas();
  }, [properties]);

  function redraw(ctx) {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    drawing.forEach((shape, idx) => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.size;
      ctx.beginPath();
      ctx.moveTo(shape.x0, shape.y0);
      ctx.lineTo(shape.x1, shape.y1);
      ctx.closePath();
      ctx.stroke();
    });
  }

  function drawOnCanvas() {
    let ctx = canvasRef.current.getContext("2d");
    let sketch = sketchRef.current;
    let sketch_style = getComputedStyle(sketch);
    canvasRef.current.width = parseInt(sketch_style.getPropertyValue("width"));
    canvasRef.current.height = parseInt(
      sketch_style.getPropertyValue("height")
    );
    redraw(ctx);
    ctx.strokeStyle = properties.color;
    ctx.lineWidth = properties.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (properties.currentTool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
    } else if (properties.currentTool === "line") {
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
    } else if (properties.currentTool === "pencil") {
      ctx.lineWidth = 1;
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
    }
    let mouse = { x: 0, y: 0 };
    let last_mouse = { x: 0, y: 0 };
    let mouse_starting = { x: 0, y: 0 };
    let mouse_points = [];

    canvasRef.current.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    canvasRef.current.addEventListener(
      "mousedown",
      function (e) {
        mouse_starting.x = e.pageX - this.offsetLeft;
        mouse_starting.y = e.pageY - this.offsetTop;
        canvasRef.current.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvasRef.current.addEventListener(
      "mouseup",
      function () {
        setDrawing([...drawing, ...mouse_points]);
        canvasRef.current.removeEventListener("mousemove", onPaint, false);
        // setStack([...mouse_points, ...stack]);
      },
      false
    );

    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
      mouse_points = [
        ...mouse_points,
        {
          title: properties.currentTool,
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          x0: last_mouse.x,
          y0: last_mouse.y,
          x1: mouse.x,
          y1: mouse.y,
        },
      ];
    };
  }

  return (
    <div className="w-full h-full" ref={sketchRef}>
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
