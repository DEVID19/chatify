import React from "react";

const LoadingScreen = () => {
  return (
    <div
      style={{ background: "var(--color-base)" }}
      className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-50 select-none"
    >
      {/* Ambient glow blobs */}
      <div
        style={{ background: "var(--color-accent-glow)" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-pulse"
      />

      {/* Card */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
        className="relative z-10 flex flex-col items-center px-12 py-14 rounded-3xl max-w-sm w-[90%]"
      >
        {/* Logo container with glow ring */}
        <div className="relative mb-8">
          <div
            style={{ background: "var(--color-accent-glow)" }}
            className="absolute inset-0 rounded-2xl blur-xl scale-110"
          />
          <img
            src="/logo.svg"
            alt="Chatify"
            className="relative w-20 h-20 rounded-2xl"
            style={{
              border: "1px solid var(--color-border-hover)",
              boxShadow: "var(--shadow-accent)",
            }}
          />
        </div>

        {/* Brand */}
        <h1
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
          className="text-3xl font-extrabold tracking-tight mb-1"
        >
          Chatify
        </h1>
        <p
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          className="text-sm font-medium tracking-wide mb-8"
        >
          Connecting to network
        </p>

        {/* Progress bar */}
        <div
          style={{ background: "var(--color-elevated)", border: "1px solid var(--color-border)" }}
          className="w-full h-1 rounded-full overflow-hidden"
        >
          <div
            style={{ background: "var(--color-accent)" }}
            className="h-full rounded-full animate-[loadingBar_1.8s_ease-in-out_infinite]"
          />
        </div>

        {/* Status row */}
        <div className="flex items-center gap-2 mt-4">
          <span
            style={{ background: "var(--color-accent)" }}
            className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"
          />
          <span
            style={{ background: "var(--color-accent)" }}
            className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"
          />
          <span
            style={{ background: "var(--color-accent)" }}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
