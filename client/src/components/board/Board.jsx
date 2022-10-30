import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import {
  downloadImage,
  drawCircle,
  drawLine,
  drawOval,
  drawRect,
  drawStar,
  drawText,
  loadImage,
} from "./DrawingShapes";

export default function Board({ properties, setProperties }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  const [receiving, setReceiving] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sending, setSending] = useState(null);
  const [firstStroke, setFirstStroke] = useState(true);

  /*Redraw function*/
  const redraw = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (drawing.length > 0) {
      let image = new Image();
      image.src = drawing[drawing.length - 1];
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
    }
  };
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);
  }, [drawing]);

  /*Connect to socket and receive*/
  useEffect(() => {
    const temp = io.connect("http://localhost:8888");
    temp.on("connect", () => {
      temp.on("canvas-data", function (data) {
        // if (data.id === socket.id) {
        //   console.log("self");
        //   return;
        // }
        let interval = setInterval(function () {
          if (receiving) return;
          setReceiving(true);
          clearInterval(interval);
          setReceiving(false);
          setDrawing([...drawing, data.img]);
        }, 100);
      });
      setSocket(temp);
    });
  }, []);

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
    } else if (properties.currentTool === "image") {
      loadImage(canvasRef.current, socket);
      setProperties({ ...properties, currentTool: "pencil" });
      return;
    } else if (properties.currentTool === "download") {
      downloadImage(canvasRef.current);
      setProperties({ ...properties, currentTool: "pencil" });
      return;
    }

    /*Mouse Capturing with Event listeners*/
    let mouse = { x: 0, y: 0 };
    let last_mouse = { x: 0, y: 0 };
    let mouse_starting = { x: 0, y: 0 };
    let mouse_points = [];
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
      setFirstStroke(true);
      let base64ImageData = canvasRef.current.toDataURL("image/png");
      // setDrawing([...drawing, base64ImageData]);
      socket.emit("canvas-data", { img: base64ImageData, id: socket.id });
      node.removeEventListener("mousemove", onPaint, false);
      if (
        ["rectangle", "circle", "line", "star", "oval"].includes(
          properties.currentTool
        )
      ) {
        setProperties({ ...properties, currentTool: "pencil" });
      }
    }
    const MouseUp = function (event) {
      return mouseUp(event);
    };
    node.addEventListener("mouseup", MouseUp, false);

    /*Main paint function*/
    let onPaint = function () {
      // if (
      //   ["rectangle", "circle", "line", "star", "oval"].includes(
      //     properties.currentTool
      //   )
      // ) {
      //   if (sending) {
      //     clearTimeout(sending);
      //     setSending(null);
      //   }
      // } else {
      //   if (sending) clearTimeout(sending);
      //   setSending(
      //     setTimeout(() => {
      //       if (!socket) {
      //         console.log("not connected to server");
      //         return;
      //       }
      //       let base64ImageData = canvasRef.current.toDataURL("image/png");
      //       socket.emit("canvas-data", { img: base64ImageData, id: socket.id });
      //       setDrawing([...drawing, base64ImageData]);
      //     }, 2000)
      //   );
      // }
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
        const temp = {
          title: "rectangle",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          start_x: mouse_starting.x,
          start_y: mouse_starting.y,
          end_x: mouse.x,
          end_y: mouse.y,
        };
        redraw(ctx);
        drawRect(ctx, temp);
      } else if (properties.currentTool === "star") {
        const cx = (mouse_starting.x + mouse.x) / 2.0;
        const cy = (mouse_starting.y + mouse.y) / 2.0;
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
        redraw(ctx);
        drawStar(ctx, temp);
      } else if (properties.currentTool === "line") {
        const temp = {
          title: "line",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          x0: mouse_starting.x,
          y0: mouse_starting.y,
          x1: mouse.x,
          y1: mouse.y,
        };
        redraw(ctx);
        drawLine(ctx, temp);
      } else if (properties.currentTool === "circle") {
        const temp = {
          title: "circle",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          mouse_starting,
          mouse,
        };
        redraw(ctx);
        drawCircle(ctx, temp);
      } else if (properties.currentTool === "oval") {
        const temp = {
          title: "oval",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          mouse_starting,
          mouse,
        };
        redraw(ctx);
        drawOval(ctx, temp);
      } else {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
      }
    };

    /*Cleanup function*/
    return () => {
      node.removeEventListener("mousemove", MouseMove, false);
      node.removeEventListener("mousedown", MouseDown, false);
      node.removeEventListener("mouseup", MouseUp, false);
      // if (sending) {
      //   clearTimeout(sending);
      //   setSending(null);
      // }
    };
  }, [properties, socket]);

  return (
    <div className="w-full h-full" ref={sketchRef}>
      {/* <button onClick={() => downloadImage(canvasRef.current)}>Download</button> */}
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
