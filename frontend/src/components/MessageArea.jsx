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
import { useAIChat } from "../customHooks/useAIChat.js";

// ── Shared avatar component ──────────────────────────────────
const AVATAR_COLORS = [
  "#5B5FEF", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
];
function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function getInitials(str = "") {
  const parts = str.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : str.slice(0, 2).toUpperCase();
}

const HeaderAvatar = ({ src, name = "", size = 40 }) => {
  const color = getAvatarColor(name);
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white text-sm"
      style={{ width: size, height: size, background: src ? undefined : color }}
    >
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : getInitials(name)
      }
    </div>
  );
};

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

  // ── Load AI history ──────────────────────────────────────
  useEffect(() => {
    if (!isAIChat) return;
    setInput("");
    setFrontendImage(null);
    setBackendImage(null);
    loadAIHistory();
  }, [isAIChat]);

  // ── Fetch group messages ─────────────────────────────────
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

  // ── Clear input on direct chat switch ───────────────────
  useEffect(() => {
    if (selectedUser && !isAIChat) {
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    }
  }, [selectedUser]);

  // ── Send handlers (logic unchanged) ─────────────────────
  const handleSendAIMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;
    const textToSend = input;
    const imageToSend = backendImage;
    setInput("");
    setFrontendImage(null);
    setBackendImage(null);
    try {
      await sendAIMessage({ text: textToSend, image: imageToSend });
    } catch (error) {
      console.log("handleSendAIMessage error:", error);
    }
  };

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
      dispatch(moveChatToTop({ userId: selectedUser._id, incrementUnread: false }));
      setFrontendImage(null);
      setBackendImage(null);
      setInput("");
    } catch (error) {
      console.log("handleSendMessage error:", error);
    }
  };

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
      dispatch(moveGroupToTop({ groupId: selectedGroup._id, incrementUnread: false }));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (err) {
      console.log("handleSendGroupMessage error:", err);
    }
  };

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

  // ── Socket — direct messages ─────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (mess) => {
      const iAmTheSender = mess.sender === userData._id;
      const chatUserId = iAmTheSender ? mess.receiver : mess.sender;

      // Only add message to screen if this chat is currently open
      if (selectedUser?._id === chatUserId) {
        dispatch(addMessage(mess));
      }

      // Always update sidebar order & unread badge
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
  }, [socket, userData._id, selectedUser, dispatch]);

  // ── Socket — group messages ──────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleNewGroupMessage = (mess) => {
      dispatch(addGroupMessage(mess.message || mess));
      const iAmTheSender =
        mess.sender?._id === userData._id || mess.sender === userData._id;
      dispatch(moveGroupToTop({ groupId: mess.groupId, incrementUnread: !iAmTheSender }));
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

  // ── Auto scroll ──────────────────────────────────────────
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

  // ── Chat header shared styles ────────────────────────────
  const ChatHeader = ({ onBack, avatar, name, subtitle, rightEl }) => (
    <div
      className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <button
        onClick={onBack}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all lg:hidden"
        style={{ color: "var(--color-text-secondary)" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--color-elevated)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <IoIosArrowRoundBack className="w-6 h-6" />
      </button>
      {avatar}
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-semibold leading-tight truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name}
        </p>
        {subtitle && (
          <p
            className="text-xs truncate"
            style={{ color: "var(--color-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {rightEl}
    </div>
  );

  // ── Shared input bar ─────────────────────────────────────
  const renderInputForm = (onSubmit, placeholder) => (
    <div
      className="flex-shrink-0 px-4 py-3"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      {frontendImage && (
        <div className="mb-2 relative inline-block">
          <img
            src={frontendImage}
            alt="preview"
            className="w-16 h-16 rounded-lg object-cover"
            style={{ border: "1px solid var(--color-border)" }}
          />
          <button
            onClick={() => { setFrontendImage(null); setBackendImage(null); }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
            style={{ background: "var(--color-danger)", color: "#fff" }}
          >
            ×
          </button>
        </div>
      )}
      <form
        className="flex items-center gap-2"
        onSubmit={onSubmit}
      >
        <div
          className="input-container flex-1 flex items-center gap-2 px-4 h-11 rounded-full"
          style={{
            background: "var(--color-elevated)",
            border: "1px solid var(--color-border)",
          }}
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            className="transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
          >
            <RiEmojiStickerLine className="w-[18px] h-[18px]" />
          </button>
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
            className="flex-1 bg-transparent text-[14px] outline-none border-0"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
            }}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            type="button"
            onClick={() => image.current.click()}
            className="transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
          >
            <FaImages className="w-[16px] h-[16px]" />
          </button>
        </div>
        {(input.length > 0 || backendImage) && (
          <button
            type="submit"
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: "var(--color-accent)",
              boxShadow: "var(--shadow-accent)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; }}
          >
            <RiSendPlane2Fill className="w-[18px] h-[18px] text-white" />
          </button>
        )}
      </form>
    </div>
  );

  return (
    <div
      className={`flex-1 h-full overflow-hidden
        ${selectedUser || selectedGroup ? "flex" : "hidden"} lg:flex relative flex-col`}
      style={{ background: "var(--color-base)" }}
    >
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[80px] left-4 z-[100]">
          <EmojiPicker
            width={280}
            height={360}
            onEmojiClick={onEmojiClick}
            theme="dark"
          />
        </div>
      )}

      {/* ══ AI CHAT ══════════════════════════════════════════ */}
      {isAIChat && (
        <div className="w-full h-full flex flex-col">
          <ChatHeader
            onBack={() => dispatch(setSelectedUser(null))}
            avatar={
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--color-accent), #818cf8)" }}
              >
                AI
              </div>
            }
            name="Chatify AI"
            subtitle={isTyping ? "✦ thinking..." : "Ask anything • Images • Help"}
            rightEl={
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--color-online)", boxShadow: "0 0 6px var(--color-online)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--color-online)" }}>Online</span>
                </div>
                <button
                  onClick={clearAIChat}
                  title="Clear chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                    e.currentTarget.style.color = "var(--color-danger)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  <MdDeleteSweep className="w-5 h-5" />
                </button>
              </div>
            }
          />
          <div
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4"
            ref={messagesRef}
          >
            {aiMessages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold"
                  style={{
                    background: "linear-gradient(135deg, var(--color-accent), #818cf8)",
                    boxShadow: "var(--shadow-accent)",
                  }}
                >
                  AI
                </div>
                <h2
                  className="font-bold text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Chatify AI
                </h2>
                <p
                  className="text-sm text-center max-w-[240px] leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Ask me anything — questions, ideas, code, or send an image to analyze.
                </p>
              </div>
            )}
            {aiMessages.map((msg) =>
              msg.sender === "USER" ? (
                <AISenderMessage key={msg._id} message={msg.message} image={msg.image} />
              ) : (
                <AIReceiverMessage key={msg._id} message={msg.message} image={msg.image} />
              ),
            )}
            {isTyping && <TypingIndicator />}
          </div>
          {renderInputForm(handleSendAIMessage, "Ask Chatify AI anything...")}
        </div>
      )}

      {/* ══ GROUP CHAT ═══════════════════════════════════════ */}
      {selectedGroup && (
        <div className="w-full h-full flex flex-col">
          <ChatHeader
            onBack={() => dispatch(setSelectedGroup(null))}
            avatar={
              <HeaderAvatar
                src={selectedGroup?.groupImage}
                name={selectedGroup.groupName || ""}
                size={36}
              />
            }
            name={selectedGroup.groupName}
            subtitle={`${selectedGroup.participants.length} members`}
          />
          <div
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3"
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
                <div key={index} className="flex flex-col gap-1">
                  <span
                    className="text-[11px] font-semibold ml-11"
                    style={{ color: "var(--color-accent)" }}
                  >
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

      {/* ══ DIRECT CHAT ══════════════════════════════════════ */}
      {selectedUser && !selectedGroup && !isAIChat && (
        <div className="w-full h-full flex flex-col">
          <ChatHeader
            onBack={() => dispatch(setSelectedUser(null))}
            avatar={
              <div className="relative flex-shrink-0">
                <HeaderAvatar
                  src={selectedUser?.image}
                  name={
                    isSelfChat
                      ? "You"
                      : selectedUser?.fullName || selectedUser?.username || ""
                  }
                  size={36}
                />
              </div>
            }
            name={
              isSelfChat
                ? "You"
                : selectedUser?.fullName || selectedUser?.username
            }
            subtitle={
              isSelfChat
                ? "Notes • Reminders • Ideas"
                : undefined
            }
          />
          <div
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3"
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

      {/* ══ WELCOME SCREEN ═══════════════════════════════════ */}
      {!selectedUser && !selectedGroup && (
        <div className="w-full h-full flex flex-col items-center justify-center px-8 select-none">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{
              background: "var(--color-accent-muted)",
              border: "1px solid rgba(91,95,239,0.2)",
            }}
          >
            <img src="/logo.svg" alt="Chatify" className="w-12 h-12 rounded-xl" />
          </div>
          <h2
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: "var(--color-text-primary)" }}
          >
            Your messages
          </h2>
          <p
            className="text-sm text-center max-w-[260px] leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Select a conversation from the sidebar to start chatting, or find someone new with Search.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
