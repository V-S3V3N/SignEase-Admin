import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase Auth handles login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken(); // 🔐 Firebase ID token

      // Send token to backend
      const response = await fetch("http://localhost:5000/api/check-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (response.ok) {
        // Store role/token/etc. if needed
        localStorage.setItem("uid", user.uid);
        navigate("/");
      } else {
        alert(result.message || "Access denied");
      }
    } catch (err) {
      console.error("SignIn error:", err);
      alert("Email or password is incorrect");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-10">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">SignEase<sup>©</sup></h1>
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control form-control-user"
                            placeholder="Enter Email Address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-user"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                              checked={showPassword}
                              onChange={toggleShowPassword}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck"
                            >
                              Show Password
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                        >
                          Sign In
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
