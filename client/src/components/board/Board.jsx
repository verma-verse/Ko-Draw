import { createElement } from "react";
import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import { fillColor } from "./actions";
import {
  downloadImage,
  drawCircle,
  drawLine,
  drawOval,
  drawRect,
  drawSelection,
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
  // const [buffer, setBuffer]=useState([])
  const [index, setIndex] = useState(-1); //-1 indicates empty, -2 means last frame..

  useEffect(() => {
    //FIXME: handle dimensions (need to resize sketch too) when resizing...
    const resizeHandler = (e) => {
      // console.log("resized");
      let sketch = sketchRef.current;
      let sketch_style = getComputedStyle(sketch);
      canvasRef.current.width = parseInt(
        sketch_style.getPropertyValue("width")
      );
      canvasRef.current.height = parseInt(
        sketch_style.getPropertyValue("height")
      );
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      redraw(ctx);
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  /*Redraw function*/
  const redraw = (ctx) => {
    console.log(index, drawing.length);
    if (index === -1) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } // -2 or >=0
    else
      ctx.putImageData(drawing[index != -2 ? index : drawing.length - 1], 0, 0);
  };
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);
  }, [index]);

  const undo = (ctx) => {
    if (index === -1) return;
    if (index === -2) {
      setIndex(drawing.length - 2);
    } else {
      setIndex((i) => i - 1);
    }
  };
  const redo = (ctx) => {
    if (index === -2 || index === drawing.length - 1) return;
    if (index < drawing.length - 1) {
      setIndex((i) => i + 1);
    }
  };
  useEffect(() => {
    if (drawing.length > 10) {
      // setIndex((i) => i - 1);
      const temp = drawing;
      temp.shift();
      setDrawing(temp);
    }
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);
  }, [drawing]);

  /*Connect to socket and receive*/
  /*  useEffect(() => {
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
  }, []) */ useEffect(() => {
    let node = canvasRef.current;
    let ctx = node.getContext("2d");
    // redraw(ctx);
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
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      redraw(ctx);
      downloadImage(canvasRef.current);
      setProperties({ ...properties, currentTool: "pencil" });
      return;
    } else if (properties.currentTool === "paintBucket") {
      canvasRef.current.addEventListener("click", paintPixels);
    } else if (properties.currentTool === "undo") {
      undo(ctx);
      setProperties({ ...properties, currentTool: "pencil" });
      return;
    } else if (properties.currentTool === "redo") {
      redo(ctx);
      setProperties({ ...properties, currentTool: "pencil" });
      return;
    }

    function paintPixels(e) {
      const x = e.pageX - node.offsetLeft;
      const y = e.pageY - node.offsetTop;
      fillColor(node, x, y, properties.color);
      const imgdata = ctx.getImageData(0, 0, node.width, node.height);
      setIndex(-2);
      setDrawing([...drawing, imgdata]);
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

    function mouseDown(e) {
      mouse_starting.x = e.pageX - node.offsetLeft;
      mouse_starting.y = e.pageY - node.offsetTop;
      node.addEventListener("mousemove", onPaint, false);
    }
    const MouseDown = function (event) {
      return mouseDown(event);
    };

    function mouseUp(e) {
      setFirstStroke(true);
      if (properties.currentTool === "text") {
        return;
      }
      const imgdata = ctx.getImageData(0, 0, node.width, node.height);
      setIndex(-2);
      setDrawing([...drawing, imgdata]);
      // socket.emit("canvas-data", { img: imgdata, id: socket.id });
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
    if (properties.currentTool !== "paintBucket") {
      node.addEventListener("mousemove", MouseMove, false);
      node.addEventListener("mousedown", MouseDown, false);
      node.addEventListener("mouseup", MouseUp, false);
    }

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
      } else if (properties.currentTool === "text") {
        const temp = {
          title: "text",
          start_x: mouse_starting.x,
          start_y: mouse_starting.y,
          end_x: mouse.x,
          end_y: mouse.y,
        };
        redraw(ctx);
        drawSelection(ctx, temp);
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
      node.removeEventListener("click", paintPixels);
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
      <div
        className="bg-white"
        onClick={() => undo(canvasRef.current.getContext("2d"))}
      >
        Undo
      </div>
      <div
        className="bg-white"
        onClick={() => redo(canvasRef.current.getContext("2d"))}
      >
        Redo
      </div>

      {/* <button onClick={() => downloadImage(canvasRef.current)}>Download</button> */}
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
