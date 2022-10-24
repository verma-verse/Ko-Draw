import { BsPencil, BsCircle } from "react-icons/bs";
import { BiEraser } from "react-icons/bi";
import { GiPaintBucket } from "react-icons/gi";
import { TfiText } from "react-icons/tfi";
import { AiOutlineLine, AiOutlineStar } from "react-icons/ai";
import { TbRectangle, TbOvalVertical } from "react-icons/tb";
import { FaPaintBrush } from "react-icons/fa";
import { useState } from "react";
import Tool from "./Tool";
export default function Toolbar({ properties, setProperties }) {
  const iconsClassName = "border border-black rounded-sm p-1 text-lg mb-1 mr-1";
  const activeTool = "bg-gray-400";
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
            title="brush"
            component={<FaPaintBrush />}
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
      <div>
        <input
          type="color"
          value={properties.color}
          onChange={(e) => {
            setProperties({ ...properties, color: e.target.value });
          }}
        />
      </div>
      <div className="flex">
        <span className="p-1 mb-1 text-md" title="Size">
          <FaPaintBrush />
        </span>
        {properties.currentTool !== "pencil" && (
          <input
            className="w-10 text-center text-white rounded-sm bg-slate-600"
            type="number"
            value={properties.size}
            onChange={(e) => {
              setProperties({ ...properties, size: e.target.value });
            }}
          />
        )}
      </div>
    </div>
  );
}
