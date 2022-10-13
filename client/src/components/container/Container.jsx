import Board from "../board/Board";
export default function Container() {
  return (
    <div className="fixed w-full h-full bg-black">
      <div className="text-center">
        <input type="color" />
      </div>
      <div className="w-11/12 m-auto mt-4 bg-white h-11/12">
        <Board />
      </div>
    </div>
  );
}
