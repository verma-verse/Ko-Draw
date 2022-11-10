import React, { useEffect, useRef, useState } from "react";
import NavBar from "./components/Navbar/NavBar";
import Container from "./components/container/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/profile/Profile";

export default function App() {
  const [title, setTitle] = useState(null)
  const paintRef = useRef();
  useEffect(() => {
    const user = sessionStorage.getItem("user")
    if (!user) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/check`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            sessionStorage.setItem("user", res.id)
            sessionStorage.setItem("firstName", res.firstName)
            sessionStorage.setItem("email", res.email)
            sessionStorage.setItem("dp", res.dp)
          }
        })
        .catch((e) => console.log(e))
    }
  })

  return (
    <div className="h-screen App ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><NavBar paintRef={paintRef} /><Container paintRef={paintRef} /></>}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
