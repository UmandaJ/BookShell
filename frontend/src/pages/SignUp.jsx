import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/signup.jpg";
import axios from "axios";

const SignUp = () => {
  const [Values,setValues] = useState({ username:"", email:"", password:"", address:"", role:"buyer" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => {
    const {name,value} = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault(); 
    try {
      
      if (!Values.username || !Values.email || !Values.password || !Values.address) {
        alert("All fields are required");
        return;
      }

      setLoading(true);
      const res = await axios.post(
        "https://book-shell-backend.vercel.app/api/v1/signup",
        Values,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message)
      navigate("/LogIn"); 
    } catch (error) {
      console.error(error);
      // surface an error to the user
      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Sign up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-yellow-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2">
          <img src={signupImg} alt="Sign Up" className="w-full h-full object-cover" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-semibold text-yellow-300 text-center">
            Join the BookShell Community 📚
          </h1>

          {/* ✅ handle submit on the form */}
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
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none "
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-white">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="xyz@example.com"
                value={Values.email}
                onChange={change}
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none "
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

            <div>
              <label htmlFor="role" className="block text-sm text-white">User type</label>
              <select id="role" name="role" value={Values.role} onChange={change}
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none ">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>

              <label htmlFor="address" className="block text-sm text-white">Address</label>
              <textarea
                id="address"
                name="address"
                rows="4"
                placeholder="Enter your address"
                value={Values.address}
                onChange={change}
                className="mt-2 w-full rounded bg-zinc-800 text-white px-3 py-2 outline-none "
              />
            </div>

            <button
              type="submit"         
              disabled={loading}
              className="w-full bg-yellow-500 rounded hover:bg-white hover:text-zinc-800 transition py-2 disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-white text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/LogIn" className="text-yellow-300 hover:text-yellow-200 underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;