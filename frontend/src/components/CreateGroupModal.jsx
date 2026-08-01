import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../main";
import dp from "../assets/dp.png";
import { RxCross2 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { FaCamera } from "react-icons/fa";

const MAX_MEMBERS = 19;

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const { otherUsers } = useSelector((state) => state.user);

  const [groupName, setGroupName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectableUsers = otherUsers?.filter((u) => !u.isSelf) || [];
  const filteredUsers = selectableUsers.filter((user) => {
    const name = (user.fullName || user.username || "").toLowerCase();
    return name.includes(searchInput.toLowerCase());
  });
  const isLimitReached = selectedMembers.length >= MAX_MEMBERS;

  const toggleMember = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) return prev.filter((id) => id !== userId);
      if (prev.length >= MAX_MEMBERS) return prev;
      return [...prev, userId];
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return alert("Please enter a group name");
    if (selectedMembers.length < 2) return alert("Select at least 2 members");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("groupName", groupName.trim());
      formData.append("members", JSON.stringify(selectedMembers));
      if (groupImage) formData.append("groupImage", groupImage);
      const res = await axios.post(`${server}/api/group/create`, formData, {
        withCredentials: true,
      });
      onGroupCreated(res.data);
      onClose();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl overflow-hidden flex flex-col max-h-[88vh]"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          fontFamily: "var(--font-sans)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 h-14 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h2
            className="font-bold text-base"
            style={{ color: "var(--color-text-primary)" }}
          >
            New Group
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-elevated)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <RxCross2 className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Image + name row */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer relative flex-shrink-0">
              <div
                className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: "var(--color-elevated)",
                  border: "1px dashed var(--color-border-hover)",
                }}
              >
                {preview ? (
                  <img src={preview} alt="group" className="w-full h-full object-cover" />
                ) : (
                  <FaCamera style={{ color: "var(--color-text-muted)" }} className="w-5 h-5" />
                )}
              </div>
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>

            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="chat-input flex-1 h-11 px-4"
            />
          </div>

          {/* Search */}
          <div
            className="input-container flex items-center gap-2 px-3 h-9 rounded-lg"
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
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none border-0"
              style={{ color: "var(--color-text-primary)" }}
            />
          </div>

          {/* Counter */}
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {selectedMembers.length} / {MAX_MEMBERS} selected
            </p>
            {selectedMembers.length < 2 && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                Need at least 2 members
              </p>
            )}
            {isLimitReached && (
              <p className="text-xs font-medium" style={{ color: "#F59E0B" }}>
                Limit reached (20 max)
              </p>
            )}
          </div>

          {/* User list */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[220px]">
            {filteredUsers.length === 0 ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedMembers.includes(user._id);
                const isDisabled = !isSelected && isLimitReached;
                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: isSelected ? "var(--color-accent-muted)" : "transparent",
                      border: `1px solid ${isSelected ? "rgba(91,95,239,0.25)" : "transparent"}`,
                      opacity: isDisabled ? 0.4 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                    onClick={() => { if (!isDisabled) toggleMember(user._id); }}
                    onMouseEnter={e => {
                      if (!isSelected && !isDisabled)
                        e.currentTarget.style.background = "var(--color-elevated)";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-500">
                      <img
                        src={user?.image || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className="flex-1 text-sm font-medium truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {user.fullName || user.username}
                    </span>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: isSelected ? "var(--color-accent)" : "transparent",
                        borderColor: isSelected ? "var(--color-accent)" : "var(--color-border-hover)",
                      }}
                    >
                      {isSelected && (
                        <span className="text-white text-[10px] font-bold">✓</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={loading || selectedMembers.length < 2 || !groupName.trim()}
            className="btn-accent w-full h-11 text-sm rounded-xl mt-1"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
