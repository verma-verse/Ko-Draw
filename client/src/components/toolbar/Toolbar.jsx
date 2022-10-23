import { BsPencil, BsCircle } from "react-icons/bs";
import { BiEraser } from "react-icons/bi";
import { GiPaintBucket } from "react-icons/gi";
import { TfiText } from "react-icons/tfi";
import { AiOutlineLine, AiOutlineStar } from "react-icons/ai";
import { TbRectangle, TbOvalVertical } from "react-icons/tb";
import { FaPaintBrush } from "react-icons/fa";
export default function Toolbar() {
  const iconsClassName = "border border-black rounded-sm p-1 text-lg mb-1 mr-1";
  return (
    <div className="flex flex-col px-1 py-2 max-w-fit">
      <div className="flex">
        <div className="flex flex-col">
          <span className={iconsClassName} title="Pencil">
            <BsPencil />
          </span>
          <span className={iconsClassName} title="Eraser">
            <BiEraser />
          </span>
          <span className={iconsClassName} title="Paint">
            <GiPaintBucket />
          </span>
          <span className={iconsClassName} title="Text">
            <TfiText />
          </span>
          <span className={iconsClassName} title="Brush">
            <FaPaintBrush />
          </span>
        </div>
        <div className="flex flex-col">
          <span className={iconsClassName} title="Line">
            <AiOutlineLine />
          </span>
          <span className={iconsClassName} title="Star">
            <AiOutlineStar />
          </span>
          <span className={iconsClassName} title="Rectangle">
            <TbRectangle />
          </span>
          <span className={iconsClassName} title="Oval">
            <TbOvalVertical />
          </span>
          <span className={iconsClassName} title="Circle">
            <BsCircle />
          </span>
        </div>
      </div>
      <div>color picker</div>
      <div>size picker</div>
    </div>
  );
}
