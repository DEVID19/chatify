import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { MdDelete } from "react-icons/md";

const SenderMessage = ({ image, message, messageId, onDelete }) => {
  const { userData } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // ✅ position menu where user right clicked
  const menuRef = useRef(null);

const handleRightClick = (e) => {
  e.preventDefault();
  
  const menuWidth = 160; // min-w-[160px]
  const menuHeight = 120; // approximate height
  
  // ✅ if menu would go off right edge, shift it left
  const x = e.clientX + menuWidth > window.innerWidth 
    ? e.clientX - menuWidth 
    : e.clientX;
  
  // ✅ if menu would go off bottom edge, shift it up
  const y = e.clientY + menuHeight > window.innerHeight 
    ? e.clientY - menuHeight 
    : e.clientY;

  setMenuPosition({ x, y });
  setShowMenu(true);
};

  // ✅ close menu when user clicks anywhere else
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ── Context Menu Popup ───────────────────────────────── */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-[999] bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[160px] overflow-hidden"
          style={{ top: menuPosition.y, left: menuPosition.x }} // ✅ appears exactly at cursor
        >
          {/* Header */}
          <div className="px-4 py-1 border-b border-gray-100 mb-1">
            <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide">
              Message Options
            </span>
          </div>

          {/* Delete option */}
          <button
            onClick={() => {
              onDelete(messageId);
              setShowMenu(false); // ✅ close after delete
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors text-[14px] font-medium"
          >
            <MdDelete className="w-[18px] h-[18px]" />
            Delete Message
          </button>

          {/* Cancel option */}
          <button
            onClick={() => setShowMenu(false)}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-[14px] font-medium"
          >
            ✕ Cancel
          </button>
        </div>
      )}

      {/* ── Message Row ─────────────────────────────────────── */}
      <div
        className="flex items-start gap-[10px]"
        onContextMenu={handleRightClick} // ✅ right click triggers menu
      >
        {/* ── Message bubble ── */}
        <div className="w-fit max-w-[500px] bg-[#1797c2] px-[20px] py-[10px] text-white rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-lg shadow-gray-400 gap-[10px] text-[19px] flex flex-col">
          {image && <img src={image} alt="" className="w-[150px] rounded-lg" />}
          {message && <span>{message}</span>}
        </div>

        {/* ── Avatar ── */}
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg shadow-gray-500">
          <img src={userData?.image || dp} alt="" className="h-[100%]" />
        </div>
      </div>
    </>
  );
};

export default SenderMessage;
