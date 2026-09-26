import { useState } from 'react';
import { FiCalendar, FiSend, FiShare2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { WS_MESSAGES } from '@/data/workspace-demo';
import { WsPanel } from '@/components/workspace/WsUi';

export default function WorkspaceMessages() {
  const [activeId, setActiveId] = useState(WS_MESSAGES[0]?.id);
  const active = WS_MESSAGES.find((m) => m.id === activeId) || WS_MESSAGES[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr_15rem] xl:grid-cols-[18rem_1fr_16rem]">
      <WsPanel className="overflow-hidden">
        <div className="border-b border-emerald-900/5 px-4 py-3">
          <h2 className="text-sm font-bold text-[#0b2f24]">Conversations</h2>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto">
          {WS_MESSAGES.map((msg) => (
            <li key={msg.id}>
              <button
                type="button"
                onClick={() => setActiveId(msg.id)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                  activeId === msg.id ? 'bg-emerald-50' : 'hover:bg-emerald-50/50'
                }`}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: msg.color }}
                >
                  {msg.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-[#0b2f24]">{msg.name}</span>
                    <span className="text-[11px] text-gray-400">{msg.time}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-xs text-gray-500">{msg.property}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </WsPanel>

      <WsPanel className="flex min-h-[28rem] flex-col overflow-hidden">
        <div className="border-b border-emerald-900/5 px-4 py-3">
          <p className="font-bold text-[#0b2f24]">{active?.name}</p>
          <p className="text-xs text-gray-500">{active?.property}</p>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f7faf8] p-4">
          <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm">
            {active?.snippet}
          </div>
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-emerald-600 px-3.5 py-2.5 text-sm text-white shadow-sm">
            Thanks for reaching out — I can arrange a viewing this weekend. What time works for you?
          </div>
          <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm">
            Saturday morning would be perfect if that is available.
          </div>
        </div>
        <form
          className="flex gap-2 border-t border-emerald-900/5 p-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            placeholder="Type a message…"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-full bg-[#0b2f24] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <FiSend /> Send
          </button>
        </form>
      </WsPanel>

      <div className="space-y-4">
        <WsPanel className="overflow-hidden">
          <div className="border-b border-emerald-900/5 px-4 py-3">
            <h3 className="text-sm font-bold text-[#0b2f24]">Property Details</h3>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=360&fit=crop"
            alt=""
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="p-4">
            <p className="font-bold text-[#0b2f24]">{active?.property}</p>
            <p className="mt-1 text-sm text-emerald-700">₦350,000,000</p>
          </div>
        </WsPanel>
        <WsPanel className="p-4">
          <h3 className="text-sm font-bold text-[#0b2f24]">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <Link
              to="/workspace/bookings"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium hover:bg-emerald-50"
            >
              <FiCalendar className="text-emerald-700" /> Schedule Inspection
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium hover:bg-emerald-50"
            >
              <FiShare2 className="text-emerald-700" /> Share Property
            </button>
          </div>
        </WsPanel>
      </div>
    </div>
  );
}
