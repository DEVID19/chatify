// import { useDispatch, useSelector } from "react-redux";
// import dp from "../assets/dp.png";
// import { IoCameraOutline } from "react-icons/io5";
// import { IoIosArrowRoundBack } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useRef, useState } from "react";
// import axios from "axios";
// import { server } from "../main";
// import { setuserData } from "../redux/userSlice";
// const Profile = () => {
//   let { userData } = useSelector((state) => state.user);
//   let navigate = useNavigate();
//   let [fullName, setFullName] = useState(userData?.fullName || "");
//   let [status, setStatus] = useState(userData?.status || "");
//   let [frontendImage, setFrontendImage] = useState(userData?.image || dp);
//   let [backendImage, setBackendImage] = useState(null);
//   let dispatch = useDispatch();
//   let [saving, setSaving] = useState(false);
//   let image = useRef();

//   const handleImage = (e) => {
//     let file = e.target.files[0];
//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//   };

//   const handleProfile = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       let formData = new FormData();
//       formData.append("fullName", fullName);
//       formData.append("status", status);
//       if (backendImage) {
//         formData.append("image", backendImage);
//       }
//       let result = await axios.put(`${server}/api/user/profile`, formData, {
//         withCredentials: true,
//       });
//       setSaving(false);
//       dispatch(setuserData(result.data));
//     } catch (error) {
//       console.log(error);
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center  items-center gap-[20px]">
//       <div className="fixed top-[20px] left-[20px]">
//         <IoIosArrowRoundBack
//           className="w-[50px] h-[50px] text-gray-600 cursor-pointer"
//           onClick={() => navigate("/")}
//         />
//       </div>
//       <div
//         className=" bg-white rounded-full border-4 border-[#20c7ff] shadow-lg   relative shadow-gray-400"
//         onClick={() => image.current.click()}
//       >
//         <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center">
//           <img src={frontendImage} alt="dp image" className="h-[100%]" />
//         </div>
//         <div className="absolute bottom-4 text-gray-700 right-4 w-[35px] h-[35px]  rounded-full bg-[#20c7ff] flex justify-center items-center  shadow-gray-400  shadow-lg ">
//           <IoCameraOutline className=" text-gray-700  w-[25px] h-[25px]" />
//         </div>
//       </div>
//       <form
//         className="w-[95%]  max-w-[500px] flex flex-col gap-[20px] items-center justify-center"
//         onSubmit={handleProfile}
//       >
//         {/* image input  */}
//         <input
//           type="file"
//           accept="image/*"
//           ref={image}
//           hidden
//           onChange={handleImage}
//         />
//         <input
//           type="text"
//           placeholder="Enter your name "
//           className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-400  shadow-lg text-gray-700 text-[19px]"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter your status"
//           className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-400  shadow-lg text-gray-700 text-[19px]"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         />
//         <input
//           type="text"
//           readOnly
//           className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-400  shadow-lg text-gray-400 text-[19px]"
//           value={userData?.username}
//         />
//         <input
//           type="text"
//           readOnly
//           className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[20px]  bg-white rounded-lg shadow-gray-400  shadow-lg text-gray-400 text-[19px]"
//           value={userData?.email}
//         />
//         <button
//           className="px-[20px] py-[10px] bg-[#20c7ff]  rounded-2xl shadow-gray-400 shadow-lg w-[200px] mt-[20px] cursor-pointer text-[20px] font-semibold hover:shadow-inner"
//           disabled={saving}
//         >
//           {saving ? "Saving ..." : "Save Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profile;

import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { setuserData } from "../redux/userSlice";

const Profile = () => {
  let { userData } = useSelector((state) => state.user);
  let navigate = useNavigate();
  let [fullName, setFullName] = useState(userData?.fullName || "");
  let [status, setStatus] = useState(userData?.status || "");
  let [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  let [backendImage, setBackendImage] = useState(null);
  let dispatch = useDispatch();
  let [saving, setSaving] = useState(false);
  let [editingName, setEditingName] = useState(false);
  let [editingStatus, setEditingStatus] = useState(false);
  let image = useRef();

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("status", status);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.put(`${server}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setSaving(false);
      dispatch(setuserData(result.data));
      navigate("/");
      setEditingName(false);
      setEditingStatus(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(userData?.fullName || "");
    setStatus(userData?.status || "");
    setEditingName(false);
    setEditingStatus(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-[#20c7ff] cursor-pointer"
        >
          <IoIosArrowRoundBack className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#20c7ff] via-[#40d4ff] to-[#20c7ff] relative">
          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>

        <div className="relative px-6 sm:px-8 pb-8">
          <div className="flex flex-col items-center -mt-16 sm:-mt-20">
            <div
              className="relative group cursor-pointer"
              onClick={() => image.current.click()}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={frontendImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#20c7ff] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IoCameraOutline className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Change Photo
                </span>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />
          </div>

          {/* Form Section */}
          <form onSubmit={handleProfile} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 sm:py-4 pr-12 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 text-gray-700 text-base sm:text-lg ${
                    editingName
                      ? "border-[#20c7ff] bg-white shadow-lg"
                      : "border-gray-200 focus:border-[#20c7ff] focus:bg-white"
                  }`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!editingName}
                />
                <button
                  type="button"
                  onClick={() => setEditingName(!editingName)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#20c7ff] bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-300 group"
                >
                  {editingName ? (
                    <MdCheck className="w-5 h-5 text-[#20c7ff]" />
                  ) : (
                    <MdEdit className="w-5 h-5 text-gray-400 group-hover:text-[#20c7ff]" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">
                Status
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your status"
                  className={`w-full px-4 py-3 sm:py-4 pr-12 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 text-gray-700 text-base sm:text-lg ${
                    editingStatus
                      ? "border-[#20c7ff] bg-white shadow-lg"
                      : "border-gray-200 focus:border-[#20c7ff] focus:bg-white"
                  }`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!editingStatus}
                />
                <button
                  type="button"
                  onClick={() => setEditingStatus(!editingStatus)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#20c7ff] bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-300 group"
                >
                  {editingStatus ? (
                    <MdCheck className="w-5 h-5 text-[#20c7ff]" />
                  ) : (
                    <MdEdit className="w-5 h-5 text-gray-400 group-hover:text-[#20c7ff]" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none text-gray-500 text-base sm:text-lg cursor-not-allowed"
                  value={userData?.username || ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none text-gray-500 text-base sm:text-lg cursor-not-allowed"
                  value={userData?.email || ""}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {(editingName || editingStatus) && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <MdClose className="w-5 h-5" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={
                  saving || (!editingName && !editingStatus && !backendImage)
                }
                className={`flex-1 px-6 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-md hover:shadow-xl ${
                  saving || (!editingName && !editingStatus && !backendImage)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#20c7ff] to-[#40d4ff] text-white hover:from-[#1ab8f0] hover:to-[#30c4f0]"
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    Saving...
                  </span>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
