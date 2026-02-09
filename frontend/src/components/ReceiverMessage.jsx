/* eslint-disable react-hooks/refs */
import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";
const ReceiverMessage = ({ image, message }) => {
  let { selectedUser } = useSelector((state) => state.user);
  // useEffect(() => {
  //   scroll?.current.scrollIntoView({ behavior: "smooth" });
  // }, [message, image]);

  // const handleImageScroll = () => {
  //   scroll?.current.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div className="flex items-start gap-[10px]">
      <div className="w-[40px] h-[40px]  rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg shadow-gray-500">
        <img src={selectedUser?.image || dp} alt="" className="h-[100%]" />
      </div>
      <div className="w-fit max-w-[500px] bg-[#1797c2] px-[20px] py-[10px] text-white rounded-tl-none rounded-2xl relative left-0 shadow-lg shadow-gray-400 gap-[10px] text-[19px] flex flex-col ">
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] rounded-lg"
            // onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
