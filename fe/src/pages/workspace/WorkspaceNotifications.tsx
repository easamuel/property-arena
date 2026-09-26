import { WS_NOTIFICATIONS } from '@/data/workspace-demo';
import { WsPanel } from '@/components/workspace/WsUi';

export default function WorkspaceNotifications() {
  return (
    <WsPanel>
      <ul className="divide-y divide-emerald-900/5">
        {WS_NOTIFICATIONS.map((n) => (
          <li key={n.id} className={`flex gap-3 px-4 py-4 sm:px-5 ${n.unread ? 'bg-emerald-50/40' : ''}`}>
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.unread ? 'bg-emerald-600' : 'bg-gray-300'}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#0b2f24]">{n.title}</p>
                <span className="shrink-0 text-xs text-gray-400">{n.time}</span>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{n.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </WsPanel>
  );
}
