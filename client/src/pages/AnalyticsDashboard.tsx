import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Eye, Zap } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsDashboard() {
  const { user, loading: authLoading } = useAuth();
  
  // Fetch analytics data
  const overviewQuery = trpc.analytics.getOverview.useQuery(undefined, {
    enabled: !!user,
  });
  
  const topPagesQuery = trpc.analytics.getTopPages.useQuery({ limit: 10 }, {
    enabled: !!user,
  });
  
  const topEventsQuery = trpc.analytics.getTopEvents.useQuery({ limit: 10 }, {
    enabled: !!user,
  });
  
  const recentSessionsQuery = trpc.analytics.getRecentSessions.useQuery({ limit: 20 }, {
    enabled: !!user,
  });
  
  const pageEngagementQuery = trpc.analytics.getPageEngagement.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-mono">LOADING_ANALYTICS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">ACCESS DENIED</h1>
          <p className="text-muted-foreground font-mono">Admin authentication required</p>
        </div>
      </div>
    );
  }

  const isLoading = overviewQuery.isLoading || topPagesQuery.isLoading || topEventsQuery.isLoading;
  const overview = overviewQuery.data;
  const topPages = topPagesQuery.data || [];
  const topEvents = topEventsQuery.data || [];
  const recentSessions = recentSessionsQuery.data || [];

  const COLORS = ["#00ff41", "#ff0055", "#00d4ff", "#ffaa00", "#ff6b9d", "#00ff88"];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* CRT Overlay */}
      <div className="fixed inset-0 z-0 crt-overlay pointer-events-none opacity-50 mix-blend-overlay"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-primary/50 pb-6">
          <h1 className="text-4xl font-bold text-primary mb-2 glitch-text" data-text="ANALYTICS_DASHBOARD">
            ANALYTICS_DASHBOARD
          </h1>
          <p className="text-muted-foreground font-mono text-sm">Real-time visitor tracking and engagement metrics</p>
        </div>

        {/* Overview Stats */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Sessions */}
            <Card className="bg-black/80 border-primary rounded-none overflow-hidden">
              <CardHeader className="border-b border-primary/30 pb-2">
                <CardTitle className="text-primary font-mono text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  SESSIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-primary">
                  {overview?.totalSessions || 0}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">Total visitor sessions</p>
              </CardContent>
            </Card>

            {/* Total Page Views */}
            <Card className="bg-black/80 border-accent rounded-none overflow-hidden">
              <CardHeader className="border-b border-accent/30 pb-2">
                <CardTitle className="text-accent font-mono text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  PAGE_VIEWS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-accent">
                  {overview?.totalPageViews || 0}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">Total page impressions</p>
              </CardContent>
            </Card>

            {/* Total Events */}
            <Card className="bg-black/80 border-green-500 rounded-none overflow-hidden">
              <CardHeader className="border-b border-green-500/30 pb-2">
                <CardTitle className="text-green-500 font-mono text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  EVENTS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-green-500">
                  {overview?.totalEvents || 0}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">User interactions tracked</p>
              </CardContent>
            </Card>

            {/* Avg Session Duration */}
            <Card className="bg-black/80 border-yellow-500 rounded-none overflow-hidden">
              <CardHeader className="border-b border-yellow-500/30 pb-2">
                <CardTitle className="text-yellow-500 font-mono text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  AVG_DURATION
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-yellow-500">
                  {overview?.avgSessionDuration || 0}s
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">Average session length</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages Chart */}
          <Card className="bg-black/80 border-primary rounded-none overflow-hidden">
            <CardHeader className="border-b border-primary/30 pb-2">
              <CardTitle className="text-primary font-mono">TOP_PAGES</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {topPages.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topPages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00ff41" opacity={0.2} />
                    <XAxis dataKey="page" stroke="#00ff41" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#00ff41" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "1px solid #00ff41" }}
                      labelStyle={{ color: "#00ff41" }}
                    />
                    <Bar dataKey="views" fill="#00ff41" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground font-mono">
                  No page view data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Events Chart */}
          <Card className="bg-black/80 border-accent rounded-none overflow-hidden">
            <CardHeader className="border-b border-accent/30 pb-2">
              <CardTitle className="text-accent font-mono">TOP_EVENTS</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {topEvents.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topEvents}
                      dataKey="count"
                      nameKey="eventName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {topEvents.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "1px solid #ff0055" }}
                      labelStyle={{ color: "#ff0055" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground font-mono">
                  No event data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions Table */}
        <Card className="bg-black/80 border-primary rounded-none overflow-hidden">
          <CardHeader className="border-b border-primary/30 pb-2">
            <CardTitle className="text-primary font-mono">RECENT_SESSIONS</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentSessions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left py-2 px-2 text-primary">SESSION_ID</th>
                      <th className="text-left py-2 px-2 text-primary">START_TIME</th>
                      <th className="text-left py-2 px-2 text-primary">DURATION</th>
                      <th className="text-left py-2 px-2 text-primary">PAGES</th>
                      <th className="text-left py-2 px-2 text-primary">EVENTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session, idx) => (
                      <tr key={idx} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                        <td className="py-2 px-2 text-muted-foreground truncate max-w-xs">
                          {session.sessionId}
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">
                          {new Date(session.startTime).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-2 text-accent">
                          {session.duration || "—"}s
                        </td>
                        <td className="py-2 px-2 text-green-500">
                          {session.pageCount}
                        </td>
                        <td className="py-2 px-2 text-yellow-500">
                          {session.eventCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground font-mono">
                No session data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
