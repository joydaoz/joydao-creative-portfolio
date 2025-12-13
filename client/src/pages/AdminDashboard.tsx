import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Trash2, LogOut, Mail, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"messages" | "subscribers">("messages");

  const contactMessagesQuery = trpc.admin.getContactMessages.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const subscribersQuery = trpc.admin.getNewsletterSubscribers.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const unsubscribeMutation = trpc.admin.unsubscribeEmail.useMutation({
    onSuccess: () => {
      subscribersQuery.refetch();
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleUnsubscribe = (email: string) => {
    if (confirm(`Unsubscribe ${email} from newsletter?`)) {
      unsubscribeMutation.mutate({ email });
    }
  };

  return (
    <div className="min-h-screen bg-black text-primary font-mono">
      {/* Header */}
      <div className="border-b border-accent bg-black p-4 shadow-[0_0_15px_rgba(255,0,85,0.1)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent tracking-widest">ADMIN_TERMINAL</h1>
            <p className="text-xs text-muted-foreground mt-1">
              LOGGED_IN_AS: {user?.name || user?.email || "UNKNOWN"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-accent/30">
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 border-b-2 transition-all ${
              activeTab === "messages"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            CONTACT_MESSAGES ({contactMessagesQuery.data?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 border-b-2 transition-all ${
              activeTab === "subscribers"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            NEWSLETTER_SUBSCRIBERS ({subscribersQuery.data?.length || 0})
          </button>
        </div>

        {/* Contact Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            {contactMessagesQuery.isLoading ? (
              <div className="text-center py-8">
                <span className="text-accent animate-pulse">LOADING_MESSAGES...</span>
              </div>
            ) : contactMessagesQuery.data?.length === 0 ? (
              <div className="border border-accent/30 p-4 text-center text-muted-foreground">
                NO_MESSAGES_FOUND
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessagesQuery.data?.map((message) => (
                  <div
                    key={message.id}
                    className="border border-accent/30 p-4 hover:border-accent transition-all hover:shadow-[0_0_10px_rgba(255,0,85,0.1)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-accent font-bold">{message.name}</p>
                        <p className="text-xs text-muted-foreground">{message.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-primary text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Newsletter Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="space-y-4">
            {subscribersQuery.isLoading ? (
              <div className="text-center py-8">
                <span className="text-accent animate-pulse">LOADING_SUBSCRIBERS...</span>
              </div>
            ) : subscribersQuery.data?.length === 0 ? (
              <div className="border border-accent/30 p-4 text-center text-muted-foreground">
                NO_SUBSCRIBERS_FOUND
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-accent/30">
                      <th className="text-left p-3 text-accent">EMAIL</th>
                      <th className="text-left p-3 text-accent">SUBSCRIBED_DATE</th>
                      <th className="text-left p-3 text-accent">STATUS</th>
                      <th className="text-left p-3 text-accent">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribersQuery.data?.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="border-b border-accent/20 hover:bg-accent/5 transition-all"
                      >
                        <td className="p-3 text-primary">{subscriber.email}</td>
                        <td className="p-3 text-muted-foreground text-xs">
                          {new Date(subscriber.subscribedAt).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="text-primary font-bold">ACTIVE</span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUnsubscribe(subscriber.email)}
                            disabled={unsubscribeMutation.isPending}
                            className="flex items-center gap-1 px-2 py-1 text-xs border border-destructive text-destructive hover:bg-destructive hover:text-black transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            UNSUBSCRIBE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-accent/30 bg-black p-2 text-xs text-muted-foreground">
        <span className="text-accent">{">"}</span> SYSTEM_STATUS: ONLINE | LAST_REFRESH:{" "}
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
