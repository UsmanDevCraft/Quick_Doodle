import React, { useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import Button from "@/components/Button/Button";
import { ChatBoxProps } from "@/types/app/Game/game";

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  chatMessage,
  setChatMessage,
  username,
  aityping,
  handleChatSubmit,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="lg:col-span-2 bg-white/10 rounded-xl border border-white/20 p-4 flex flex-col max-h-[400px] overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
        <MessageCircle className="text-blue-400" size={20} />
        <h2 className="text-xl text-white font-semibold">Chat</h2>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin"
      >
        {messages.map((m) =>
          m.isSystem ? (
            <p key={m.id} className="text-center text-gray-400 italic text-sm">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className="bg-white/5 rounded-lg p-3">
              <p className="text-purple-400 font-semibold text-sm mb-1">
                {m.player === username ? "You" : m.player}
              </p>
              <p className="text-white">{m.text}</p>
            </div>
          )
        )}
      </div>

      {/* AI Typing Indicator */}
      {aityping && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-600/20 border border-orange-500/30 rounded-lg backdrop-blur-sm">
          <span className="text-2xl">🤖</span>
          <span className="text-white font-medium">Riddler AI is typing</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      )}

      {/* Input + Send */}
      <div className="flex gap-2">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (aityping || !chatMessage.trim()) return;
              handleChatSubmit();
            }
          }}
          placeholder="Type message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button
          onClick={() => {
            if (!aityping) handleChatSubmit();
          }}
          variant="primary"
          icon={<Send />}
          disabled={!chatMessage.trim() || aityping}
          className=" disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
