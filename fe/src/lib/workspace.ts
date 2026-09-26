import type { IconType } from 'react-icons';
import {
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiHelpCircle,
  FiHome,
  FiMessageSquare,
  FiPackage,
  FiPlus,
  FiSettings,
  FiShoppingBag,
  FiTag,
  FiUser,
  FiUsers,
  FiBriefcase,
  FiShield,
} from 'react-icons/fi';
import { FaHandshake } from 'react-icons/fa';

export type WorkspaceRole = 'agent' | 'landlord' | 'developer' | 'agency';

export const WORKSPACE_ROLES: WorkspaceRole[] = [
  'agent',
  'landlord',
  'developer',
  'agency',
];

export function isWorkspaceRole(role?: string | null): role is WorkspaceRole {
  return WORKSPACE_ROLES.includes(String(role || '').toLowerCase() as WorkspaceRole);
}

export function normalizeWorkspaceRole(role?: string | null): WorkspaceRole {
  const r = String(role || '').toLowerCase();
  if (r === 'landlord' || r === 'developer' || r === 'agency') return r;
  return 'agent';
}

export type WorkspaceNavItem = {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
  badge?: number;
};

export type WorkspaceNavSection = {
  title: string;
  items: WorkspaceNavItem[];
};

export const WORKSPACE_NAV: WorkspaceNavSection[] = [
  {
    title: 'Workspace',
    items: [
      { to: '/workspace', label: 'Dashboard', icon: FiHome, end: true },
      { to: '/workspace/post-property', label: 'Post a Property', icon: FiPlus },
      { to: '/workspace/listings', label: 'My Listings', icon: FiBriefcase },
      { to: '/workspace/buyer-requests', label: 'Buyer Requests', icon: FiUsers },
      { to: '/workspace/messages', label: 'Messages', icon: FiMessageSquare, badge: 5 },
      { to: '/workspace/leads', label: 'Leads & Enquiries', icon: FiShoppingBag },
      { to: '/workspace/bookings', label: 'Bookings & Inspections', icon: FiCalendar },
      { to: '/workspace/deals', label: 'Deals', icon: FaHandshake },
      { to: '/workspace/reports', label: 'Reports', icon: FiBarChart2 },
    ],
  },
  {
    title: 'Monetization',
    items: [
      { to: '/workspace/packages', label: 'Packages & Pricing', icon: FiTag },
      { to: '/workspace/subscription', label: 'Subscription', icon: FiPackage },
      { to: '/workspace/billing', label: 'Billing History', icon: FiCreditCard },
    ],
  },
  {
    title: 'Account',
    items: [
      { to: '/workspace/profile', label: 'Profile', icon: FiUser },
      { to: '/workspace/kyc', label: 'Get Verified (KYC)', icon: FiShield },
      { to: '/workspace/notifications', label: 'Notifications', icon: FiBell, badge: 3 },
      { to: '/workspace/settings', label: 'Settings', icon: FiSettings },
      { to: '/workspace/help', label: 'Help & Support', icon: FiHelpCircle },
    ],
  },
];

const ROLE_COPY: Record<
  WorkspaceRole,
  {
    arenaLabel: string;
    sectionTitle: string;
    welcomeHint: string;
    primaryCta: string;
    secondaryCta: string;
    listingsLabel: string;
  }
> = {
  agent: {
    arenaLabel: 'AGENT ARENA',
    sectionTitle: 'Agent Workspace',
    welcomeHint: "Here's what's happening with your listings, enquiries and clients.",
    primaryCta: 'Post a property',
    secondaryCta: 'Browse buyer requests',
    listingsLabel: 'Your Listings',
  },
  agency: {
    arenaLabel: 'AGENCY ARENA',
    sectionTitle: 'Agency Workspace',
    welcomeHint: "Track your team's listings, enquiries, and deal pipeline in one place.",
    primaryCta: 'Post a property',
    secondaryCta: 'Browse buyer requests',
    listingsLabel: 'Agency Listings',
  },
  landlord: {
    arenaLabel: 'LANDLORD ARENA',
    sectionTitle: 'Landlord Workspace',
    welcomeHint: 'Manage rentals, inspections, and tenant enquiries from one desk.',
    primaryCta: 'List a rental',
    secondaryCta: 'View enquiries',
    listingsLabel: 'Your Rentals',
  },
  developer: {
    arenaLabel: 'DEVELOPER ARENA',
    sectionTitle: 'Developer Workspace',
    welcomeHint: "Here's how your projects, units, and buyer interest are performing.",
    primaryCta: 'Add a unit',
    secondaryCta: 'View enquiries',
    listingsLabel: 'Project Inventory',
  },
};

export function getWorkspaceCopy(role?: string | null) {
  return ROLE_COPY[normalizeWorkspaceRole(role)];
}

export function workspacePageTitle(pathname: string): string {
  for (const section of WORKSPACE_NAV) {
    for (const item of section.items) {
      if (item.end) {
        if (pathname === item.to) return item.label;
      } else if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
        return item.label;
      }
    }
  }
  return 'Workspace';
}
