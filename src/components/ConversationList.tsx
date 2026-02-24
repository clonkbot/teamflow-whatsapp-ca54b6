import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ConversationListProps {
  selectedId: Id<"conversations"> | null;
  onSelect: (id: Id<"conversations">) => void;
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const conversations = useQuery(api.conversations.list);
  const createConversation = useMutation(api.conversations.create);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.phone.trim()) return;

    const id = await createConversation({
      contactName: newContact.name,
      contactPhone: newContact.phone,
      isGroup: false,
    });
    setNewContact({ name: "", phone: "" });
    setShowNewChat(false);
    onSelect(id);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and New Chat */}
      <div className="p-3 md:p-4 space-y-3 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-[#0a0f0d] border border-emerald-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <button
          onClick={() => setShowNewChat(true)}
          className="w-full py-2.5 md:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all text-sm md:text-base"
        >
          + New Conversation
        </button>
      </div>

      {/* New Chat Form */}
      {showNewChat && (
        <div className="px-3 md:px-4 pb-3 md:pb-4 flex-shrink-0">
          <form onSubmit={handleCreate} className="bg-[#0a0f0d] border border-emerald-500/30 rounded-xl p-3 md:p-4 space-y-3">
            <input
              type="text"
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#111916] border border-emerald-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#111916] border border-emerald-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                className="flex-1 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-400 transition-colors text-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations === undefined ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-emerald-500/10 rounded w-3/4"></div>
                  <div className="h-3 bg-emerald-500/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 md:p-8 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm md:text-base">No conversations yet</p>
            <p className="text-gray-600 text-xs md:text-sm mt-1">Start a new conversation above</p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-500/10">
            {conversations.map((conversation: { _id: Id<"conversations">; contactName: string; lastMessage: string; lastMessageAt: number; unreadCount: number }) => (
              <button
                key={conversation._id}
                onClick={() => onSelect(conversation._id)}
                className={`w-full p-3 md:p-4 flex items-center gap-3 hover:bg-emerald-500/5 transition-all text-left ${
                  selectedId === conversation._id ? "bg-emerald-500/10" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    {conversation.contactName.charAt(0).toUpperCase()}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-white truncate text-sm md:text-base">{conversation.contactName}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(conversation.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 truncate mt-0.5">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
