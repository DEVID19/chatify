import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../main";
import dp from "../assets/dp.png";
import { RxCross2 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { FaCamera } from "react-icons/fa";

const MAX_MEMBERS = 19; // 19 + admin = 20 total

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const { otherUsers } = useSelector((state) => state.user);

  const [groupName, setGroupName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Only show non-self users as selectable
  const selectableUsers = otherUsers?.filter((u) => !u.isSelf) || [];

  // Filter by search input
  const filteredUsers = selectableUsers.filter((user) => {
    const name = (user.fullName || user.username || "").toLowerCase();
    return name.includes(searchInput.toLowerCase());
  });

  const isLimitReached = selectedMembers.length >= MAX_MEMBERS;

  const toggleMember = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      // Block adding more if limit reached
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
    // Dark backdrop — click outside to close
    <div
      className="fixed inset-0  bg-opacity-50 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal — stop clicks bubbling to backdrop */}
      <div
        className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full h-[60px] bg-[#1797c2] flex items-center justify-between px-5 flex-shrink-0">
          <h2 className="text-white font-bold text-[20px]">New Group</h2>
          <RxCross2
            className="w-6 h-6 text-white cursor-pointer hover:opacity-70"
            onClick={onClose}
          />
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Group image + name row */}
          <div className="flex items-center gap-4">
            {/* Image picker circle */}
            <label className="cursor-pointer relative flex-shrink-0">
              <div className="w-[65px] h-[65px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-[#19cdff]">
                {preview ? (
                  <img
                    src={preview}
                    alt="group"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaCamera className="text-gray-400 w-6 h-6" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            {/* Group name input */}
            <input
              type="text"
              placeholder="Group name..."
              className="flex-1 h-[48px] rounded-full border-2 border-gray-300 px-4 outline-none text-[16px] focus:border-[#1797c2] transition-colors"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Search bar */}
          <div className="w-full h-[45px] bg-gray-100 rounded-full flex items-center gap-2 px-4">
            <IoIosSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search users..."
              className="flex-1 bg-transparent outline-none text-[15px] text-gray-700"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Member count + limit indicator */}
          <div className="flex items-center justify-between px-1">
            <p className="text-gray-500 text-[13px]">
              {selectedMembers.length} / {MAX_MEMBERS} selected
            </p>
            {selectedMembers.length < 2 && (
              <p className="text-red-400 text-[12px]">need at least 2</p>
            )}
            {isLimitReached && (
              <p className="text-orange-400 text-[12px] font-medium">
                limit reached (20 max)
              </p>
            )}
          </div>

          {/* User list */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-[15px]">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedMembers.includes(user._id);
                const isDisabled = !isSelected && isLimitReached;

                return (
                  <div
                    key={user._id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all
                      ${
                        isSelected
                          ? "bg-[#e8f7fb] border border-[#19cdff] cursor-pointer"
                          : isDisabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    onClick={() => {
                      if (isDisabled) return;
                      toggleMember(user._id);
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={user?.image || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name */}
                    <span className="flex-1 text-gray-800 font-medium text-[16px] truncate">
                      {user.fullName || user.username}
                    </span>

                    {/* Checkbox circle */}
                    <div
                      className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${
                          isSelected
                            ? "bg-[#1797c2] border-[#1797c2]"
                            : "border-gray-300"
                        }`}
                    >
                      {isSelected && (
                        <span className="text-white text-[12px] font-bold">
                          ✓
                        </span>
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
            disabled={
              loading || selectedMembers.length < 2 || !groupName.trim()
            }
            className="w-full h-[50px] bg-[#1797c2] text-white rounded-full font-semibold text-[17px] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
