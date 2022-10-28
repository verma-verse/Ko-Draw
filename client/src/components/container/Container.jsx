import Board from "../board/Board";
import Toolbar from "../toolbar/Toolbar";
import { useState } from "react";
import LoginForm from "../LoginForm";
import NavBar from "../NavBar";
export default function Container() {
  const [properties, setProperties] = useState({
    currentTool: "pencil",
    color: "#000000",
    bgcolor: "#FFFFFF",
    size: 5,
  });


  return (

    <div className="fixed flex w-screen h-screen mt-16 bg-black">
      <div className="z-20 h-auto mx-1 my-2 bg-white rounded-md w-fit">
        <Toolbar properties={properties} setProperties={setProperties} />
      </div>
      <div className="z-20 w-full h-auto mx-1 my-2 bg-white rounded-md">
        <Board properties={properties} setProperties={setProperties} />
      </div>
    </div>
  );
}
