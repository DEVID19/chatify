import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedUser, setuserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }
      const result = await axios.post(
        `${server}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      dispatch(setuserData(result.data.user));
      dispatch(setSelectedUser(null));
      navigate("/");
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex"
      style={{ background: "var(--color-base)", fontFamily: "var(--font-sans)" }}
    >
      {/* ── Left branding panel (hidden on mobile) ─────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-20"
          style={{ background: "var(--color-accent)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          {/* Logo */}
          <div className="relative mb-8">
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-40"
              style={{ background: "var(--color-accent)" }}
            />
            <img
              src="/logo.svg"
              alt="Chatify"
              className="relative w-24 h-24 rounded-3xl"
              style={{
                border: "1px solid var(--color-border-hover)",
                boxShadow: "var(--shadow-accent)",
              }}
            />
          </div>

          <h1
            className="text-4xl font-extrabold tracking-tight mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Chatify
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            The messaging platform built for real conversations. Fast, private, and beautifully designed.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {["Real-time", "AI-powered", "Group chats", "Image sharing"].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--color-accent-muted)",
                  color: "var(--color-accent)",
                  border: "1px solid rgba(91,95,239,0.2)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <img src="/logo.svg" alt="Chatify" className="w-9 h-9 rounded-xl" />
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Chatify
          </span>
        </div>

        <div className="w-full max-w-sm">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            Welcome back
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            Sign in to your account to continue
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="chat-input h-11 px-4 w-full"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="chat-input h-11 px-4 pr-16 w-full"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm font-medium text-center"
                style={{ color: "var(--color-danger)" }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-accent h-11 w-full mt-2 text-sm rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p
            className="text-sm text-center mt-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold transition-colors"
              style={{ color: "var(--color-accent)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--color-accent-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--color-accent)"; }}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
