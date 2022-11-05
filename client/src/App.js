import React, { useState } from "react";
import "./styles.css";
import NavBar from "./components/Navbar/NavBar";
import LoginForm from "./components/Navbar/LoginForm";
import Container from "./components/container/Container";
import Register from "./components/Navbar/Register";



export default function App() {
  const [isShowLogin, setIsShowLogin] = useState(null);
  const handleLoginClick = () => {
    setIsShowLogin("login");
  };
  return (
    <div className="App">
      <NavBar handleLoginClick={handleLoginClick} />

      {isShowLogin === "login" && <LoginForm setIsShowLogin={setIsShowLogin} />}
      {isShowLogin === "register" && (
        <Register setIsShowLogin={setIsShowLogin} />
      )}
      <Container />
    </div>
  );
}
