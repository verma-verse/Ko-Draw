import React, { useState } from "react";
import NavBar from "./components/Navbar/NavBar";
import Container from "./components/container/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import ProfileDialog from "./components/profile/ProfileDialog";
import Profile from "./components/profile/Profile";
import TextEditor from "./components/texteditor/TextEditor";

export default function App() {
  const user = localStorage.getItem("token");
  const [isShowLogin, setIsShowLogin] = useState(null);
  const handleLoginClick = () => {
    setIsShowLogin("login");
  };
  return (
    <div className="h-screen App ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/* <Profile /> */}
      <Container />
      {/* <TextEditor /> */}
    </div>
  );
}
