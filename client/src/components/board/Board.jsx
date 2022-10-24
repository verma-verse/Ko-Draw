import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Board({ properties, setProperties }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  useEffect(() => {
    drawOnCanvas();
  }, []);

  useEffect(() => {
    let ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = properties.size;
    // ctx.lineJoin = "round";
    // ctx.lineCap = "round";
    ctx.strokeStyle = properties.color;
    if (properties.currentTool === "pencil") {
      ctx.lineWidth = 1;
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
    }
  }, [properties]);

  function drawOnCanvas() {
    let ctx = canvasRef.current.getContext("2d");
    let sketch = sketchRef.current;
    var sketch_style = getComputedStyle(sketch);
    canvasRef.current.width = parseInt(sketch_style.getPropertyValue("width"));
    canvasRef.current.height = parseInt(
      sketch_style.getPropertyValue("height")
    );

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
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
        canvasRef.current.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvasRef.current.addEventListener(
      "mouseup",
      function () {
        canvasRef.current.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    // var root = this;
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      // if(root.timeout != undefined) clearTimeout(root.timeout);
      // root.timeout = setTimeout(function(){
      //     var base64ImageData = canvas.toDataURL("image/png");
      //     root.socket.emit("canvas-data", base64ImageData);
      // }, 1000)
    };
  }

  return (
    <div className="w-full h-full" ref={sketchRef}>
      <canvas ref={canvasRef} className=""></canvas>
    </div>
  );
}
