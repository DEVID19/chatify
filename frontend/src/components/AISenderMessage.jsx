import { useSelector } from "react-redux";
import dp from "../assets/dp.png";

// ── User's message bubble inside the AI chat ────────────────
// Same right-aligned style as regular SenderMessage
// but no delete option since AI chat history is persistent

const AISenderMessage = ({ message, image }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="flex items-end justify-end gap-[10px]">
      {/* Message bubble */}
      <div className="w-fit max-w-[70%] bg-[#1797c2] px-[18px] py-[10px] text-white rounded-2xl rounded-tr-none shadow-lg shadow-gray-400 flex flex-col gap-[8px] text-[17px]">
        {image && (
          <img
            src={image}
            alt="sent"
            className="w-[180px] rounded-xl object-cover"
          />
        )}
        {message && <span className="leading-snug">{message}</span>}
      </div>

      {/* User avatar */}
      <div className="w-[38px] h-[38px] rounded-full overflow-hidden flex-shrink-0 bg-white shadow-md shadow-gray-400 flex items-center justify-center">
        <img
          src={userData?.image || dp}
          alt="you"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AISenderMessage;
