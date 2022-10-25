import { BsPencil, BsCircle } from "react-icons/bs";

export default function ({ properties, setProperties, title, component }) {
  const iconsClassName =
    "border border-black rounded-sm p-1 text-lg mb-1 mr-1 font-bold";
  const activeTool = "bg-gray-400";
  return (
    <span
      className={
        properties.currentTool === title
          ? iconsClassName + " " + activeTool
          : iconsClassName
      }
      title={title}
      onClick={() => setProperties({ ...properties, currentTool: title })}
    >
      {component}
    </span>
  );
}
