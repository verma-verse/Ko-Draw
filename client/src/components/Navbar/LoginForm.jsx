import React from "react";
import Register from "./Register";
const LoginForm = ({ setIsShowLogin }) => {
    return (
        <div className="active">
            <div className="login-form w-fit ">
                <div className="form-box solid">
                    <form>
                        <h1 className="login-text">Sign In</h1>
                        <button onClick={() => {
                            setIsShowLogin(null)
                        }}>close</button>
                        <label>Username</label>
                        <br></br>
                        <input type="text" name="username" className="login-box" />
                        <br></br>
                        <label>Password</label>
                        <br></br>
                        <input type="password" name="password" className="login-box" />
                        <br></br>
                        <input type="submit" value="LOGIN" className="login-btn" /><br></br>
                        <button onClick={() => {
                            setIsShowLogin("register")
                        }}>Didn't have an account :</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
