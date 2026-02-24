import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type TeamMemberStatus = "online" | "away" | "offline";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  status: TeamMemberStatus;
  whatsappConnected: boolean;
}

interface ActivityLog {
  _id: string;
  details: string;
  createdAt: number;
}

export function TeamPanel() {
  const teamMembers = useQuery(api.teamMembers.list);
  const myProfile = useQuery(api.teamMembers.getMyProfile);
  const updateStatus = useMutation(api.teamMembers.updateStatus);
  const activityLogs = useQuery(api.activity.list);

  const statusColors = {
    online: "bg-emerald-400",
    away: "bg-yellow-400",
    offline: "bg-gray-500",
  };

  const statusLabels = {
    online: "Online",
    away: "Away",
    offline: "Offline",
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* My Status */}
      {myProfile && (
        <div className="p-3 md:p-4 border-b border-emerald-500/20">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Status</h3>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                {myProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 ${statusColors[myProfile.status as TeamMemberStatus]} rounded-full border-2 border-[#111916]`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm md:text-base truncate">{myProfile.name}</p>
              <p className="text-xs text-gray-500 truncate">{myProfile.role}</p>
            </div>
            <select
              value={myProfile.status}
              onChange={(e) => updateStatus({ status: e.target.value as "online" | "offline" | "away" })}
              className="bg-[#0a0f0d] border border-emerald-500/20 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="p-3 md:p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Team Members</h3>
        {teamMembers === undefined ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-emerald-500/10 rounded w-3/4"></div>
                  <div className="h-3 bg-emerald-500/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No team members yet</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {teamMembers.map((member: TeamMember) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-2 md:p-3 bg-[#0a0f0d]/50 rounded-xl hover:bg-emerald-500/5 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400/80 to-teal-500/80 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 ${statusColors[member.status as TeamMemberStatus]} rounded-full border-2 border-[#111916]`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{member.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 truncate">{member.role}</span>
                    {member.whatsappConnected && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        </svg>
                        Connected
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs ${
                  member.status === "online" ? "text-emerald-400" :
                  member.status === "away" ? "text-yellow-400" : "text-gray-500"
                }`}>
                  {statusLabels[member.status as TeamMemberStatus]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="p-3 md:p-4 border-t border-emerald-500/20">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Activity</h3>
        {activityLogs === undefined ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-emerald-500/10 rounded-lg"></div>
            ))}
          </div>
        ) : activityLogs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {activityLogs.slice(0, 10).map((log: ActivityLog) => (
              <div key={log._id} className="px-3 py-2 bg-[#0a0f0d]/50 rounded-lg">
                <p className="text-xs md:text-sm text-gray-300 line-clamp-2">{log.details}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(log.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
