// ── AI reply bubble + typing indicator ──────────────────────

// ── Typing indicator — three bouncing dots ───────────────────
export const TypingIndicator = () => (
  <div className="flex items-end gap-2 msg-enter">
    {/* AI avatar */}
    <div
      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-[10px] text-white"
      style={{ background: "linear-gradient(135deg, var(--color-accent), #818cf8)" }}
    >
      AI
    </div>

    {/* Dots bubble */}
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
      style={{
        background: "var(--color-elevated)",
        border: "1px solid var(--color-border)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-bounce"
        style={{ background: "var(--color-accent)", animationDelay: "0ms", animationDuration: "0.9s" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full animate-bounce"
        style={{ background: "var(--color-accent)", animationDelay: "180ms", animationDuration: "0.9s" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full animate-bounce"
        style={{ background: "var(--color-accent)", animationDelay: "360ms", animationDuration: "0.9s" }}
      />
    </div>
  </div>
);

// ── AI reply message bubble ───────────────────────────────────
const AIReceiverMessage = ({ message, image }) => (
  <div className="flex items-end gap-2 msg-enter">
    {/* AI avatar badge */}
    <div
      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-[10px] text-white"
      style={{ background: "linear-gradient(135deg, var(--color-accent), #818cf8)" }}
    >
      AI
    </div>

    {/* Reply bubble — dark surface, distinct from user's indigo */}
    <div
      className="max-w-[68%] px-4 py-2.5 rounded-2xl rounded-bl-sm flex flex-col gap-2 text-[14px] leading-relaxed"
      style={{
        background: "var(--color-elevated)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Subtle AI label */}
      <span
        className="text-[9px] font-bold uppercase tracking-widest -mb-0.5"
        style={{ color: "var(--color-accent)" }}
      >
        Chatify AI
      </span>
      {image && (
        <img
          src={image}
          alt="ai response"
          className="max-w-[220px] rounded-xl object-cover"
        />
      )}
      {message && (
        <span className="leading-relaxed">{message}</span>
      )}
    </div>
  </div>
);

export default AIReceiverMessage;
