import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { ConversationList } from "./ConversationList";
import { ChatView } from "./ChatView";
import { TeamPanel } from "./TeamPanel";
import { SettingsModal } from "./SettingsModal";
import { Id } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<"chats" | "team" | "settings">("chats");
  const [selectedConversation, setSelectedConversation] = useState<Id<"conversations"> | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const myProfile = useQuery(api.teamMembers.getMyProfile);
  const createProfile = useMutation(api.teamMembers.create);

  // Create profile if needed
  useEffect(() => {
    if (myProfile === null) {
      createProfile({
        name: "Team Member",
        role: "Member",
      });
    }
  }, [myProfile, createProfile]);

  // Close sidebar when conversation is selected on mobile
  useEffect(() => {
    if (selectedConversation && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [selectedConversation]);

  return (
    <div className="h-screen bg-[#0a0f0d] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#111916] border-b border-emerald-500/20 px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-white">Team<span className="text-emerald-400">Flow</span></h1>
                <p className="text-xs text-gray-500">WhatsApp Integration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 md:p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
              title="Settings"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => signOut()}
              className="px-3 py-2 md:px-4 md:py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-medium transition-all text-sm md:text-base"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-30
          w-80 md:w-96 bg-[#111916] border-r border-emerald-500/20
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          {/* Tabs */}
          <div className="flex border-b border-emerald-500/20 flex-shrink-0">
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 py-3 md:py-4 font-semibold text-sm transition-all ${
                activeTab === "chats"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex-1 py-3 md:py-4 font-semibold text-sm transition-all ${
                activeTab === "team"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Team
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chats" && (
              <ConversationList
                selectedId={selectedConversation}
                onSelect={(id) => {
                  setSelectedConversation(id);
                  setSidebarOpen(false);
                }}
              />
            )}
            {activeTab === "team" && <TeamPanel />}
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col min-w-0">
          {selectedConversation ? (
            <ChatView
              conversationId={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Start a Conversation</h2>
                <p className="text-gray-500 text-sm md:text-base">Select a chat from the sidebar or create a new conversation to get started.</p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mt-6 lg:hidden px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium"
                >
                  Open Chats
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#111916] border-t border-emerald-500/10 py-2 text-center flex-shrink-0">
        <p className="text-gray-600 text-xs">
          Requested by <span className="text-gray-500">@davionjm</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
