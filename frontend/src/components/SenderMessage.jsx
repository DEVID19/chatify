import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { MdDelete } from "react-icons/md";

const SenderMessage = ({ image, message, messageId, onDelete }) => {
  const { userData } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    const menuWidth = 160;
    const menuHeight = 96;
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX;
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY;
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Context menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-[999] rounded-xl py-1.5 min-w-[160px] overflow-hidden"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
            background: "var(--color-elevated)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            className="px-4 py-1 mb-1"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Options
            </span>
          </div>
          <button
            onClick={() => { onDelete(messageId); setShowMenu(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors"
            style={{ color: "var(--color-danger)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <MdDelete className="w-4 h-4" />
            Delete Message
          </button>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-overlay)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Message row */}
      <div
        className="flex items-end gap-2 justify-end msg-enter"
        onContextMenu={handleRightClick}
      >
        {/* Bubble */}
        <div
          className="max-w-[65%] px-4 py-2.5 rounded-2xl rounded-br-sm flex flex-col gap-2 text-[14px] leading-relaxed text-white"
          style={{
            background: "var(--color-accent)",
            boxShadow: "0 2px 8px rgba(91,95,239,0.25)",
          }}
        >
          {image && <img src={image} alt="" className="max-w-[220px] rounded-xl" />}
          {message && <span>{message}</span>}
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <img src={userData?.image || dp} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  );
};

export default SenderMessage;
