import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine, RiChat3Fill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import { HiSun, HiMoon } from "react-icons/hi2";
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
import { useTheme } from "../customHooks/useTheme";

// ── Deterministic avatar color from username ─────────────────
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

// ── Avatar — shows image or colorful initials ────────────────
const Avatar = ({ src, name = "", size = 44, ring = false, online = false }) => {
  const color = getAvatarColor(name);
  const initials = getInitials(name || "?");
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full overflow-hidden"
        style={{
          border: ring ? `2px solid ${color}40` : "1px solid var(--color-border)",
          boxShadow: ring ? `0 0 0 2px var(--color-surface)` : undefined,
        }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="avatar-initials w-full h-full"
            style={{ background: color, fontSize: size * 0.31 + "px" }}
          >
            {initials}
          </div>
        )}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
          style={{
            background: "var(--color-online)",
            borderColor: "var(--color-surface)",
          }}
        />
      )}
    </div>
  );
};

const Sidebar = () => {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const { recentChats, unreadCounts } = useSelector((state) => state.chat);
  const { groups, selectedGroup, groupUnreadCounts } = useSelector(
    (state) => state.group,
  );

  const [input, setInput] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const selfUser = otherUsers?.find((u) => u.isSelf);
  const nonSelfUsers = otherUsers?.filter((u) => !u.isSelf) || [];

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
    sortKey: index,
  }));

  const unifiedList = [...directItems, ...groupItems].sort(
    (a, b) => a.sortKey - b.sortKey,
  );

  const handleGroupCreated = (newGroup) => {
    dispatch(addNewGroup(newGroup));
  };

  const isAnyChatOpen = selectedUser || selectedGroup;

  // ── Filtered display list (search or full) ────────────────
  const isSearching = input.length > 0;
  const displayList = isSearching ? searchData || [] : null;

  return (
    <div
      className={`lg:w-[320px] w-full h-full flex flex-col relative
        ${!isAnyChatOpen ? "flex" : "hidden"} lg:flex`}
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 pt-5 pb-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {/* Brand row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Chatify"
              className="w-8 h-8 rounded-lg"
              style={{ border: "1px solid var(--color-border)" }}
            />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
            >
              Chatify
            </span>
          </div>

          {/* Toolbar icons */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--color-elevated)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              {theme === "dark"
                ? <HiSun className="w-4.5 h-4.5" />
                : <HiMoon className="w-4.5 h-4.5" />}
            </button>

            {/* Create Group */}
            <button
              onClick={() => setShowCreateGroup(true)}
              title="New Group"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--color-elevated)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <MdGroupAdd className="w-[18px] h-[18px]" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                e.currentTarget.style.color = "var(--color-danger)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <RiLogoutCircleLine className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* User greeting row */}
        <div
          className="flex items-center gap-3 mb-4 p-2.5 rounded-xl cursor-pointer transition-all"
          onClick={() => navigate("/profile")}
          style={{ border: "1px solid transparent" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--color-elevated)";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <Avatar
            src={userData?.image}
            name={userData?.fullName || userData?.username || ""}
            size={38}
            ring
          />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {userData?.fullName || userData?.username || "You"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--color-text-muted)" }}
            >
              {userData?.status || "Edit profile"}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="input-container flex items-center gap-2.5 px-3 h-9 rounded-lg"
          style={{
            background: "var(--color-elevated)",
            border: "1px solid var(--color-border)",
          }}
        >
          <IoIosSearch
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none border-0"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
            }}
          />
          {input && (
            <RxCross2
              className="w-3.5 h-3.5 cursor-pointer flex-shrink-0"
              style={{ color: "var(--color-text-muted)" }}
              onClick={() => {
                setInput("");
                dispatch(setSearchData([]));
              }}
            />
          )}
        </div>
      </div>

      {/* ── Online users strip ─────────────────────────────── */}
      {!isSearching && (
        <div
          className="flex-shrink-0 px-4 py-3 overflow-x-auto flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {nonSelfUsers
            .filter((u) => onlineUsers?.includes(u._id))
            .map((user) => (
              <div
                key={user._id}
                className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(setSelectedGroup(null));
                }}
              >
                <Avatar
                  src={user?.image}
                  name={user.fullName || user.username || ""}
                  size={36}
                  online
                />
                <span
                  className="text-[10px] font-medium truncate max-w-[40px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {(user.fullName || user.username || "").split(" ")[0]}
                </span>
              </div>
            ))}
          {nonSelfUsers.filter((u) => onlineUsers?.includes(u._id)).length === 0 && (
            <span
              className="text-xs py-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              No one online right now
            </span>
          )}
        </div>
      )}

      {/* ── Chat List ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">

        {/* Search results */}
        {isSearching && (
          <>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider px-3 py-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Search Results
            </p>
            {(displayList || []).map((user) => (
              <div
                key={user._id}
                className="chat-row"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(setSelectedGroup(null));
                  setInput("");
                  dispatch(setSearchData([]));
                }}
              >
                <Avatar
                  src={user?.image}
                  name={user.fullName || user.username || ""}
                  size={42}
                  online={onlineUsers?.includes(user._id)}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {user.fullName || user.username}
                  </p>
                </div>
              </div>
            ))}
            {displayList?.length === 0 && (
              <p
                className="text-sm text-center py-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                No users found
              </p>
            )}
          </>
        )}

        {/* Normal chat list */}
        {!isSearching && (
          <>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider px-3 py-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Messages
            </p>

            {/* Chatify AI — pinned */}
            <div
              className={`chat-row ${selectedUser?._id === AI_USER._id ? "active" : ""}`}
              onClick={() => {
                dispatch(setSelectedUser(AI_USER));
                dispatch(setSelectedGroup(null));
                dispatch(setGroupMessages([]));
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-sm text-white"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), #818cf8)",
                  border: "1px solid var(--color-border)",
                }}
              >
                AI
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Chatify AI
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Ask anything • Images • Help
                </p>
              </div>
            </div>

            {/* Self chat */}
            {selfUser && (
              <div
                className={`chat-row ${selectedUser?._id === selfUser._id ? "active" : ""}`}
                onClick={() => {
                  dispatch(setSelectedUser(selfUser));
                  dispatch(setSelectedGroup(null));
                  dispatch(clearUnreadCount(selfUser._id));
                }}
              >
                <Avatar
                  src={selfUser?.image}
                  name={selfUser.fullName || selfUser.username || ""}
                  size={42}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    You
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Notes • Reminders • Ideas
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-accent-muted)",
                    color: "var(--color-accent)",
                  }}
                >
                  YOU
                </span>
              </div>
            )}

            {/* Direct + Group list */}
            {unifiedList.map((item) => {
              if (item.type === "direct") {
                const user = item.data;
                const isActive = selectedUser?._id === user._id;
                const count = unreadCounts?.[user._id];
                return (
                  <div
                    key={`direct-${user._id}`}
                    className={`chat-row ${isActive ? "active" : ""}`}
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                      dispatch(setSelectedGroup(null));
                      dispatch(clearUnreadCount(user._id));
                    }}
                  >
                    <Avatar
                      src={user?.image}
                      name={user.fullName || user.username || ""}
                      size={42}
                      online={onlineUsers?.includes(user._id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {user.fullName || user.username}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {onlineUsers?.includes(user._id) ? "Online" : "Tap to chat"}
                      </p>
                    </div>
                    {count > 0 && (
                      <span
                        className="text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "var(--color-accent)",
                          color: "#fff",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                );
              }

              if (item.type === "group") {
                const group = item.data;
                const isActive = selectedGroup?._id === group._id;
                const count = groupUnreadCounts?.[group._id];
                return (
                  <div
                    key={`group-${group._id}`}
                    className={`chat-row ${isActive ? "active" : ""}`}
                    onClick={() => {
                      dispatch(setSelectedGroup(group));
                      dispatch(setSelectedUser(null));
                      dispatch(setGroupMessages([]));
                      dispatch(clearGroupUnreadCount(group._id));
                    }}
                  >
                    <Avatar
                      src={group?.groupImage}
                      name={group.groupName || ""}
                      size={42}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {group.groupName}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {group.participants.length} members
                      </p>
                    </div>
                    {count > 0 && (
                      <span
                        className="text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "var(--color-accent)",
                          color: "#fff",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </>
        )}
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
