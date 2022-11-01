import React, { useState } from "react";
import "./styles.css";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import Container from "./components/container/Container";
import Register from "./components/Register";

export default function App() {
  const [isShowLogin, setIsShowLogin] = useState(null);
  const handleLoginClick = () => {
    setIsShowLogin("login");
  };
  return (
    <div className="App">
      {/* <NavBar handleLoginClick={handleLoginClick} /> */}
      {isShowLogin === "login" && <LoginForm setIsShowLogin={setIsShowLogin} />}
      {isShowLogin === "register" && (
        <Register setIsShowLogin={setIsShowLogin} />
      )}
      <Container />
    </div>
  );
}
