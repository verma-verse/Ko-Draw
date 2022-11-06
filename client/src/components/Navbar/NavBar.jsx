import React from "react";

function NavBar({ handleLoginClick }) {
    const handleClick = () => {
        handleLoginClick();
    };
    return (
        <div className="z-50 navbar">
            <div>
                <span onClick={handleClick} className="loginicon">
                    Sign In
                </span>
            </div>
            <div class="dropdown">
                <button class="dropbtn">File</button>
                <div class="dropdown-content">
                    <a href="#">New</a>
                    <a href="#">Open</a>
                    <a href="#">Save As</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">Edit</button>
                <div class="dropdown-content">
                    <a href="#">New</a>
                    <a href="#">Open</a>
                    <a href="#">Save As</a>
                </div>

            </div>
            <div class="dropdown">
                <button class="dropbtn">Insert</button>
                <div class="dropdown-content">
                    <a href="#">Shapes</a>
                    <a href="#">Images</a>
                    <a href="#">Text</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">Draw</button>
                <div class="dropdown-content">
                    <a href="#">Star</a>
                    <a href="#">Circle</a>
                    <a href="#">Rectangle</a>
                </div>

            </div>
            <div class="dropdown">
                <button class="dropbtn">View</button>
                <div class="dropdown-content">
                    <a href="#">Zoom</a>
                    <a href="#">Canvas</a>
                    <a href="#">Grid</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">Help</button>
                <div class="dropdown-content">
                    <a href="#">A</a>
                    <a href="#">B</a>
                    <a href="#">C</a>
                </div>

            </div>
        </div>
    );
}

export default NavBar;
