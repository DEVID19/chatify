// ── AI reply bubble + typing indicator ──────────────────────
// White bubble with left-side AI avatar badge
// Distinct from the blue ReceiverMessage used in regular chats
// so users always know they're talking to the AI

// ── Typing indicator — three bouncing dots ───────────────────
export const TypingIndicator = () => (
  <div className="flex items-end gap-[10px]">
    {/* AI avatar */}
    <div className="w-[38px] h-[38px] rounded-full flex-shrink-0 bg-gradient-to-br from-[#19cdff] to-[#1797c2] flex items-center justify-center shadow-md shadow-gray-400">
      <span className="text-white text-[12px] font-extrabold tracking-tight">
        AI
      </span>
    </div>

    {/* Dots bubble */}
    <div className="bg-white border border-gray-200 px-[18px] py-[14px] rounded-2xl rounded-bl-none shadow-md shadow-gray-300 flex items-center gap-[6px]">
      <span
        className="w-[8px] h-[8px] bg-[#1797c2] rounded-full animate-bounce opacity-80"
        style={{ animationDelay: "0ms", animationDuration: "0.9s" }}
      />
      <span
        className="w-[8px] h-[8px] bg-[#1797c2] rounded-full animate-bounce opacity-80"
        style={{ animationDelay: "180ms", animationDuration: "0.9s" }}
      />
      <span
        className="w-[8px] h-[8px] bg-[#1797c2] rounded-full animate-bounce opacity-80"
        style={{ animationDelay: "360ms", animationDuration: "0.9s" }}
      />
    </div>
  </div>
);

// ── AI reply message bubble ───────────────────────────────────
const AIReceiverMessage = ({ message, image }) => (
  <div className="flex items-end gap-[10px]">
    {/* AI avatar badge */}
    <div className="w-[38px] h-[38px] rounded-full flex-shrink-0 bg-gradient-to-br from-[#19cdff] to-[#1797c2] flex items-center justify-center shadow-md shadow-gray-400">
      <span className="text-white text-[12px] font-extrabold tracking-tight">
        AI
      </span>
    </div>

    {/* Reply bubble — white to distinguish from user's blue */}
    <div className="w-fit max-w-[70%] bg-white border border-gray-200 px-[18px] py-[12px] text-gray-800 rounded-2xl rounded-bl-none shadow-md shadow-gray-300 flex flex-col gap-[8px] text-[17px]">
      {/* Subtle AI label inside bubble */}
      <span className="text-[10px] font-bold text-[#19cdff] uppercase tracking-widest -mb-1">
        Chatify AI
      </span>

      {image && (
        <img
          src={image}
          alt="ai response"
          className="w-[180px] rounded-xl object-cover"
        />
      )}
      {message && (
        <span className="leading-relaxed text-gray-700">{message}</span>
      )}
    </div>
  </div>
);

export default AIReceiverMessage;
