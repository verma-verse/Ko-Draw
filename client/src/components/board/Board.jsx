import { useRef, useState, useEffect } from "react";

export default function Board({ properties, setProperties }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [drawing, setDrawing] = useState([]);

  useEffect(() => {
    let node = canvasRef.current;
    let ctx = node.getContext("2d");
    let sketch = sketchRef.current;
    let sketch_style = getComputedStyle(sketch);
    node.width = parseInt(sketch_style.getPropertyValue("width"));
    node.height = parseInt(sketch_style.getPropertyValue("height"));
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

    /*Mouse Capturing with Event listeners*/
    let mouse = { x: 0, y: 0 };
    let last_mouse = { x: 0, y: 0 };
    let mouse_starting = { x: 0, y: 0 };
    let mouse_points = [];
    let first = true;
    function mouseMove(e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;
      mouse.x = e.pageX - node.offsetLeft;
      mouse.y = e.pageY - node.offsetTop;
    }
    const MouseMove = function (event) {
      return mouseMove(event);
    };
    node.addEventListener("mousemove", MouseMove, false);

    function mouseDown(e) {
      mouse_starting.x = e.pageX - node.offsetLeft;
      mouse_starting.y = e.pageY - node.offsetTop;
      node.addEventListener("mousemove", onPaint, false);
    }
    const MouseDown = function (event) {
      return mouseDown(event);
    };
    node.addEventListener("mousedown", MouseDown, false);

    function mouseUp(e) {
      first = true;
      if (properties.currentTool !== "line")
        setDrawing([...drawing, ...mouse_points]);
      else {
        setDrawing([
          ...drawing,
          {
            title: "pencil",
            color: ctx.strokeStyle,
            size: 1,
            x0: 0,
            y0: 0,
            x1: 1,
            y1: 1,
          },
        ]);
        setProperties({ ...properties, currentTool: "pencil" });
      }
      node.removeEventListener("mousemove", onPaint, false);
    }
    const MouseUp = function (event) {
      return mouseUp(event);
    };
    node.addEventListener("mouseup", MouseUp, false);

    /*Main paint function*/
    var onPaint = function () {
      console.log(first);
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      // ctx.closePath();
      ctx.stroke();
      if (!first && properties.currentTool === "line") {
        let prev = drawing;
        const popped = prev.pop();
        const temp = {
          title: properties.currentTool,
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          x0: mouse_starting.x,
          y0: mouse_starting.y,
          x1: mouse.x,
          y1: mouse.y,
        };
        prev.push(temp);
        setDrawing(prev);
        redraw(ctx);
      }
      if (properties.currentTool === "line" && first) first = false;
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

    /*Cleanup function*/
    return () => {
      node.removeEventListener("mousemove", MouseMove, false);
      node.removeEventListener("mousedown", MouseDown, false);
      node.removeEventListener("mouseup", MouseUp, false);
    };
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
      ctx.stroke();
    });
  }

  return (
    <div className="w-full h-full" ref={sketchRef}>
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
