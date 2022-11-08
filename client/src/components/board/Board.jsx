import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import { addMousePosition, drag, fillColor } from "./actions";
import {
  downloadImage,
  drawCircle,
  drawLine,
  drawOval,
  drawRect,
  drawSelection,
  drawStar,
  drawTextArea,
  loadImage,
} from "./DrawingShapes";

const socket = io.connect("http://localhost:8080");
let mouseSending = null;

export default function Board({ properties, setProperties }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  const [receiving, setReceiving] = useState(false);
  // const [sending, setSending] = useState(null);
  const [firstStroke, setFirstStroke] = useState(true);
  const [index, setIndex] = useState(-1); //-1 indicates empty, -2 means last frame..
  const [userCursors, setUserCursors] = useState([]);

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
    // console.log(index, drawing.length);
    if (index === -1) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } // -2 or >=0
    else {
      // console.log(drawing[drawing.length - 1]);
      ctx.putImageData(
        drawing[index !== -2 ? index : drawing.length - 1],
        0,
        0
      );
    }
  };
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);
  }, [index]);

  const reset = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIndex(-1);
    setDrawing([]);
  };
  const undo = () => {
    if (index === -1) return;
    if (index === -2) {
      setIndex(drawing.length - 2);
    } else {
      setIndex((i) => i - 1);
    }
  };
  const redo = () => {
    if (index === -2 || index === drawing.length - 1) return;
    if (index < drawing.length - 1) {
      setIndex((i) => i + 1);
    }
  };
  useEffect(() => {
    if (drawing.length > 10) {
      const temp = drawing;
      temp.shift();
      setDrawing(temp);
    }
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);
  }, [drawing]);

  /*Connect to socket and receive*/
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: " + socket.id);
    });
    socket.on("mouse", (data) => {
      addMousePosition(data, sketchRef.current, canvasRef.current);
      setUserCursors([...userCursors, data.id]);
    });
    socket.on("removeMouse", (id) => {
      console.log(id);
      const node = document.getElementById(id);
      if (node) node.remove();
    });
    socket.on("canvas-data", function (data) {
      let interval = setInterval(function () {
        if (receiving) return;
        setReceiving(true);
        clearInterval(interval);
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.src = data.img;
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          const temp = drawing;
          if (index !== -2) {
            temp.splice(index + 1, drawing.length - index - 1);
            setIndex(-2);
          }
          const imgdata = ctx.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          setReceiving(false);
          setDrawing([...temp, imgdata]);
        };
      }, 200);
    });
    return () => {
      userCursors.forEach((val, idx) => {
        const el = document.getElementById(val);
        if (el) el.remove();
      });
      setUserCursors([]);
      socket.off("connect");
      socket.off("canvas-data");
      socket.off("mouse");
      socket.off("removeMouse");
    };
  }, []);

  useEffect(() => {
    let node = canvasRef.current;
    let ctx = node.getContext("2d");
    // redraw(ctx);
    ctx.strokeStyle = properties.color;
    ctx.lineWidth = properties.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (properties.currentTool === "eraser") {
      ctx.strokeStyle = "#FFFFFF"; //TODO: bgcolor
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
      const imgd = canvasRef.current.toDataURL("image/png");
      //for some reasons emitting imagedata not working..33% larger size :(
      socket.emit("canvas-data", {
        img: imgd,
        id: socket.id,
      });
      const temp = drawing;
      if (index !== -2) {
        temp.splice(index + 1, drawing.length - index - 1);
        setIndex(-2);
      }
      setDrawing([...temp, imgdata]);
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
        redraw(ctx);
        drawTextArea(
          sketchRef.current,
          canvasRef.current,
          mouse_starting,
          mouse
        );
      }
      if (properties.currentTool === "select") {
        node.removeEventListener("mousedown", MouseDown, false);
        node.removeEventListener("mousemove", onPaint, false);
        redraw(ctx);
        drag(
          sketchRef.current,
          canvasRef.current,
          mouse_starting,
          mouse,
          setProperties,
          setDrawing
        );
        return;
      }
      const imgd = canvasRef.current.toDataURL("image/png");
      socket.emit("canvas-data", {
        img: imgd,
        id: socket.id,
      });
      const imgdata = ctx.getImageData(0, 0, node.width, node.height);
      const temp = drawing;
      if (index !== -2) {
        temp.splice(index + 1, drawing.length - index - 1);
        setIndex(-2);
      }
      setDrawing([...temp, imgdata]);
      node.removeEventListener("mousemove", onPaint, false);
      if (
        ["rectangle", "circle", "line", "star", "oval", "text"].includes(
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
      } else if (
        properties.currentTool === "text" ||
        properties.currentTool === "select"
      ) {
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
    if (mouseSending) {
      clearInterval(mouseSending);
    }
    mouseSending = setInterval(() => {
      socket.emit("mouse", { mouse, id: socket.id });
    }, 500);

    /*Cleanup function*/
    return () => {
      node.removeEventListener("click", paintPixels);
      node.removeEventListener("mousemove", MouseMove, false);
      node.removeEventListener("mousedown", MouseDown, false);
      node.removeEventListener("mouseup", MouseUp, false);
    };
  }, [properties, socket]);

  return (
    <div className="w-full h-full" ref={sketchRef}>
      {/* <div className="flex justify-around py-1 text-white bg-gray-700">
        <span
          className="border border-white rounded-md hover:cursor-pointer"
          onClick={reset}
        >
          reset
        </span>
        <span
          className="border border-white rounded-md hover:cursor-pointer"
          onClick={undo}
        >
          undo
        </span>
        <span
          className="border border-white rounded-md hover:cursor-pointer"
          onClick={redo}
        >
          redo
        </span>
        <span
          className="border border-white rounded-md hover:cursor-pointer"
          onClick={() => {
            downloadImage(canvasRef.current);
            setProperties({ ...properties, currentTool: "pencil" });
          }}
        >
          download
        </span>
      </div> */}
      {
        //TODO: make dialog box for text options...
      }
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
