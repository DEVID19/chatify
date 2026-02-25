import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import axios from "axios";
import { server } from "../main";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setuserData,
} from "../redux/userSlice";
import {
  setSelectedGroup,
  setGroupMessages,
  addNewGroup,
  clearGroupUnreadCount,
} from "../redux/groupSlice";

import { useNavigate } from "react-router-dom";
import { clearUnreadCount } from "../redux/chatSlice";
import CreateGroupModal from "./CreateGroupModal";
import { AI_USER } from "../constants/aiUser";

const Sidebar = () => {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const { recentChats, unreadCounts } = useSelector((state) => state.chat);
  const { groups, selectedGroup, groupUnreadCounts } = useSelector(
    (state) => state.group,
  );

  const [searchActive, setSearchActive] = useState(false);
  const [input, setInput] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${server}/api/auth/logout`, { withCredentials: true });
      dispatch(setuserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log("handleLogout error:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${server}/api/user/search?query=${input}`,
        { withCredentials: true },
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log("handleSearch error:", error);
    }
  };

  useEffect(() => {
    if (input) handleSearch();
  }, [input]);

  // ── Separate self from other users ──────────────────────────
  const selfUser = otherUsers?.find((u) => u.isSelf);
  const nonSelfUsers = otherUsers?.filter((u) => !u.isSelf) || [];

  // ── Order direct chat users by recent activity ───────────────
  let orderedDirectUsers = [];
  if (nonSelfUsers.length > 0) {
    const recentUsers = recentChats
      .map((id) => nonSelfUsers.find((u) => u._id === id))
      .filter(Boolean);
    const remainingUsers = nonSelfUsers.filter(
      (u) => !recentChats.includes(u._id),
    );
    orderedDirectUsers = [...recentUsers, ...remainingUsers];
  }

  // ── Build unified list: direct chats + groups mixed ──────────
  // Tag each item with type so render knows how to handle it
  const directItems = orderedDirectUsers.map((u) => ({
    type: "direct",
    _id: u._id,
    data: u,
    sortKey: recentChats.includes(u._id) ? recentChats.indexOf(u._id) : 9999,
  }));

  const groupItems = groups.map((g, index) => ({
    type: "group",
    _id: g._id,
    data: g,
    sortKey: index, // already sorted by updatedAt from backend
  }));

  // Merge and sort — lower sortKey = more recent = appears first
  const unifiedList = [...directItems, ...groupItems].sort(
    (a, b) => a.sortKey - b.sortKey,
  );

  // When a group is created, add it to the list immediately
  const handleGroupCreated = (newGroup) => {
    dispatch(addNewGroup(newGroup));
  };

  // Hide sidebar on mobile when any chat is open
  const isAnyChatOpen = selectedUser || selectedGroup;

  return (
    <div
      className={`lg:w-[30%] w-full h-full bg-slate-200 lg:block relative
        ${!isAnyChatOpen ? "block" : "hidden"}`}
    >
      {/* ── Bottom left action buttons ─────────────────────── */}
      <div className="fixed bottom-[20px] left-[20px] flex items-center gap-3 z-50">
        {/* Logout */}
        <div
          className="w-14 h-14 rounded-full shadow-lg bg-[#19cdff] shadow-gray-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onClick={handleLogout}
        >
          <RiLogoutCircleLine className="w-7 h-7 text-white" />
        </div>

        {/* Create Group */}
        <div
          className="w-14 h-14 rounded-full shadow-lg bg-[#1797c2] shadow-gray-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setShowCreateGroup(true)}
          title="Create Group"
        >
          <MdGroupAdd className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* ── Search result dropdown ──────────────────────────── */}
      {input.length > 0 && (
        <div className="flex w-full bg-white h-[500px] overflow-y-auto flex-col items-center pt-[20px] gap-[10px] absolute top-[250px] z-[150] shadow-lg">
          {searchData?.map((user) => (
            <div
              key={user._id}
              className="w-[95%] h-[70px] flex items-center gap-[20px] bg-white border-b-2 border-gray-400 px-[20px] cursor-pointer hover:bg-[#63c2dc]"
              onClick={() => {
                dispatch(setSelectedUser(user));
                dispatch(setSelectedGroup(null)); // close any open group
                setInput("");
                setSearchActive(false);
              }}
            >
              <div className="relative rounded-full shadow-lg bg-white flex items-center justify-center">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                  <img src={user?.image || dp} alt="" className="h-[100%]" />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md" />
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[20px]">
                {user.fullName || user.username}
              </h1>
            </div>
          ))}
        </div>
      )}

      {/* ── Top header ─────────────────────────────────────── */}
      <div className="w-full h-[300px] bg-[#19cdff] rounded-b-[30%] shadow-lg shadow-gray-400 flex flex-col justify-center px-[20px]">
        <h1 className="text-white font-bold text-[25px]">Chatify</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-800 font-bold text-[22px] sm:text-[25px]">
            Hii, {userData?.fullName || "User"}
          </h1>
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white shadow-gray-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Online users strip */}
        <div className="w-full flex items-center gap-[15px] overflow-x-auto py-[10px]">
          {!searchActive && (
            <div
              className="w-14 h-14 rounded-full border-2 mt-[10px] border-white shadow-lg bg-white shadow-gray-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
              onClick={() => setSearchActive(true)}
            >
              <IoIosSearch className="w-7 h-7" />
            </div>
          )}
          {searchActive && (
            <form className="w-full h-[55px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px]">
              <IoIosSearch className="w-[22px] h-[22px] text-gray-700" />
              <input
                type="text"
                placeholder="Search User..."
                className="w-full h-full p-[10px] text-[16px] outline-none border-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2
                className="w-[22px] h-[22px] text-gray-700 cursor-pointer"
                onClick={() => {
                  setSearchActive(false);
                  setInput("");
                }}
              />
            </form>
          )}

          {/* Online user avatar bubbles — direct chat users only */}
          {!searchActive &&
            nonSelfUsers.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    key={user._id}
                    className="relative rounded-full shadow-gray-500 shadow-lg bg-white flex items-center justify-center mt-[10px] cursor-pointer flex-shrink-0 hover:scale-110 transition-transform"
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                      dispatch(setSelectedGroup(null));
                    }}
                  >
                    <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center">
                      <img
                        src={user?.image || dp}
                        alt=""
                        className="h-[100%]"
                      />
                    </div>
                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[4px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md" />
                  </div>
                ),
            )}
        </div>
      </div>

      {/* ── Unified chat list ───────────────────────────────── */}
      <div className="w-full h-[50%] lg:h-[45%] overflow-auto flex flex-col gap-[15px] mt-[20px] items-center pb-[90px]">
        {/* ── Chatify AI chat (pinned) ───────────────────────── */}
        <div
          className={`w-[95%] h-[65px] flex items-center gap-[15px]
    bg-white shadow-lg shadow-gray-400 rounded-full cursor-pointer
    hover:bg-[#e6f7ff] transition-colors
    ${selectedUser?._id === AI_USER._id ? "ring-2 ring-[#19cdff]" : ""}`}
          onClick={() => {
            dispatch(setSelectedUser(AI_USER));
            dispatch(setSelectedGroup(null));
            dispatch(setGroupMessages([]));
          }}
        >
          <div className="relative rounded-full shadow-gray-400 shadow-lg bg-white flex-shrink-0">
            <div className="w-[65px] h-[65px] rounded-full overflow-hidden flex justify-center items-center bg-[#19cdff]">
              <span className="text-white text-[22px] font-bold">AI</span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-gray-800 font-semibold text-[18px]">
              Chatify AI
            </h1>
            <span className="text-gray-500 text-[12px] truncate">
              Ask anything • Images • Help
            </span>
          </div>
        </div>

        {/* Self chat — always pinned at very top */}
        {selfUser && (
          <div
            className="w-[95%] h-[65px] flex items-center gap-[15px] bg-gradient-to-r from-[#19cdff] to-[#1797c2] shadow-lg shadow-gray-400 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              dispatch(setSelectedUser(selfUser));
              dispatch(setSelectedGroup(null));
              dispatch(clearUnreadCount(selfUser._id));
            }}
          >
            <div className="relative rounded-full shadow-gray-400 shadow-lg bg-white flex-shrink-0">
              <div className="w-[65px] h-[65px] rounded-full overflow-hidden flex justify-center items-center">
                <img src={selfUser?.image || dp} alt="" className="h-[100%]" />
              </div>
              <span className="w-[16px] h-[16px] rounded-full absolute bottom-[3px] right-[-2px] bg-yellow-400 shadow-md flex items-center justify-center text-[8px]">
                ✦
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-white font-semibold text-[18px]">You</h1>
              <span className="text-white text-[11px] opacity-80 truncate">
                Notes • Reminders • Ideas
              </span>
            </div>
          </div>
        )}

        {/* Direct chats + groups mixed, ordered by recent activity */}
        {unifiedList.map((item) => {
          // ── Direct chat card ────────────────────────────
          if (item.type === "direct") {
            const user = item.data;
            return (
              <div
                key={`direct-${user._id}`}
                className="w-[95%] h-[65px] flex items-center gap-[15px] bg-white shadow-lg shadow-gray-400 rounded-full cursor-pointer hover:bg-[#63c2dc] transition-colors"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(setSelectedGroup(null));
                  dispatch(clearUnreadCount(user._id));
                }}
              >
                <div className="relative rounded-full shadow-gray-400 shadow-lg bg-white flex-shrink-0">
                  <div className="w-[65px] h-[65px] rounded-full overflow-hidden flex justify-center items-center">
                    <img src={user?.image || dp} alt="" className="h-[100%]" />
                  </div>
                  {onlineUsers?.includes(user._id) && (
                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[4px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md" />
                  )}
                </div>
                <h1 className="text-gray-800 font-semibold text-[18px] flex-1 truncate">
                  {user.fullName || user.username}
                </h1>
                {/* Unread badge */}
                {unreadCounts?.[user._id] > 0 && (
                  <span className="mr-3 bg-[#1797c2] text-white text-[12px] font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center px-1 flex-shrink-0">
                    {unreadCounts[user._id]}
                  </span>
                )}
              </div>
            );
          }

          // ── Group chat card ─────────────────────────────
          if (item.type === "group") {
            const group = item.data;
            return (
              <div
                key={`group-${group._id}`}
                className="w-[95%] h-[65px] flex items-center gap-[15px] bg-white shadow-lg shadow-gray-400 rounded-full cursor-pointer hover:bg-[#63c2dc] transition-colors"
                onClick={() => {
                  dispatch(setSelectedGroup(group));
                  dispatch(setSelectedUser(null));
                  dispatch(setGroupMessages([]));
                  dispatch(clearGroupUnreadCount(group._id));
                }}
              >
                <div className="relative rounded-full shadow-gray-400 shadow-lg bg-white flex-shrink-0">
                  <div className="w-[65px] h-[65px] rounded-full overflow-hidden flex justify-center items-center bg-gray-100">
                    <img
                      src={group?.groupImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Group badge — small blue circle with group icon */}
                  <span className="w-[18px] h-[18px] rounded-full absolute bottom-[3px] right-[-2px] bg-[#1797c2] shadow-md flex items-center justify-center">
                    <MdGroupAdd className="w-[11px] h-[11px] text-white" />
                  </span>
                </div>

                <div className="flex flex-row flex-1 min-w-0">
                  {/* first div of name of group and member  */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <h1 className="text-gray-800 font-semibold text-[18px] truncate">
                      {group.groupName}
                    </h1>
                    <span className="text-gray-500 text-[12px]">
                      {group.participants.length} members
                    </span>
                  </div>
                  {/* second dive for unread count  */}
                  <div className="flex  justify-end items-center">
                    {groupUnreadCounts?.[group._id] > 0 && (
                      <span className="mr-3 bg-[#1797c2] text-white text-[12px] font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center px-1 flex-shrink-0">
                        {groupUnreadCounts[group._id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default Sidebar;
