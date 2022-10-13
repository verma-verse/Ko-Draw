import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import io from "socket.io-client";

export default function Board() {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const socket = io.connect("http://localhost:8000");
  const [time, setTime] = useState(null);
  socket.on("canvas-data", (data) => {
    let image = new Image();
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
    };
    image.src = data;
  });

  useEffect(() => {
    drawOnCanvas();
  }, []);
  const drawOnCanvas = () => {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext("2d");

    var sketch = sketchRef.current;
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener(
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
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";

    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );
    if (time) {
      clearTimeout(time);
      setTime(null);
    }
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
      setTime(
        setTimeout(function () {
          var base64img = canvas.toDataURL("image/png");
          socket.emit("canvas-data", base64img);
          console.log("timeout");
        }, 1000)
      );
    };
  };

  return (
    <div ref={sketchRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
}
