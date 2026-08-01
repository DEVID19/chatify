import { useSelector } from "react-redux";
import dp from "../assets/dp.png";

// ── User's message bubble inside the AI chat ────────────────
const AISenderMessage = ({ message, image }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="flex items-end justify-end gap-2 msg-enter">
      {/* Bubble */}
      <div
        className="max-w-[68%] px-4 py-2.5 rounded-2xl rounded-br-sm flex flex-col gap-2 text-[14px] leading-relaxed text-white"
        style={{
          background: "var(--color-accent)",
          boxShadow: "0 2px 8px rgba(91,95,239,0.25)",
        }}
      >
        {image && <img src={image} alt="sent" className="max-w-[220px] rounded-xl object-cover" />}
        {message && <span className="leading-snug">{message}</span>}
      </div>

      {/* User avatar */}
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
        style={{ border: "1px solid var(--color-border)" }}
      >
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
