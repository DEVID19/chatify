import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let dispatch = useDispatch();
  const handleLogin = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      // Handle Login logic here
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }

      let result = await axios.post(
        `${server}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setuserData(result.data));
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg  shadow-lg shadow-gray-400 flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#19cdff] rounded-b-[30%] shadow-lg shadow-gray-400 flex items-center justify-center ">
          <h1 className="text-[30px] font-bold text-center text-gray-600 ">
            Login to <span className="text-white">Chatify</span>
          </h1>
        </div>
        <form
          className="w-full  flex flex-col gap-[20px] items-center justify-center "
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-200  shadow-lg text-gray-700 text-[19px]"
          />

          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200  shadow-lg  relative">
            <input
              type={show ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full outline-none  px-[20px] py-[20px]  bg-white  text-gray-700 text-[19px]"
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[19px] text-[#20c7ff] font-semibold "
              onClick={() => setShow((prev) => !prev)}
            >
              {`${show ? "Hide" : "Show"}`}
            </span>
          </div>
          {error && (
            <p className="text-red-500 text-md font-bold items-center justify-center text-center">
              {error}
            </p>
          )}
          <button
            className="px-[20px] py-[10px] bg-[#20c7ff]  rounded-2xl shadow-gray-400 shadow-lg w-[200px] mt-[20px] cursor-pointer text-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Log in"}
          </button>

          <p>
            Want to Create a new Account ?
            <span
              className="text-[#20c7ff] text-bold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
