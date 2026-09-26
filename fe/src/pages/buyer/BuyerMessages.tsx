import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { BUYER_MESSAGES } from '@/data/buyer-demo';
import { BuyerCard } from '@/components/buyer/BuyerUi';

export default function BuyerMessages() {
  const [activeId, setActiveId] = useState(BUYER_MESSAGES[0]?.id);
  const active = BUYER_MESSAGES.find((m) => m.id === activeId) || BUYER_MESSAGES[0];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Chat with agents and PropertyArena support.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <BuyerCard className="overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-3">
            <input
              placeholder="Search conversations…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <ul className="max-h-[28rem] overflow-y-auto">
            {BUYER_MESSAGES.map((msg) => (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(msg.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    activeId === msg.id ? 'bg-emerald-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: msg.color }}
                  >
                    {msg.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-900">{msg.name}</span>
                      <span className="text-[11px] text-gray-400">{msg.time}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-gray-500">{msg.snippet}</span>
                  </span>
                  {msg.unread ? (
                    <span className="mt-1 rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                      {msg.unread}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </BuyerCard>

        <BuyerCard className="flex min-h-[28rem] flex-col overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="font-bold text-gray-900">{active?.name}</p>
            <p className="text-xs text-gray-500">Usually replies within a few hours</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f8faf9] p-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm">
              {active?.snippet}
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-emerald-600 px-3.5 py-2.5 text-sm text-white shadow-sm">
              Thanks — I am free Saturday morning if that works.
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm">
              Perfect. I will confirm the viewing slot shortly.
            </div>
          </div>
          <form className="flex gap-2 border-t border-gray-100 p-3" onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <FiSend /> Send
            </button>
          </form>
        </BuyerCard>
      </div>
    </div>
  );
}
