import React, { useState, useEffect } from "react";
import { Save, FolderOpen, Trash2, Download, Upload } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  tools?: string[];
  examples?: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationManagerProps {
  messages: Message[];
  onLoadConversation: (messages: Message[]) => void;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({
  messages,
  onLoadConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("qualitybot-conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(
          parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
          }))
        );
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    }
  }, []);

  const saveConversation = () => {
    if (messages.length <= 1) return; // Don't save if only initial message

    const title =
      messages[1]?.content.slice(0, 50) + "..." || "New Conversation";
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [...messages],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedConversations = [...conversations, conversation];
    setConversations(updatedConversations);
    localStorage.setItem(
      "qualitybot-conversations",
      JSON.stringify(updatedConversations)
    );
  };

  const loadConversation = (conversation: Conversation) => {
    onLoadConversation(conversation.messages);
    setShowManager(false);
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(updatedConversations);
    localStorage.setItem(
      "qualitybot-conversations",
      JSON.stringify(updatedConversations)
    );
  };

  const exportConversation = (conversation: Conversation) => {
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conversation-${conversation.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConversation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const conversation = JSON.parse(e.target?.result as string);
        const updatedConversations = [...conversations, conversation];
        setConversations(updatedConversations);
        localStorage.setItem(
          "qualitybot-conversations",
          JSON.stringify(updatedConversations)
        );
      } catch (error) {
        console.error("Error importing conversation:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button
        onClick={() => setShowManager(true)}
        className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-200 border border-purple-500/30"
      >
        <FolderOpen size={16} />
        Conversations
      </button>

      {showManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center conversation-manager-modal p-2 sm:p-4">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto relative conversation-manager-content mx-auto my-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
                Conversation Manager
              </h2>
              <button
                onClick={() => setShowManager(false)}
                className="text-gray-400 hover:text-white text-lg sm:text-xl"
                title="Close conversation manager"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={saveConversation}
                  disabled={messages.length <= 1}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-200 border border-green-500/30 disabled:opacity-50 w-full justify-center sm:w-auto"
                >
                  <Save size={16} />
                  Save Current
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 border border-blue-500/30 cursor-pointer w-full justify-center sm:w-auto">
                  <Upload size={16} />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importConversation}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2 text-sm sm:text-base">
                      📁 No saved conversations yet
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Start chatting with QualityBot and save your conversations
                      for later reference
                    </p>
                    <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-300 text-xs sm:text-sm">
                        💡 <strong>Tip:</strong> After having a conversation,
                        click "Save Current" to store it here
                      </p>
                    </div>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-black/30 border border-purple-500/30 rounded-lg hover:bg-black/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="text-purple-300 font-medium group-hover:text-purple-200 transition-colors duration-200 text-sm sm:text-base">
                          {conversation.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                          {conversation.messages.length} messages •{" "}
                          {conversation.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadConversation(conversation);
                          }}
                          className="p-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded"
                          title="Load conversation"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportConversation(conversation);
                          }}
                          className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded"
                          title="Export conversation"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                          className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded"
                          title="Delete conversation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
