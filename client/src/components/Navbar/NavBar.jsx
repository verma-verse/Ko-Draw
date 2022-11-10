import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import ShareOptions from "../Utilities/ShareOptions";
import UserImage from "../Utilities/UserImage";
import ProfileDialog from "../profile/ProfileDialog";
function NavBar() {
  const [shareOp, setShareOp] = useState(false);
  const [name, setName] = useState(null);
  const [dp, setDp] = useState(null);
  const [toggle, setToggle] = useState(false);
  const showShareOptions = () => {
    setShareOp((f) => !f);
  };
  useEffect(() => {
    const user = sessionStorage.getItem("firstName");
    const photo = sessionStorage.getItem("dp");
    if (user) setName(user);
    if (photo) setDp(photo);
  }, []);
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-between h-12 bg-white">
      <div className="flex items-center justify-start w-1/2">
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            File
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              New
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Open
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Save As
            </a>
          </div>
        </div>
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            Edit
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Undo
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Redo
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Reset
            </a>
          </div>
        </div>
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            Insert
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Shapes
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Images
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Text
            </a>
          </div>
        </div>
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            Draw
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Star
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Circle
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Rectangle
            </a>
          </div>
        </div>
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            View
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Zoom
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Canvas
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              Grid
            </a>
          </div>
        </div>
        <div className="relative inline-block ml-10 text-black group">
          <button className="px-2 text-black border rounded-md text-md">
            Help
          </button>
          <div className="absolute z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              A
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              B
            </a>
            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
              C
            </a>
          </div>
        </div>
      </div>

      {shareOp && <ShareOptions />}
      <div className="flex items-center justify-end w-full">
        {!name ? (
          <div className="mr-10 hover:cursor-pointer">
            <Link to="/login">Sign In</Link>
          </div>
        ) : (
          <div
            onClick={showShareOptions}
            className="px-3 py-1 mr-10 font-semibold text-white bg-blue-600 border rounded-lg hover:cursor-pointer"
          >
            Share
          </div>
        )}
        {dp ? (
          <UserImage toggle={toggle} setToggle={setToggle} data={dp} />
        ) : (
          <div onClick={() => setToggle(f => !f)} className="mr-10 text-3xl hover:cursor-pointer">
            <HiUserCircle />
          </div>
        )}
        {toggle && <ProfileDialog />}
      </div>
    </div>
  );
}

export default NavBar;
