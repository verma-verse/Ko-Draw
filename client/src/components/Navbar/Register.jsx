import React from "react";
const Register = ({ setIsShowLogin }) => {
    return (
        <div className="active">
            <div className="flex justify-center w-full align-middle login-form min-h-fit">
                <div className="form-box solid">
                    <form>
                        <h1 className="w-full login-text colo">Sign Up</h1>
                        <label>First Name</label>
                        <br></br>
                        <input type="text" name="first-name" className="login-box" />
                        <br></br>
                        <label>Last Name</label>
                        <br></br>
                        <input type="text" name="last-name" className="login-box" />
                        <br></br>
                        <label>Email</label>
                        <br></br>
                        <input type="email" name="email" className="login-box" />
                        <br></br>
                        <label>Mobile No</label>
                        <br></br>
                        <input type="tel" name="name" className="login-box" />
                        <br></br>
                        <label>Password</label>
                        <br></br>
                        <input type="password" name="password" className="login-box" />
                        <br></br>
                        <label>Confirm Password</label>
                        <br></br>
                        <input type="password" name="password" className="login-box" />
                        <br></br>
                        <input type="submit" value="SIGN UP" className="login-btn" />
                        <button onClick={() => {
                            setIsShowLogin("login")
                        }}> Login Here :</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
