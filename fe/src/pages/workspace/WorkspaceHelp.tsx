import { FiBookOpen, FiFileText, FiHelpCircle, FiMail, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { WsPanel } from '@/components/workspace/WsUi';

const TOPICS = [
  {
    title: 'FAQs',
    body: 'Answers on listings, leads, billing, and account access.',
    icon: FiHelpCircle,
    to: '/help',
  },
  {
    title: 'Contact Support',
    body: 'Reach our team for billing or technical issues.',
    icon: FiMail,
    to: '/contact',
  },
  {
    title: 'Terms & Conditions',
    body: 'Platform rules for agents, landlords, and developers.',
    icon: FiFileText,
    to: '/terms',
  },
];

export default function WorkspaceHelp() {
  return (
    <div className="space-y-5">
      <WsPanel className="p-6 text-center sm:p-8">
        <FiBookOpen className="mx-auto text-3xl text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-[#0b2f24]">How can we help?</h2>
        <div className="relative mx-auto mt-4 max-w-lg">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search help topics…"
            className="w-full rounded-full border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </WsPanel>

      <div className="grid gap-4 sm:grid-cols-3">
        {TOPICS.map(({ title, body, icon: Icon, to }) => (
          <Link key={title} to={to} className="block">
            <WsPanel className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon />
              </span>
              <p className="mt-3 font-bold text-[#0b2f24]">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{body}</p>
            </WsPanel>
          </Link>
        ))}
      </div>

      <WsPanel className="flex flex-col items-start justify-between gap-4 bg-gradient-to-r from-[#0b2f24] to-[#166534] p-6 text-white sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Need help right away?</p>
          <p className="mt-1 text-sm text-emerald-100/85">Our support team is available 24/7.</p>
        </div>
        <Link
          to="/contact"
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#0b2f24]"
        >
          Contact Support
        </Link>
      </WsPanel>
    </div>
  );
}
