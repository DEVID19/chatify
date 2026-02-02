import React from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";

import { useState } from "react";
import axios from "axios";
import { server } from "../main";
import { setOtherUsers, setuserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  let { userData, otherUsers } = useSelector((state) => state.user);
  let [searchActive, setSearchActive] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const handleLogout = async () => {
    try {
      let result = await axios.get(`${server}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setuserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log("error occur in handleLogout function ", error);
    }
  };
  return (
    <div className="lg:w-[30%] w-full h-full bg-slate-200">
      <div
        className="w-15 h-14 rounded-full shadow-lg overflow-hidden bg-[#19cdff] shadow-gray-500 flex items-center justify-center cursor-pointer hover:scale-110 fixed bottom-[20px] left-[20px]"
        onClick={handleLogout}
      >
        <RiLogoutCircleLine className="w-7 h-7" />
      </div>

      <div className="w-full h-[300px] bg-[#19cdff] rounded-b-[30%] shadow-lg shadow-gray-400 flex flex-col justify-center px-[20px]">
        <h1 className="text-white font-bold text-[25px]">Chatify</h1>
        <div className="w-full flex justify-between items-center  ">
          <h1 className="text-gray-800 font-bold text-[25px] ">
            Hii , {userData?.fullName || "User"}
          </h1>
          <div
            className="w-22 h-22 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white shadow-gray-500  cursor-pointer hover:scale-110"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-[20px] ">
          {!searchActive && (
            <div
              className="w-15 h-14 rounded-full border-2 mt-[10px]  border-white shadow-lg overflow-hidden bg-white shadow-gray-500 flex items-center justify-center cursor-pointer hover:scale-110"
              onClick={() => setSearchActive(true)}
            >
              <IoIosSearch className="w-7  h-7 " />
            </div>
          )}
          {searchActive && (
            <form className="w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px]  mt-[10px] rounded-full overflow-hidden px-[20px]">
              <IoIosSearch className="w-[25px]  h-[25px]  font-bold text-gray-700 cursor-pointer" />
              <input
                type="text"
                placeholder="Search User..."
                className="w-full h-full p-[10px] text-[17px] outline-0  border-0"
              />
              <RxCross2
                className="w-[25px]  h-[25px]  font-bold text-gray-700 cursor-pointer"
                onClick={() => setSearchActive(false)}
              />
            </form>
          )}

          {!searchActive &&
            otherUsers?.map((user) => (
              <div className="w-[60px] h-[60px] rounded-full  mt-[10px] overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg ">
                <img src={user?.image || dp} alt="" className="h-[100%]" />
              </div>
            ))}
        </div>
      </div>

      <div className="w-full  h-[60vh] overflow-auto flex flex-col gap-[20px] mt-[20px] items-center  ">
        {otherUsers?.map((user) => (
          <div className="w-[95%] h-[60px] flex  items-center gap-[20px] bg-white shadow-lg shadow-gray-500 rounded-full hover:bg-[#63c2dc] ">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg">
              <img src={user?.image || dp} alt="" className="h-[100%]" />
            </div>
            <h1 className="text-gray-800 font-semibold text-[20px] ">{user.fullName || user.username}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
