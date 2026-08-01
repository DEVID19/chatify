import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { setuserData } from "../redux/userSlice";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [status, setStatus] = useState(userData?.status || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("status", status);
      if (backendImage) formData.append("image", backendImage);
      const result = await axios.put(`${server}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setSaving(false);
      dispatch(setuserData(result.data));
      navigate("/");
      setEditingName(false);
      setEditingStatus(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(userData?.fullName || "");
    setStatus(userData?.status || "");
    setEditingName(false);
    setEditingStatus(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: "var(--color-base)", fontFamily: "var(--font-sans)" }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "var(--color-elevated)";
          e.currentTarget.style.color = "var(--color-text-primary)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "var(--color-surface)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        <IoIosArrowRoundBack className="w-6 h-6" />
      </button>

      {/* Profile card */}
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Banner */}
        <div
          className="h-28 relative"
          style={{ background: "linear-gradient(135deg, var(--color-accent), #818cf8)" }}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-14 mb-5">
            <div
              className="relative group cursor-pointer"
              onClick={() => image.current.click()}
            >
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden"
                style={{
                  border: "3px solid var(--color-surface)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <img
                  src={frontendImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <IoCameraOutline className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />

          {/* Form */}
          <form onSubmit={handleProfile} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!editingName}
                  className="w-full h-11 px-4 pr-12 rounded-lg text-sm transition-all outline-none"
                  style={{
                    background: editingName ? "var(--color-elevated)" : "var(--color-overlay)",
                    border: `1px solid ${editingName ? "var(--color-accent)" : "var(--color-border)"}`,
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-sans)",
                    boxShadow: editingName ? "0 0 0 3px var(--color-accent-muted)" : "none",
                    cursor: editingName ? "text" : "default",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setEditingName(!editingName)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    color: editingName ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >
                  {editingName ? <MdCheck className="w-4 h-4" /> : <MdEdit className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Status
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!editingStatus}
                  className="w-full h-11 px-4 pr-12 rounded-lg text-sm transition-all outline-none"
                  style={{
                    background: editingStatus ? "var(--color-elevated)" : "var(--color-overlay)",
                    border: `1px solid ${editingStatus ? "var(--color-accent)" : "var(--color-border)"}`,
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-sans)",
                    boxShadow: editingStatus ? "0 0 0 3px var(--color-accent-muted)" : "none",
                    cursor: editingStatus ? "text" : "default",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setEditingStatus(!editingStatus)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    color: editingStatus ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >
                  {editingStatus ? <MdCheck className="w-4 h-4" /> : <MdEdit className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Username (read only) */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Username
              </label>
              <input
                type="text"
                readOnly
                value={userData?.username || ""}
                className="w-full h-11 px-4 rounded-lg text-sm outline-none cursor-not-allowed"
                style={{
                  background: "var(--color-overlay)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>

            {/* Email (read only) */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email
              </label>
              <input
                type="text"
                readOnly
                value={userData?.email || ""}
                className="w-full h-11 px-4 rounded-lg text-sm outline-none cursor-not-allowed"
                style={{
                  background: "var(--color-overlay)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              {(editingName || editingStatus) && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-ghost flex-1 h-11 text-sm rounded-lg flex items-center justify-center gap-2"
                >
                  <MdClose className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving || (!editingName && !editingStatus && !backendImage)}
                className="btn-accent flex-1 h-11 text-sm rounded-lg"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
