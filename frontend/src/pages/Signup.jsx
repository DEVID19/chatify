import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/userSlice";

const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let dispatch = useDispatch();
  const handleSignup = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      // Handle signup logic here
      if (!username || !email || !password) {
        alert("Please fill in all fields");
        return;
      }

      let result = await axios.post(
        `${server}/api/auth/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setuserData(result.data));
      setUsername("");
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
            Welcome to <span className="text-white">Chatify</span>{" "}
          </h1>
        </div>
        <form
          className="w-full  flex flex-col gap-[20px] items-center justify-center "
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="username"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-200  shadow-lg text-gray-700 text-[19px]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-200  shadow-lg text-gray-700 text-[19px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200  shadow-lg  relative">
            <input
              type={show ? "text" : "password"}
              placeholder="password"
              className="w-full h-full outline-none  px-[20px] py-[20px]  bg-white  text-gray-700 text-[19px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[19px] text-[#20c7ff] font-semibold "
              onClick={() => setShow((prev) => !prev)}
            >
              {`${show ? "Hide" : "Show"}`}
            </span>
          </div>
          {/* error message  */}
          {error && (
            <p className="text-red-500 text-md font-bold items-center justify-center text-center">
              {error}
            </p>
          )}
          <button
            className="px-[20px] py-[10px] bg-[#20c7ff]  rounded-2xl shadow-gray-400 shadow-lg w-[200px] mt-[20px] cursor-pointer text-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>

          <p>
            Already Have An Account ?
            <span
              className="text-[#20c7ff] text-bold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {" "}
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
