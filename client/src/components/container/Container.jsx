import Board from "../board/Board";
import Toolbar from "../toolbar/Toolbar";
export default function Container() {
  return (
    <div className="fixed flex w-screen h-screen bg-black">
      <div className="z-20 h-auto mx-1 my-2 bg-white rounded-md w-fit">
        <Toolbar />
      </div>
      <div className="z-20 w-full h-auto mx-1 my-2 bg-white rounded-md">
        <Board />
      </div>
    </div>
  );
}
