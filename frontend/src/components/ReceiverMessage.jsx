import React from "react";
import dp from "../assets/dp.png";
const ReceiverMessage = ({ image, message }) => {
  return (
    <div className="w-fit max-w-[500px]  bg-[#20c7ff] px-[20px] py-[10px] text-white rounded-tr-none rounded-2xl relative left-0  shadow-lg shadow-gray-400 gap-[10px] text-[19px] flex flex-col ">
       {image && <img src={image}  className="w-[150px] rounded-lg" />}
      {message && <span>{message}</span>}
    </div>
  );
};

export default ReceiverMessage;
