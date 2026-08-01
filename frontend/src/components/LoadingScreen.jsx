import React from "react";
import { RiChat3Fill } from "react-icons/ri";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 w-full h-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden z-50 select-none">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-sky-400/15 to-blue-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-cyan-400/20 rounded-full blur-[70px] animate-ping duration-[3000ms]" />

      {/* Main Glass Card */}
      <div className="relative z-10 flex flex-col items-center p-10 sm:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-cyan-950/50 max-w-sm w-[90%]">
        
        {/* Icon Container */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-xl animate-pulse" />
          <img
            src="/logo.svg"
            alt="Chatify Logo"
            className="w-20 h-20 rounded-2xl shadow-lg shadow-cyan-500/30 border border-white/20 transform hover:scale-105 transition-transform"
          />
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-1.5 mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-400">
            Chatify
          </h1>
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Tagline */}
        <p className="text-slate-400 text-sm font-medium tracking-wide mb-8 text-center">
          Connecting to network...
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full space-y-3">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 rounded-full w-full origin-left animate-[loadingBar_1.8s_ease-in-out_infinite]" />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-cyan-300/80 tracking-wider uppercase">
            <span>Loading</span>
            <span className="flex gap-1">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
