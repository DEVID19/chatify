import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";

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

const ReceiverMessage = ({ image, message, groupSenderImage }) => {
  const { selectedUser } = useSelector((state) => state.user);
  const name = selectedUser?.fullName || selectedUser?.username || "";
  const avatarSrc = groupSenderImage || selectedUser?.image || null;

  return (
    <div className="flex items-end gap-2 msg-enter">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
        style={{
          background: avatarSrc ? undefined : getAvatarColor(name),
          border: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        {avatarSrc
          ? <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
          : getInitials(name)
        }
      </div>

      {/* Bubble */}
      <div
        className="max-w-[65%] px-4 py-2.5 rounded-2xl rounded-bl-sm flex flex-col gap-2 text-[14px] leading-relaxed"
        style={{
          background: "var(--color-elevated)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        {image && <img src={image} alt="" className="max-w-[220px] rounded-xl" />}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
