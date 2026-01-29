import React from "react";
import dp from "../assets/dp.png";
const Profile = () => {
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center  items-center">
      <div className=" bg-white rounded-full border-4 border-[#20c7ff] shadow-lg   relative shadow-gray-400">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden ">
          <img src={dp} alt="dp image" className="h-full" />
        </div>
        <IoCameraOutline className="absolute bottom-4 text-gray-700 right-5 w-[28px] h-[28px]" />
      </div>
      <form></form>
    </div>
  );
};

export default Profile;
