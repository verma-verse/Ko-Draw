import { useRef, useState, useEffect } from "react";
import {
  drawCircle,
  drawOval,
  drawRect,
  drawStar,
  drawText,
} from "./DrawingSapes";

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
      if (
        properties.currentTool !== "line" &&
        properties.currentTool !== "rectangle" &&
        properties.currentTool !== "star" &&
        properties.currentTool !== "circle" &&
        properties.currentTool !== "oval"
      )
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
            x1: 0,
            y1: 0,
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
    let onPaint = function () {
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
      if (properties.currentTool === "rectangle") {
        let prev = drawing;
        if (!first) {
          prev.pop();
        } else first = false;
        const temp = {
          title: "rectangle",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          start_x: mouse_starting.x,
          start_y: mouse_starting.y,
          end_x: mouse.x,
          end_y: mouse.y,
        };
        prev.push(temp);
        setDrawing(prev);
        redraw(ctx);
        return;
      } else if (properties.currentTool === "star") {
        const cx = (mouse_starting.x + mouse.x) / 2.0;
        const cy = (mouse_starting.y + mouse.y) / 2.0;
        let prev = drawing;
        if (!first) {
          prev.pop();
        } else first = false;
        const temp = {
          title: "star",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          cx: cx,
          cy: cy,
          spikes: 5,
          outerRadius: mouse.x - mouse_starting.x,
          innerRadius: (mouse.x - mouse_starting.x) / 2.0,
        };
        prev.push(temp);
        setDrawing(prev);
        redraw(ctx);
        return;
      } else if (properties.currentTool === "line") {
        let prev = drawing;
        if (!first) {
          prev.pop();
        } else first = false;
        const temp = {
          title: "line",
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
        return;
      } else if (properties.currentTool === "circle") {
        let prev = drawing;
        if (!first) {
          prev.pop();
        } else first = false;
        const temp = {
          title: "circle",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          mouse_starting,
          mouse,
        };
        prev.push(temp);
        setDrawing(prev);
        redraw(ctx);
        return;
      } else if (properties.currentTool === "oval") {
        let prev = drawing;
        if (!first) prev.pop();
        else first = false;
        const temp = {
          title: "oval",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          mouse_starting,
          mouse,
        };
        prev.push(temp);
        setDrawing(prev);
        redraw(ctx);
        return;
        // } else if (properties.currentTool === "text") {
        //   let ans = window.prompt("Enter the text");
        //   let prev = drawing;
        //   const temp = {
        //     title: "text",
        //     color: ctx.strokeStyle,
        //     size: ctx.lineWidth,
        //     text: ans,
        //   };
        //   prev.push(temp);
        //   setDrawing(prev);
        //   redraw(ctx);
        //   return;
      }
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      // ctx.closePath();
      ctx.stroke();
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
      if (shape.title === "rectangle") {
        drawRect(ctx, shape);
      } else if (shape.title === "star") {
        drawStar(ctx, shape);
      } else if (shape.title === "circle") {
        drawCircle(ctx, shape);
      } else if (shape.title === "oval") {
        drawOval(ctx, shape);
      } else if (shape.title === "text") {
        drawText(ctx, shape);
      } else {
        ctx.beginPath();
        ctx.moveTo(shape.x0, shape.y0);
        ctx.lineTo(shape.x1, shape.y1);
        ctx.stroke();
      }
    });
  }

  return (
    <div className="w-full h-full" ref={sketchRef}>
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
