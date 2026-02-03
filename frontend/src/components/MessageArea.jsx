import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";

const MessageArea = () => {
  let { selectedUser } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  return (
    <div
      className={`lg:w-[70%] w-full h-full bg-slate-200 border-l-2 border-gray-300 
        ${selectedUser ? "flex" : "hidden"} lg:flex  relative`}
    >
      {selectedUser ? (
        <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg shadow-gray-400 flex items-center px-[20px]  gap-[20px]">
          <div
            className="cursor-pointer"
            onClick={() => dispatch(setSelectedUser(null))}
          >
            <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
          </div>
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white">
            <img src={selectedUser?.image || dp} alt="" className="h-[100%]" />
          </div>
          <h1 className="text-white  font-semibold text-[20px]">
            {selectedUser?.fullname || selectedUser?.username}
          </h1>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-gray-700  font-bold text-[50px]">
            Welcome to Chatify 👋
          </h1>
          <span className="text-gray-700  font-semibold text-[30px]">
            Chat Friendly ....
          </span>
        </div>
      )}
      <div className="w-full  h-[100px] lg:w-[70%] fixed bottom-[20px] flex items-center justify-center ">
        <form className="w-[95%] max-w-[70%] h-[60px] bg-[#1797c2] rounded-full shadow-lg shadow-gray-400   flex items-center gap-[10px]">
          <div className="">
            <RiEmojiStickerLine />
          </div>
          <input type="text"  />
          <div>
            <FaImages />
          </div>
          <div>
            <RiSendPlane2Fill />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
