import { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import {
  setSelectedGroup,
  setGroupMessages,
  addGroupMessage,
  moveGroupToTop,
  deleteGroupMessage,
} from "../redux/groupSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import AISenderMessage from "./AISenderMessage";
import AIReceiverMessage, { TypingIndicator } from "./AIReceiverMessage";
import axios from "axios";
import { server } from "../main";
import { addMessage, setMessages, deleteMessage } from "../redux/messageSlice";
import { moveChatToTop } from "../redux/chatSlice";
import { AI_USER } from "../constants/aiUser";
import { MdDeleteSweep } from "react-icons/md";
import { useAIChat } from "../customHooks/useAiChat";

const MessageArea = () => {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.messages);
  const { selectedGroup, groupMessages } = useSelector((state) => state.group);
  const { aiMessages, isTyping } = useSelector((state) => state.ai);

  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const messagesRef = useRef(null);

  const { loadAIHistory, sendAIMessage, clearAIChat } = useAIChat();

  const isSelfChat = selectedUser?._id === userData?._id;
  const isAIChat = selectedUser?._id === AI_USER._id;

  // ── Load AI history when AI chat opens ──────────────────────
  useEffect(() => {
    if (!isAIChat) return;
    setInput("");
    setFrontendImage(null);
    setBackendImage(null);
    loadAIHistory();
  }, [isAIChat]);

  // ── Fetch group messages when group selected ─────────────────
  useEffect(() => {
    if (!selectedGroup) return;
    setInput("");
    setFrontendImage(null);
    setBackendImage(null);

    const fetchGroupMessages = async () => {
      try {
        const res = await axios.get(
          `${server}/api/group/messages/${selectedGroup._id}`,
          { withCredentials: true },
        );
        dispatch(setGroupMessages(res.data));
      } catch (err) {
        console.log("fetchGroupMessages error:", err);
        dispatch(setGroupMessages([]));
      }
    };
    fetchGroupMessages();
  }, [selectedGroup]);

  // ── Clear input on direct chat switch ───────────────────────
  useEffect(() => {
    if (selectedUser && !isAIChat) {
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    }
  }, [selectedUser]);

  // ── Send AI message ──────────────────────────────────────────
  const handleSendAIMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    const textToSend = input;
    const imageToSend = backendImage;

    // Clear input immediately for snappy UX
    setInput("");
    setFrontendImage(null);
    setBackendImage(null);

    try {
      await sendAIMessage({ text: textToSend, image: imageToSend });
    } catch (error) {
      console.log("handleSendAIMessage error:", error);
    }
  };

  // ── Send direct message ──────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${server}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(setMessages([...messages, result.data]));
      dispatch(
        moveChatToTop({ userId: selectedUser._id, incrementUnread: false }),
      );
      setFrontendImage(null);
      setBackendImage(null);
      setInput("");
    } catch (error) {
      console.log("handleSendMessage error:", error);
    }
  };

  // ── Send group message ───────────────────────────────────────
  const handleSendGroupMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${server}/api/group/send/${selectedGroup._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(addGroupMessage(res.data));
      dispatch(
        moveGroupToTop({ groupId: selectedGroup._id, incrementUnread: false }),
      );
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (err) {
      console.log("handleSendGroupMessage error:", err);
    }
  };

  // ── Delete direct message ────────────────────────────────────
  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${server}/api/message/delete/${messageId}`, {
        withCredentials: true,
      });
      dispatch(deleteMessage(messageId));
    } catch (error) {
      console.log("handleDeleteMessage error:", error);
    }
  };

  // ── Delete group message ─────────────────────────────────────
  const handleDeleteGroupMessage = async (messageId) => {
    try {
      await axios.delete(`${server}/api/group/delete/${messageId}`, {
        withCredentials: true,
      });
      dispatch(deleteGroupMessage(messageId));
    } catch (error) {
      console.log("handleDeleteGroupMessage error:", error);
    }
  };

  // ── Socket — direct messages ─────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      dispatch(addMessage(mess));
      const iAmTheSender = mess.sender === userData._id;
      const chatUserId = iAmTheSender ? mess.receiver : mess.sender;
      dispatch(
        moveChatToTop({ userId: chatUserId, incrementUnread: !iAmTheSender }),
      );
    };

    const handleMessageDeleted = (messageId) => {
      dispatch(deleteMessage(messageId));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, userData._id, dispatch]);

  // ── Socket — group messages ──────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewGroupMessage = (mess) => {
      dispatch(addGroupMessage(mess.message || mess));
      const iAmTheSender =
        mess.sender?._id === userData._id || mess.sender === userData._id;
      dispatch(
        moveGroupToTop({
          groupId: mess.groupId,
          incrementUnread: !iAmTheSender,
        }),
      );
    };

    const handleGroupMessageDeleted = ({ messageId }) => {
      dispatch(deleteGroupMessage(messageId));
    };

    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("groupMessageDeleted", handleGroupMessageDeleted);

    return () => {
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("groupMessageDeleted", handleGroupMessageDeleted);
    };
  }, [socket, userData._id, dispatch]);

  // ── Auto scroll to latest message ───────────────────────────
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, groupMessages, aiMessages, isTyping]);

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // ── Shared input bar (used by all chat types) ────────────────
  const renderInputForm = (onSubmit, placeholder) => (
    <div className="w-full h-[100px] flex items-center justify-center flex-shrink-0">
      {frontendImage && (
        <img
          src={frontendImage}
          alt="preview"
          className="w-[70px] absolute bottom-[105px] right-[20%] rounded-lg shadow-lg shadow-gray-400"
        />
      )}
      <form
        className="w-[95%] lg:w-[70%] h-[60px] bg-[#1797c2] rounded-full shadow-lg shadow-gray-400 flex items-center gap-[15px] px-[20px]"
        onSubmit={onSubmit}
      >
        <div onClick={() => setShowEmojiPicker((p) => !p)}>
          <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={image}
          onChange={handleImage}
        />
        <input
          type="text"
          placeholder={placeholder}
          className="h-full w-full outline-none border-0 text-[18px] text-white bg-transparent placeholder-white"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <div onClick={() => image.current.click()}>
          <FaImages className="w-[25px] h-[25px] text-white cursor-pointer" />
        </div>
        {(input.length > 0 || backendImage) && (
          <button type="submit">
            <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer" />
          </button>
        )}
      </form>
    </div>
  );

  return (
    <div
      className={`lg:w-[70%] w-full h-full bg-slate-200 border-l-2 border-gray-300 overflow-hidden
        ${selectedUser || selectedGroup ? "flex" : "hidden"} lg:flex relative`}
    >
      {/* ══ AI CHAT ════════════════════════════════════════════ */}
      {isAIChat && (
        <div className="w-full h-full flex flex-col">
          {/* AI Header */}
          <div className="w-full h-[100px] bg-gradient-to-r from-[#19cdff] to-[#1797c2] rounded-b-[30px] shadow-lg shadow-gray-400 flex items-center px-[20px] gap-[20px] flex-shrink-0">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>

            {/* AI avatar in header */}
            <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-[#1797c2] text-[16px] font-extrabold tracking-tight">
                AI
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-white font-bold text-[20px]">Chatify AI</h1>
              <span className="text-white text-[12px] opacity-80">
                {isTyping ? "✦ thinking..." : "Ask anything • Images • Help"}
              </span>
            </div>

            {/* Online pulse + clear button */}
            <div className="flex items-center gap-[10px] flex-shrink-0">
              <span className="w-[9px] h-[9px] rounded-full bg-green-300 animate-pulse" />
              <span className="text-white text-[12px] opacity-80">Online</span>
              <div
                onClick={clearAIChat}
                className="cursor-pointer ml-[4px]"
                title="Clear chat"
              >
                <MdDeleteSweep className="w-[26px] h-[26px] text-white opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-[120px] left-[20px] z-[100]">
              <EmojiPicker
                width={250}
                height={350}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}

          {/* AI messages list */}
          <div
            className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-4"
            ref={messagesRef}
          >
            {/* Empty state */}
            {aiMessages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60 select-none">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#19cdff] to-[#1797c2] flex items-center justify-center shadow-lg">
                  <span className="text-white text-[22px] font-extrabold">
                    AI
                  </span>
                </div>
                <h2 className="text-gray-600 font-bold text-[22px]">
                  Chatify AI
                </h2>
                <p className="text-gray-400 text-[14px] text-center max-w-[260px] leading-relaxed">
                  Ask me anything — questions, ideas, code, or send an image to
                  analyze.
                </p>
              </div>
            )}

            {/* Messages */}
            {aiMessages.map((msg) =>
              msg.sender === "USER" ? (
                <AISenderMessage
                  key={msg._id}
                  message={msg.message}
                  image={msg.image}
                />
              ) : (
                <AIReceiverMessage
                  key={msg._id}
                  message={msg.message}
                  image={msg.image}
                />
              ),
            )}

            {/* Typing dots while waiting for AI */}
            {isTyping && <TypingIndicator />}
          </div>

          {renderInputForm(handleSendAIMessage, "Ask Chatify AI anything...")}
        </div>
      )}

      {/* ══ GROUP CHAT ══════════════════════════════════════════ */}
      {selectedGroup && (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg shadow-gray-400 flex items-center px-[20px] gap-[20px] flex-shrink-0">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedGroup(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-200 shadow-lg flex-shrink-0">
              <img
                src={selectedGroup?.groupImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-white font-semibold text-[20px] truncate">
                {selectedGroup.groupName}
              </h1>
              <span className="text-white text-[12px] opacity-80">
                {selectedGroup.participants.length} members
              </span>
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-[120px] left-[20px] z-[100]">
              <EmojiPicker
                width={250}
                height={350}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}

          <div
            className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-4"
            ref={messagesRef}
          >
            {groupMessages.map((msg, index) => {
              const isMyMessage =
                msg.sender?._id === userData._id || msg.sender === userData._id;

              return isMyMessage ? (
                <SenderMessage
                  key={msg._id || index}
                  image={msg.image}
                  message={msg.message}
                  messageId={msg._id}
                  onDelete={handleDeleteGroupMessage}
                />
              ) : (
                <div key={index} className="flex flex-col gap-[3px]">
                  <span className="text-[12px] text-[#1797c2] font-semibold ml-3">
                    {msg.sender?.fullName || msg.sender?.username}
                  </span>
                  <ReceiverMessage
                    image={msg?.image}
                    groupSenderImage={msg.sender?.image}
                    message={msg.message}
                  />
                </div>
              );
            })}
          </div>

          {renderInputForm(handleSendGroupMessage, "Message group...")}
        </div>
      )}

      {/* ══ DIRECT CHAT ═════════════════════════════════════════ */}
      {selectedUser && !selectedGroup && !isAIChat && (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg shadow-gray-400 flex items-center px-[20px] gap-[20px] flex-shrink-0">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden shadow-gray-500 shadow-lg bg-white flex-shrink-0 flex items-center justify-center">
              <img
                src={selectedUser?.image || dp}
                alt=""
                className="h-[100%]"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-white font-semibold text-[20px] truncate">
                {isSelfChat
                  ? "You"
                  : selectedUser?.fullName || selectedUser?.username}
              </h1>
              {isSelfChat && (
                <span className="text-white text-[12px] opacity-80">
                  Notes • Reminders • Ideas
                </span>
              )}
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-[120px] left-[20px] z-[100]">
              <EmojiPicker
                width={250}
                height={350}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}

          <div
            className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-4"
            ref={messagesRef}
          >
            {messages &&
              messages.map((msg, index) =>
                isSelfChat || msg.sender === userData._id ? (
                  <SenderMessage
                    key={msg._id || index}
                    image={msg.image}
                    message={msg.message}
                    messageId={msg._id}
                    onDelete={handleDeleteMessage}
                  />
                ) : (
                  <ReceiverMessage
                    key={msg._id || index}
                    image={msg.image}
                    message={msg.message}
                  />
                ),
              )}
          </div>

          {renderInputForm(
            handleSendMessage,
            isSelfChat ? "Write a note..." : "Message...",
          )}
        </div>
      )}

      {/* ══ WELCOME SCREEN ══════════════════════════════════════ */}
      {!selectedUser && !selectedGroup && (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-gray-700 font-bold text-[35px] sm:text-[50px] text-center">
            Welcome to Chatify 👋
          </h1>
          <span className="text-gray-700 font-semibold text-[20px] sm:text-[30px]">
            Chat Friendly ....
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
