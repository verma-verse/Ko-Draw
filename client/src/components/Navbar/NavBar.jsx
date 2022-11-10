import React from "react";
import { Link } from "react-router-dom";
import {HiUserCircle} from 'react-icons/hi'
function NavBar({ handleLoginClick }) {
  return (
    <div className="z-50 flex absolute bg-white h-12 left-0 top-0 right-0 justify-between">
      <div className="flex w-1/2 justify-start items-center">
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">File</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">New</a>
            <a href="#">Open</a>
            <a href="#">Save As</a>
          </div>
        </div>
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">Edit</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">Undo</a>
            <a href="#">Redo</a>
            <a href="#">Reset</a>
          </div>
        </div>
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">Insert</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">Shapes</a>
            <a href="#">Images</a>
            <a href="#">Text</a>
          </div>
        </div>
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">Draw</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">Star</a>
            <a href="#">Circle</a>
            <a href="#">Rectangle</a>
          </div>
        </div>
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">View</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">Zoom</a>
            <a href="#">Canvas</a>
            <a href="#">Grid</a>
          </div>
        </div>
        <div className="ml-10 relative inline-block text-black">
          <button className="dropbtn">Help</button>
          <div className=" hidden absolute bg-grey-500 min-w-48 shadow-md z-50">
            <a href="#">A</a>
            <a href="#">B</a>
            <a href="#">C</a>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end  items-center">
        <div className="mr-10"><Link to="/login">
          Sign In
        </Link>
        </div>
        <div className="mr-10">
          Share
        </div>
        <div className="mr-10 text-3xl">
          <HiUserCircle/>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
