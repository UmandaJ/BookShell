import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login.jpg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const LogIn = () => {
  const [Values, setValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();               
    try {
      if (!Values.username || !Values.password) {
        alert("All fields are required");
        return;
      }

      setLoading(true);
      const { data } = await axios.post(
        "https://book-shell-backend.vercel.app/api/v1/signin",
        Values,
        { headers: { "Content-Type": "application/json" } }
      );

      // Persist + Redux auth state
      localStorage.setItem("id", data.id);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      dispatch(authActions.login());
      dispatch(authActions.changeRole(data.role));

      navigate("/profile");           // go to Profile on success
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-yellow-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2">
          <img src={loginImg} alt="Log In" className="w-full h-full object-cover" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-semibold text-yellow-300 text-center">
            Welcome Back to BookShell 📚
          </h1>

          <form className="mt-6 space-y-5" onSubmit={submit}>
            <div>
              <label htmlFor="username" className="block text-sm text-white">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={Values.username}
                onChange={change}
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-white">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={Values.password}
                onChange={change}
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-semibold rounded hover:bg-white hover:text-zinc-800 transition py-2 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-white text-sm mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/SignUp" className="text-yellow-300 hover:text-yellow-200 underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;