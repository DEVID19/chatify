import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { server } from "../main";
import { setMessages } from "../redux/messageSlice";

const MessageArea = () => {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let { messages } = useSelector((state) => state.messages);
  let dispatch = useDispatch();
  let [showEmojiPicker, setShowEmojiPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);
  let image = useRef();
  const messagesRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.post(
        `${server}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMessages([...messages, result.data]));
      setFrontendImage(null);
      setBackendImage(null);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });

    return () => socket.off("newMessage");
  }, [messages, setMessages]);

  // to scroll onmessage appear
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={`lg:w-[70%] w-full h-full bg-slate-200 border-l-2 border-gray-300 overflow-hidden 
        ${selectedUser ? "flex" : "hidden"} lg:flex  relative`}
    >
      {selectedUser ? (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg shadow-gray-400 flex items-center px-[20px]  gap-[20px] ">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white">
              <img
                src={selectedUser?.image || dp}
                alt=""
                className="h-[100%]"
              />
            </div>
            <h1 className="text-white  font-semibold text-[20px]">
              {selectedUser?.fullname || selectedUser?.username}
            </h1>
          </div>

          {/* emoji picker code below  */}

          <div
            className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-5 "
            ref={messagesRef}
          >
            {showEmojiPicker && (
              <div className="absolute bottom-[120px] left-[20px] ">
                <EmojiPicker
                  width={250}
                  height={350}
                  className="shadow-lg z-[100]"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages &&
              messages.map((messages) =>
                messages.sender == userData._id ? (
                  <SenderMessage
                    image={messages.image}
                    message={messages.message}
                  />
                ) : (
                  <ReceiverMessage
                    image={messages.image}
                    message={messages.message}
                  />
                ),
              )}

            {/* <SenderMessage />
            <ReceiverMessage /> */}
          </div>

          {/* form div  below  */}
          <div className="w-full  h-[100px] lg:w-[98%]  flex items-center justify-center ">
            <img
              src={frontendImage}
              alt=""
              className="w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-lg shadow-gray-400 "
            />

            <form
              className="w-[95%] lg:w-[70%] h-[60px] bg-[#1797c2] rounded-full shadow-lg shadow-gray-400   flex items-center gap-[20px] px-[20px]"
              onSubmit={handleSendMessage}
            >
              <div
                className=""
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <RiEmojiStickerLine className="w-[25px] h-[25px] text-white  cursor-pointer" />
              </div>
              {/* image input */}

              <input
                type="file"
                accept="image/*"
                hidden
                ref={image}
                onChange={handleImage}
              />

              <input
                type="text"
                placeholder="Message ..."
                className="h-full w-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <div onClick={() => image.current.click()}>
                <FaImages className="w-[25px] h-[25px] text-white cursor-pointer " />
              </div>
              {(input.length > 0 || backendImage != null) && (
                <button type="submit">
                  <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer" />
                </button>
              )}
            </form>
          </div>
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
    </div>
  );
};

export default MessageArea;
