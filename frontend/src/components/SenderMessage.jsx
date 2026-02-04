import React from "react";
import dp from "../assets/dp.png";
const SenderMessage = () => {
  return (
    <div className="w-fit max-w-[500px]  bg-[#1797c2] px-[20px] py-[10px] text-white rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-lg shadow-gray-400 gap-[10px] text-[19px] flex flex-col ">
      <img src={dp} alt="" className="w-[150px] rounded-lg" />
      <span>Hii</span>
    </div>
  );
};

export default SenderMessage;
