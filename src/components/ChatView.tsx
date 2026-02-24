import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ChatViewProps {
  conversationId: Id<"conversations">;
  onBack: () => void;
}

export function ChatView({ conversationId, onBack }: ChatViewProps) {
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const messages = useQuery(api.messages.list, { conversationId });
  const sendMessage = useMutation(api.messages.send);
  const markAsRead = useMutation(api.conversations.markAsRead);
  const simulateReceive = useMutation(api.messages.simulateReceive);
  const deleteConversation = useMutation(api.conversations.remove);

  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markAsRead({ id: conversationId });
    }
  }, [conversation, conversationId, markAsRead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage;
    setNewMessage("");

    await sendMessage({
      conversationId,
      content: messageContent,
      messageType: "text",
    });

    // Simulate a reply after a short delay
    setTimeout(() => {
      const replies = [
        "Got it, thanks! 👍",
        "I'll look into this right away.",
        "Perfect, let me check and get back to you.",
        "Thanks for the update!",
        "Understood, I'll handle it.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      simulateReceive({ conversationId, content: randomReply });
    }, 1500 + Math.random() * 2000);
  };

  const handleDelete = async () => {
    if (confirm("Delete this conversation?")) {
      await deleteConversation({ id: conversationId });
      onBack();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="bg-[#111916] border-b border-emerald-500/20 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors -ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {conversation.contactName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-white truncate text-sm md:text-base">{conversation.contactName}</h2>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a2420] border border-emerald-500/20 rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                >
                  Delete Conversation
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-[#0a0f0d]">
        {messages === undefined ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-600 text-sm mt-1">Send your first message below</p>
          </div>
        ) : (
          messages.map((message: { _id: string; sender: string; content: string; createdAt: number; status: string }) => (
            <div
              key={message._id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] px-3 py-2 md:px-4 md:py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md"
                    : "bg-[#1a2420] text-white border border-emerald-500/20 rounded-bl-md"
                }`}
              >
                <p className="text-sm md:text-base break-words">{message.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  message.sender === "user" ? "text-white/60" : "text-gray-500"
                }`}>
                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                  {message.sender === "user" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {message.status === "read" ? (
                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                      ) : message.status === "delivered" ? (
                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41z"/>
                      ) : (
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      )}
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="bg-[#111916] border-t border-emerald-500/20 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="p-2 md:p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 md:py-3 bg-[#0a0f0d] border border-emerald-500/20 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 md:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
