import React, { useState } from "react";
import "./styles.css";
import NavBar from "./components/Navbar/NavBar";
import Container from "./components/container/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";

export default function App() {
  const user = localStorage.getItem("token");
  const [isShowLogin, setIsShowLogin] = useState(null);
  const handleLoginClick = () => {
    setIsShowLogin("login");
  };
  return (
    <div className="App">
      {/* <NavBar handleLoginClick={handleLoginClick} />

      {isShowLogin === "login" && <LoginForm setIsShowLogin={setIsShowLogin} />}
      {isShowLogin === "register" && (
        <Register setIsShowLogin={setIsShowLogin} />
      )} */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />} ></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Container />
    </div>
  );
}
