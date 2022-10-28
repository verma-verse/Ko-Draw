import { BsPencil, BsCircle } from "react-icons/bs";
import { BiEraser } from "react-icons/bi";
import { GiPaintBucket } from "react-icons/gi";
import { TfiText } from "react-icons/tfi";
import { AiOutlineLine, AiOutlineStar } from "react-icons/ai";
import { TbRectangle, TbOvalVertical } from "react-icons/tb";
import { FaPaintBrush } from "react-icons/fa";
import { SiPlatformdotsh } from "react-icons/si";
import { GrGallery } from "react-icons/gr";
import { useState } from "react";

import Tool from "./Tool";
export default function Toolbar({ properties, setProperties }) {
  return (
    <div className="flex flex-col px-1 py-2 max-w-fit">
      <div className="flex">
        <div className="flex flex-col">
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="pencil"
            component={<BsPencil />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="brush"
            component={<FaPaintBrush />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="eraser"
            component={<BiEraser />}
          />

          <Tool
            properties={properties}
            setProperties={setProperties}
            title="paintBucket"
            component={<GiPaintBucket />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="text"
            component={<TfiText />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="image"
            component={<GrGallery />}
          />
        </div>
        <div className="flex flex-col">
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="line"
            component={<AiOutlineLine />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="star"
            component={<AiOutlineStar />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            Size
            title="rectangle"
            component={<TbRectangle />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="oval"
            component={<TbOvalVertical />}
          />
          <Tool
            properties={properties}
            setProperties={setProperties}
            title="circle"
            component={<BsCircle />}
          />
        </div>
      </div>
      {properties.currentTool === "eraser" ? (
        <div>
          <input
            type="color"
            value={properties.bgcolor}
            onChange={(e) => {
              setProperties({ ...properties, bgcolor: e.target.value });
            }}
          />
        </div>
      ) : (
        <div>
          <input
            type="color"
            value={properties.color}
            onChange={(e) => {
              setProperties({ ...properties, color: e.target.value });
            }}
          />
        </div>
      )}
      {properties.currentTool !== "pencil" && (
        <div className="flex" title="Size">
          <span className="p-1 mb-1 text-md">
            <SiPlatformdotsh />
          </span>
          <input
            min={1}
            max={99}
            className="w-10 text-center text-white rounded-sm bg-slate-600"
            type="number"
            value={properties.size}
            onChange={(e) => {
              if (e.target.value < 1) e.target.value = 1;
              else if (e.target.value > 99) e.target.value = 99;
              setProperties({ ...properties, size: e.target.value });
            }}
          />
        </div>
      )}
    </div>
  );
}
