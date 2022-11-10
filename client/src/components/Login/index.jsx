import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Spinner from "../Utilities/Spinner";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_SERVER_URL}/api/auth/login`;
    setLoading(true);
    // console.log(email,password)
    //FIXME: Deal with cors man..
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 400) {
          return window.alert("Error: " + res.error);
        } else if (res.status === 404) {
          return window.alert(res.message);
        } else if (res.status === 200) {
          sessionStorage.setItem("user", res.id);
          sessionStorage.setItem("email", res.email);
          sessionStorage.setItem("dp", res.dp);
          sessionStorage.setItem("firstName", res.firstName);
          setLoading(false);
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
      });
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className={styles.green_btn}>
                Sign In
              </button>
            )}
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup" className="px-5 py-2 text-lg bg-white rounded-3xl">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
