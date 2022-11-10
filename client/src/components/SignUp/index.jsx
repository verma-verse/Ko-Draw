import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Spinner from "../Utilities/Spinner";
import { useRef } from "react";
import { GiCrossedBones } from "react-icons/gi";


const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
  });
  const imageRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  function handleImage() {         //function to handle the image input
    const image = imageRef.current.files[0]
    if (image && image['type'].split('/')[0] === 'image') {  //continue only if file is an image.
      let fileReader = new FileReader()
      fileReader.onload = fileLoadedEvent => {
        let srcData = fileLoadedEvent.target.result; // <--- data: base64
        setData({ ...data, image: srcData })
      }
      fileReader.readAsDataURL(image);
    }
  }
  const backtohome = () => {
    navigate('./profile');
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_SERVER_URL}/api/auth/register`;
    setLoading(true);
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
        if (!res.success) {
          window.alert(res.message);
        } else {
          window.alert(res.message)
          navigate("/login");
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Welcome Back</h1>
            <Link
              to="/login"
              className="px-5 py-2 text-lg bg-white rounded-3xl"
            >
              Sign in
            </Link>
          </div>
          <div className={styles.right}>
            <div className="" onClick={backtohome}>
              <GiCrossedBones className="" />
            </div>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Create Account</h1>


              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
              />
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
              <input
                type="file"
                required
                className={styles.input}
                onChange={handleImage}
                ref={imageRef}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              {loading ? (
                <Spinner />
              ) : (
                <button type="submit" className={styles.green_btn}>
                  Sign Up
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
